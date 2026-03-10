import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';

import { ThemedDocumentUploader, type DocumentFile } from '@/components/themed-document-uploader';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useUserDataStore } from '@/store/userData';
import sendEssayDocument from '@/utils/sendEssayDocument';

const MAX_FILES = 1;
const DISABLED_OPACITY = 0.5;

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export function EssayDocumentSubmitter() {
    const uuid = useUserDataStore((state) => state.uuid);
    const name = useUserDataStore((state) => state.name);
    const errorColor = useThemeColor({}, 'error');
    const tintColor = useThemeColor({}, 'tint');
    const successColor = useThemeColor({}, 'success');
    const [status, setStatus] = useState<SubmitStatus>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const submit = useCallback(async (uri: string, fileName: string, mimeType?: string) => {
        setStatus('loading');
        setErrorMessage(null);
        try {
            await sendEssayDocument({ uri, name: fileName, mimeType });
            setStatus('success');
        } catch {
            setStatus('error');
            setErrorMessage('Failed to upload document. Please try again.');
        }
    }, []);

    const handleIncomingUrl = useCallback((url: string) => {
        void submit(url, url.split('/').pop() ?? 'document.pdf');
    }, [submit]);

    useEffect(() => {
        void Linking.getInitialURL().then((url) => { if (url !== null) handleIncomingUrl(url); });
        const sub = Linking.addEventListener('url', ({ url }) => handleIncomingUrl(url));
        return () => sub.remove();
    }, [handleIncomingUrl]);

    const handleFilesChange = useCallback((files: DocumentFile[]) => {
        const file = files.at(0);
        if (file === undefined) return;
        void submit(file.uri, file.name, file.mimeType);
    }, [submit]);

    if (uuid === null || name === null) {
        return <ThemedText style={[styles.message, { color: errorColor }]}>User data is missing. Document cannot be shared.</ThemedText>;
    }

    return (
        <View>
            <View style={status === 'loading' ? styles.disabled : undefined}>
                <ThemedDocumentUploader maxFiles={MAX_FILES} onFilesChange={handleFilesChange} />
            </View>
            {status === 'loading' && <ActivityIndicator color={tintColor} />}
            {status === 'success' && <ThemedText style={[styles.message, { color: successColor }]}>Document uploaded successfully!</ThemedText>}
            {status === 'error' && errorMessage !== null && <ThemedText style={[styles.message, { color: errorColor }]}>{errorMessage}</ThemedText>}
        </View>
    );
}

const styles = StyleSheet.create({
    disabled: {
        opacity: DISABLED_OPACITY,
    },
    message: {
        textAlign: 'center',
    },
});
