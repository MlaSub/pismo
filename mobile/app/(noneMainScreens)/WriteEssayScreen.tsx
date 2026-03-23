import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';

import { ThemedInput } from '@/components/themed-input';
import ThemedScroll from '@/components/themed-scroll';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useWriteEssayStore } from '@/store/writeEssay';
import { latinToCyrillic } from '@/utils/latinToRussianCyrillic';

const AUTOSAVE_INTERVAL = 1000;
const CONTENT_INPUT_HEIGHT = 360;

type WriteMode = 'latin' | 'cyrillic';

interface HeaderProps {
    isSaving: boolean;
    onCopy: () => void;
    onSave: () => void;
}

interface ModeToggleProps {
    mode: WriteMode;
    onToggle: (mode: WriteMode) => void;
}

function ScreenHeader({ isSaving, onCopy, onSave }: HeaderProps) {
    const tintColor = useThemeColor({}, 'tint');
    const iconColor = useThemeColor({}, 'icon');
    const router = useRouter();

    return (
        <View style={styles.header}>
            <Pressable onPress={() => router.back()}>
                <ThemedText style={[styles.headerBtn, { color: iconColor }]}>Back</ThemedText>
            </Pressable>
            <View style={styles.headerActions}>
                <Pressable onPress={onCopy}>
                    <ThemedText style={[styles.headerBtn, { color: tintColor }]}>Copy</ThemedText>
                </Pressable>
                <Pressable onPress={onSave} disabled={isSaving}>
                    <ThemedText style={[styles.headerBtn, { color: tintColor }]}>
                        {isSaving ? 'Saving…' : 'Save'}
                    </ThemedText>
                </Pressable>
            </View>
        </View>
    );
}

function ModeToggle({ mode, onToggle }: ModeToggleProps) {
    const tintColor = useThemeColor({}, 'tint');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');

    return (
        <View style={[styles.modeToggle, { backgroundColor: cardColor, borderColor }]}>
            <Pressable
                onPress={() => onToggle('latin')}
                style={[styles.modeBtn, mode === 'latin' && { backgroundColor: tintColor }]}
            >
                <ThemedText style={[styles.modeBtnText, mode === 'latin' && { color: cardColor }]}>
                    Latin
                </ThemedText>
            </Pressable>
            <Pressable
                onPress={() => onToggle('cyrillic')}
                style={[styles.modeBtn, mode === 'cyrillic' && { backgroundColor: tintColor }]}
            >
                <ThemedText style={[styles.modeBtnText, mode === 'cyrillic' && { color: cardColor }]}>
                    Latin → Cyrillic
                </ThemedText>
            </Pressable>
        </View>
    );
}

function useWriteEssay() {
    const setEssayTitle = useWriteEssayStore((s) => s.setEssayTitle);
    const setEssayContent = useWriteEssayStore((s) => s.setEssayContent);
    const saveOrCreateDraft = useWriteEssayStore((s) => s.saveOrCreateDraft);
    const router = useRouter();
    const [title, setTitle] = useState(() => useWriteEssayStore.getState().essayTitle);
    const [content, setContent] = useState(() => useWriteEssayStore.getState().essayContent);
    const [lastChar, setLastChar] = useState('');
    const [mode, setMode] = useState<WriteMode>('latin');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setEssayTitle(title);
            setEssayContent(content);
        }, AUTOSAVE_INTERVAL);
        return () => clearInterval(interval);
    }, [title, content, setEssayTitle, setEssayContent]);

    const handleContentChange = useCallback((newText: string) => {
        if (mode !== 'cyrillic' || newText.length <= content.length || !newText.startsWith(content)) {
            setContent(newText);
            setLastChar(newText.length > 0 ? newText[newText.length - 1] : '');
            return;
        }
        let curr = content;
        let last = lastChar ? lastChar : " ";
        for (const char of newText.slice(content.length)) {
            const { change, newValue } = latinToCyrillic(last, char);
            curr = change ? curr.slice(0, -1) + newValue : curr + newValue;
            if (newValue !== '') last = newValue;
        }
        setContent(curr);
        setLastChar(last);
    }, [mode, content, lastChar]);

    const handleSave = useCallback(async () => {
        setIsSaving(true);
        setEssayTitle(title);
        setEssayContent(content);
        try { await saveOrCreateDraft(); router.back(); }
        finally { setIsSaving(false); }
    }, [title, content, setEssayTitle, setEssayContent, saveOrCreateDraft, router]);

    const handleCopy = useCallback(async () => {
        await Clipboard.setStringAsync(content);
    }, [content]);

    return { content, handleContentChange, handleCopy, handleSave, isSaving, mode, setMode, setTitle, title };
}

export default function WriteEssayScreen() {
    const { content, handleContentChange, handleCopy, handleSave, isSaving, mode, setMode, setTitle, title } = useWriteEssay();

    return (
        <ThemedScroll>
            <ScreenHeader
                isSaving={isSaving}
                onCopy={() => void handleCopy()}
                onSave={() => void handleSave()}
            />
            <ThemedInput
                onChangeText={setTitle}
                placeholder="Title"
                value={title}
            />
            <ModeToggle mode={mode} onToggle={setMode} />
            <ThemedInput
                autoCapitalize="none"
                autoCorrect={false}
                height={CONTENT_INPUT_HEIGHT}
                onChangeText={handleContentChange}
                placeholder="Start writing..."
                spellCheck={false}
                value={content}
            />
        </ThemedScroll>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 16,
    },
    headerBtn: {
        fontSize: 15,
        fontWeight: '600',
    },
    modeBtn: {
        borderRadius: 8,
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 7,
    },
    modeBtnText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    modeToggle: {
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 4,
        padding: 3,
    },
});
