import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useNotificationHandler } from '@/hooks/use-notification-handler';
import { useUserDataStore } from '@/store/userData';

Notifications.setNotificationHandler({
    handleNotification: () => Promise.resolve({
        shouldShowAlert: true,
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const uuid = useUserDataStore((state) => state.uuid);
    const hydrated = useUserDataStore((state) => state.hydrated);
    const syncPushToken = useUserDataStore((state) => state.syncPushToken);
    const router = useRouter();
    const segments = useSegments();

    const [isMounted, setIsMounted] = useState(false);

    useNotificationHandler();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!hydrated || !isMounted) return;
        if (uuid === null && segments[0] !== '(unAuthStack)') {
            router.replace('/(unAuthStack)/login');
        } else if (uuid !== null && segments[0] === '(unAuthStack)') {
            router.replace('/(tabs)/AssignmentsList');
        }
    }, [uuid, hydrated, isMounted, segments, router]);

    useEffect(() => {
        if (!uuid || !hydrated) return;
        void (async () => {
            try {
                await syncPushToken();
            } catch (error: unknown) {
                console.error('Failed to sync push token:', error);
            }
        })();
    }, [uuid, hydrated, syncPushToken]);

    return (
        <GestureHandlerRootView style={styles.root}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(noneMainScreens)" options={{ headerShown: false }} />
                    <Stack.Screen name="(unAuthStack)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
