import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedDocumentUploader, type DocumentFile } from '@/components/themed-document-uploader';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUserDataStore } from '@/store/userData';
import sendEssayDocument from '@/utils/sendEssayDocument';

const MAX_FILES = 1;
const ICON_SIZE = 20;

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';
type PendingSource = 'picker' | 'share';

interface PendingFile {
    uri: string;
    name: string;
    mimeType?: string;
    source: PendingSource;
}

function useIncomingUrl(onUrl: (url: string) => void) {
    useEffect(() => {
        void Linking.getInitialURL().then((url) => { if (url !== null) onUrl(url); });
        const sub = Linking.addEventListener('url', ({ url }) => onUrl(url));
        return () => sub.remove();
    }, [onUrl]);
}

function useEssaySubmit() {
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);

    const submit = useCallback(async () => {
        if (pendingFile === null) return;
        setStatus('loading');
        setErrorMessage(null);
        try {
            await sendEssayDocument({ uri: pendingFile.uri, name: pendingFile.name, mimeType: pendingFile.mimeType });
            setStatus('success');
            setPendingFile(null);
        } catch {
            setStatus('error');
            setErrorMessage('Failed to upload document. Please try again.');
        }
    }, [pendingFile]);

    return { status, errorMessage, pendingFile, setPendingFile, submit };
}

interface SharedFilePreviewProps {
    name: string;
    onDismiss: () => void;
}

function SharedFilePreview({ name, onDismiss }: SharedFilePreviewProps) {
    const iconColor = useThemeColor({}, 'icon');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const errorColor = useThemeColor({}, 'error');

    return (
        <View style={[styles.sharedFile, { backgroundColor: cardColor, borderColor }]}>
            <Ionicons name="document-text-outline" size={ICON_SIZE} color={iconColor} />
            <ThemedText numberOfLines={1} style={styles.sharedFileName}>{name}</ThemedText>
            <Pressable onPress={onDismiss} hitSlop={8}>
                <Ionicons name="close-circle" size={ICON_SIZE} color={errorColor} />
            </Pressable>
        </View>
    );
}

interface SubmitFeedbackProps {
    status: SubmitStatus;
    errorMessage: string | null;
}

function SubmitFeedback({ status, errorMessage }: SubmitFeedbackProps) {
    const tintColor = useThemeColor({}, 'tint');
    const successColor = useThemeColor({}, 'success');
    const errorColor = useThemeColor({}, 'error');

    if (status === 'loading') return <ActivityIndicator color={tintColor} />;
    if (status === 'success') return <ThemedText style={[styles.message, { color: successColor }]}>Document uploaded successfully!</ThemedText>;
    if (status === 'error' && errorMessage !== null) return <ThemedText style={[styles.message, { color: errorColor }]}>{errorMessage}</ThemedText>;
    return null;
}

export function EssayDocumentSubmitter() {
    const uuid = useUserDataStore((state) => state.uuid);
    const username = useUserDataStore((state) => state.username);
    const errorColor = useThemeColor({}, 'error');
    const tintColor = useThemeColor({}, 'tint');
    const bgColor = useThemeColor({}, 'background');
    const { status, errorMessage, pendingFile, setPendingFile, submit } = useEssaySubmit();

    const handleIncomingUrl = useCallback((url: string) => {
        setPendingFile({ uri: url, name: url.split('/').pop() ?? 'document.pdf', source: 'share' });
    }, [setPendingFile]);

    useIncomingUrl(handleIncomingUrl);

    const handleFilesChange = useCallback((files: DocumentFile[]) => {
        const file = files.at(0);
        setPendingFile(file !== undefined ? { uri: file.uri, name: file.name, mimeType: file.mimeType, source: 'picker' } : null);
    }, [setPendingFile]);

    if (uuid === null || username === null) {
        return <ThemedText style={[styles.message, { color: errorColor }]}>User data is missing. Document cannot be shared.</ThemedText>;
    }

    const isLoading = status === 'loading';
    const canSubmit = pendingFile !== null && !isLoading;

    return (
        <View style={styles.container}>
            <View style={isLoading ? styles.disabled : undefined}>
                <ThemedDocumentUploader maxFiles={MAX_FILES} onFilesChange={handleFilesChange} />
            </View>
            {pendingFile?.source === 'share' && <SharedFilePreview name={pendingFile.name} onDismiss={() => setPendingFile(null)} />}
            <SubmitFeedback status={status} errorMessage={errorMessage} />
            <Pressable
                onPress={() => void submit()}
                disabled={!canSubmit}
                style={[styles.sendBtn, { backgroundColor: tintColor }, !canSubmit && styles.disabled]}
            >
                <ThemedText style={[styles.sendText, { color: bgColor }]}>Send</ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    disabled: {
        opacity: 0.5,
    },
    message: {
        textAlign: 'center',
    },
    sendBtn: {
        alignItems: 'center',
        borderRadius: 10,
        paddingVertical: 12,
    },
    sendText: {
        fontWeight: '600',
    },
    sharedFile: {
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 10,
        padding: 12,
    },
    sharedFileName: {
        flex: 1,
    },
});
