import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUserDataStore } from '@/store/userData';

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const uuid = useUserDataStore((state) => state.uuid);
    const hydrated = useUserDataStore((state) => state.hydrated);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (!hydrated) return;
        if (uuid === null && segments[0] !== '(unAuthStack)') {
            router.replace('/(unAuthStack)/login');
        } else if (uuid !== null && segments[0] === '(unAuthStack)') {
            router.replace('/(tabs)/AssignmentsList');
        }
    }, [uuid, hydrated, segments, router]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(noneMainScreens)" options={{ headerShown: false }} />
                <Stack.Screen name="(unAuthStack)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
