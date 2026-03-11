import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { EssayResponse } from '@/store/essayData';

interface Props {
    essay: EssayResponse;
}

const STATUS_LABEL: Record<EssayResponse['analysis_status'], string> = {
    new: 'New',
    processing: 'Processing',
    complete: 'Complete',
    error: 'Error',
};

export default function Essay({ essay }: Props) {
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const iconColor = useThemeColor({}, 'icon');
    const theme = cardColor === Colors.light.card ? 'light' : 'dark';

    const statusColor: Record<EssayResponse['analysis_status'], string> = {
        new: Colors[theme].icon,
        processing: Colors[theme].warning,
        complete: Colors[theme].success,
        error: Colors[theme].error,
    };

    const date = new Date(essay.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <View style={[styles.card, { backgroundColor: cardColor, borderColor }]}>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>
                {essay.title}
            </ThemedText>
            <View style={styles.meta}>
                {essay.cerf_level_grade !== null && (
                    <ThemedText style={[styles.badge, { color: iconColor }]}>
                        cerf score: {essay.cerf_level_grade}
                    </ThemedText>
                )}
                <ThemedText style={[styles.date, { color: iconColor }]}>{date}</ThemedText>
                <ThemedText
                    style={[styles.status, { color: statusColor[essay.analysis_status] }]}
                >
                    {STATUS_LABEL[essay.analysis_status]}
                </ThemedText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 6,
        padding: 16,
    },
    badge: {
        fontSize: 13,
        fontWeight: '600',
    },
    date: {
        fontSize: 13,
    },
    meta: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 6,
    },
    status: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 'auto',
    },
});
