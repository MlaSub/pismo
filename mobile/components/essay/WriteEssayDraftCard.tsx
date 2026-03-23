import { Pressable, StyleSheet } from 'react-native';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { WriteEssayDraftResponse } from '@/utils/writeEssayCall';

interface Props {
    draft: WriteEssayDraftResponse;
    onDelete: () => void;
    onPress: () => void;
}

export default function WriteEssayDraftCard({ draft, onDelete, onPress }: Props) {
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const iconColor = useThemeColor({}, 'icon');
    const errorColor = useThemeColor({}, 'error');
    const onErrorColor = useThemeColor({}, 'onError');

    const date = new Date(draft.updated_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <ReanimatedSwipeable
            renderRightActions={() => (
                <Pressable onPress={onDelete} style={[styles.deleteAction, { backgroundColor: errorColor }]}>
                    <ThemedText style={[styles.deleteText, { color: onErrorColor }]}>Delete</ThemedText>
                </Pressable>
            )}
        >
            <Pressable onPress={onPress} style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
                <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {draft.title ?? 'Untitled'}
                </ThemedText>
                <ThemedText style={[styles.preview, { color: iconColor }]} numberOfLines={2}>
                    {draft.content ?? 'No content yet.'}
                </ThemedText>
                <ThemedText style={[styles.date, { color: iconColor }]}>{date}</ThemedText>
            </Pressable>
        </ReanimatedSwipeable>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
        marginVertical: 6,
        padding: 16,
    },
    date: {
        fontSize: 12,
        marginTop: 4,
    },
    deleteAction: {
        alignItems: 'center',
        borderRadius: 12,
        justifyContent: 'center',
        marginVertical: 6,
        paddingHorizontal: 20,
    },
    deleteText: {
        fontWeight: '600',
    },
    preview: {
        fontSize: 13,
    },
});
