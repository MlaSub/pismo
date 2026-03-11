import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import ThemedScreen from '@/components/themed-screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserDataStore } from '@/store/userData';
import { clearAllStores } from '@/utils/clearStores';


const COPY_FEEDBACK_MS = 1000;

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { uuid, username } = useUserDataStore();
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (uuid) {
            await Clipboard.setStringAsync(uuid);
            setCopied(true);
            setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        }
    };

    const handleLogout = () => {
        void clearAllStores();
    };

    const onPressCopy = () => void handleCopy();
    const onPressLogout = () => void handleLogout();

    return (
        <ThemedScreen>
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
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
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
