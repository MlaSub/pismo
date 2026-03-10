import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserDataStore } from '@/store/userData';


const COPY_FEEDBACK_MS = 1000;

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { uuid, username, clearAll } = useUserDataStore();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (uuid) {
            await Clipboard.setStringAsync(uuid);
            setCopied(true);
            setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        }
    };

    const handleLogout = async () => {
        await clearAll();
    };

    const onPressCopy = () => void handleCopy();
    const onPressLogout = () => void handleLogout();

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Profile</ThemedText>

            {username ? <ThemedText type="defaultSemiBold">Hello, {username}!</ThemedText> : null}


            <Pressable
                style={[styles.copyBtn, { borderColor: copied ? colors.success : colors.tint }]}
                onPress={onPressCopy}
            >
                <ThemedText style={{ color: copied ? colors.success : colors.tint }}>
                    {copied ? 'Copied!' : 'Copy UUID'}
                </ThemedText>
            </Pressable>


            <Pressable
                style={[styles.logoutBtn, { backgroundColor: colors.error }]}
                onPress={onPressLogout}
            >
                <ThemedText style={{ color: colors.background }}>Log out</ThemedText>
            </Pressable>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        padding: 24,
        paddingTop: 48,
    },
    copyBtn: {
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        marginTop: 8,
        paddingVertical: 8,
    },
    logoutBtn: {
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 16,
        paddingVertical: 8,
    },
});
