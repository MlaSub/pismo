import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { WriteEssayDraftResponse } from '@/utils/writeEssayCall';

interface Props {
    draft: WriteEssayDraftResponse;
    onPress: () => void;
}

export default function WriteEssayDraftCard({ draft, onPress }: Props) {
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const iconColor = useThemeColor({}, 'icon');

    const date = new Date(draft.updated_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Pressable onPress={onPress} style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {draft.title ?? 'Untitled'}
            </ThemedText>
            <ThemedText style={[styles.preview, { color: iconColor }]} numberOfLines={2}>
                {draft.content ?? 'No content yet.'}
            </ThemedText>
            <ThemedText style={[styles.date, { color: iconColor }]}>{date}</ThemedText>
        </Pressable>
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
    preview: {
        fontSize: 13,
    },
});
