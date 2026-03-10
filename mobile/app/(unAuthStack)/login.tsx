import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserDataStore } from '@/store/userData';


type Mode = 'name' | 'uuid';

interface ToggleButtonProps {
    label: string;
    active: boolean;
    onPress: () => void;
    activeBackground: string;
    activeText: string;
}

function ToggleButton({ label, active, onPress, activeBackground, activeText }: ToggleButtonProps) {
    return (
        <Pressable
            style={[styles.toggleBtn, active && { backgroundColor: activeBackground }]}
            onPress={onPress}
        >
            <ThemedText style={active ? { color: activeText } : undefined}>{label}</ThemedText>
        </Pressable>
    );
}

// eslint-disable-next-line max-lines-per-function
export default function LoginScreen() {
    const [mode, setMode] = useState<Mode>('name');
    const [nameInput, setNameInput] = useState('');
    const [uuidInput, setUuidInput] = useState('');
    const [uuidNameInput, setUuidNameInput] = useState('');
    const { setName, createUuid, setUuid } = useUserDataStore();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const handleNameSubmit = async () => {
        if (!nameInput.trim()) return;
        setName(nameInput.trim());
        await createUuid();
        router.replace('/(tabs)/AssignmentsList');
    };

    const handleUuidSubmit = () => {
        if (!uuidInput.trim() || !uuidNameInput.trim()) return;
        setName(uuidNameInput.trim());
        setUuid(uuidInput.trim());
        router.replace('/(tabs)/AssignmentsList');
    };

    const isNameMode = mode === 'name';
    const setNameMode = () => setMode('name');
    const setUuidMode = () => setMode('uuid');
    const onPressNameSubmit = () => void handleNameSubmit();

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title">Welcome to Pismo</ThemedText>
            <ThemedText type="default">Sign in to continue</ThemedText>

            <ThemedView style={styles.toggle}>
                <ToggleButton
                    label="New User"
                    active={isNameMode}
                    onPress={setNameMode}
                    activeBackground={colors.tint}
                    activeText={colors.background}
                />
                <ToggleButton
                    label="Have a UUID"
                    active={!isNameMode}
                    onPress={setUuidMode}
                    activeBackground={colors.tint}
                    activeText={colors.background}
                />
            </ThemedView>

            {isNameMode ? (
                <>
                    <ThemedInput
                        placeholder="Enter your name"
                        value={nameInput}
                        onChangeText={setNameInput}
                        autoFocus
                    />
                    <Pressable
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={onPressNameSubmit}
                    >
                        <ThemedText style={{ color: colors.background }}>Continue</ThemedText>
                    </Pressable>
                </>
            ) : (
                <>
                    <ThemedInput
                        placeholder="Enter your name"
                        value={uuidNameInput}
                        onChangeText={setUuidNameInput}
                    />
                    <ThemedInput
                        placeholder="Paste your UUID"
                        value={uuidInput}
                        onChangeText={setUuidInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Pressable
                        style={[styles.button, { backgroundColor: colors.tint }]}
                        onPress={handleUuidSubmit}
                    >
                        <ThemedText style={{ color: colors.background }}>Continue</ThemedText>
                    </Pressable>
                </>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: 8,
        paddingVertical: 14,
    },
    container: {
        flex: 1,
        gap: 16,
        padding: 24,
        paddingTop: 48,
    },
    toggle: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    toggleBtn: {
        alignItems: 'center',
        borderRadius: 8,
        flex: 1,
        paddingVertical: 7,
    },
});
