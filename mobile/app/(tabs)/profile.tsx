import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ThemedDropdown } from '@/components/themed-dropdown';
import { ThemedInput } from '@/components/themed-input';
import ThemedScreen from '@/components/themed-screen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserDataStore } from '@/store/userData';
import { clearAllStores } from '@/utils/clearStores';
import type { CefrLevel } from '@/utils/createUser';


const COPY_FEEDBACK_MS = 1000;
const SAVE_FEEDBACK_MS = 1000;
const CEFR_ITEMS = (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CefrLevel[]).map((level) => ({
    label: level,
    value: level,
}));

// eslint-disable-next-line max-lines-per-function
export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const { uuid, username, targetCefrLevel, updateUserData } = useUserDataStore();
    const [copied, setCopied] = useState(false);
    const [saved, setSaved] = useState(false);
    const [usernameInput, setUsernameInput] = useState(username ?? '');
    const [cefrLevel, setCefrLevel] = useState<CefrLevel>(targetCefrLevel ?? 'B2');

    const onPressCopy = () => void (async () => {
        if (uuid) {
            await Clipboard.setStringAsync(uuid);
            setCopied(true);
            setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        }
    })();

    const onPressSave = () => void (async () => {
        await updateUserData(usernameInput.trim() || undefined, cefrLevel);
        setSaved(true);
        setTimeout(() => setSaved(false), SAVE_FEEDBACK_MS);
    })();

    const onPressLogout = () => clearAllStores();

    return (
        <ThemedScreen>
            <ThemedText type="title">Profile</ThemedText>

            <View style={styles.field}>
                <ThemedText type="defaultSemiBold">Username</ThemedText>
                <ThemedInput
                    value={usernameInput}
                    onChangeText={setUsernameInput}
                    placeholder="Enter username"
                />
            </View>

            <View style={styles.field}>
                <ThemedText type="defaultSemiBold">CEFR Level</ThemedText>
                <ThemedDropdown
                    items={CEFR_ITEMS}
                    selectedValue={cefrLevel}
                    onValueChange={setCefrLevel}
                />
            </View>

            <Pressable
                style={[styles.saveBtn, { backgroundColor: saved ? colors.success : colors.tint }]}
                onPress={onPressSave}
            >
                <ThemedText style={{ color: colors.background }}>
                    {saved ? 'Saved!' : 'Save changes'}
                </ThemedText>
            </Pressable>

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
    field: {
        gap: 6,
    },
    logoutBtn: {
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 16,
        paddingVertical: 8,
    },
    saveBtn: {
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 8,
        paddingVertical: 8,
    },
});
