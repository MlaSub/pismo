import type { PropsWithChildren } from 'react';
import { Keyboard, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = PropsWithChildren

export default function ThemedScroll({ children }: Props) {
    const backgroundColor = useThemeColor({}, 'background');
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor, paddingTop: insets.top }]}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
        >
            <Pressable onPress={Keyboard.dismiss} style={styles.pressable}>
                <ThemedView style={styles.content}>{children}</ThemedView>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
    },
    pressable: {
        flex: 1,
    },
});