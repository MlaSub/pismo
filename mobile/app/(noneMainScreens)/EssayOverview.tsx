import { useCallback, useState } from 'react'; // useState used by ContentSection
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import ThemedScroll from '@/components/themed-scroll';
import { ThemedText } from '@/components/themed-text';
import type { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { EssayDetailResponse, FeedbackItem } from '@/store/essayData';
import { useEssayDataStore } from '@/store/essayData';

const CONTENT_LINE_LIMIT = 4;

const STATUS_COLORS: Record<string, keyof typeof Colors.light> = {
    new: 'icon',
    processing: 'warning',
    complete: 'success',
    error: 'error',
};

function FeedbackCard({ item }: { item: FeedbackItem }) {
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const iconColor = useThemeColor({}, 'icon');

    return (
        <View style={[styles.feedbackCard, { backgroundColor: cardColor, borderColor }]}>
            <View style={styles.feedbackRow}>
                <ThemedText style={styles.category}>{item.category}</ThemedText>
                <ThemedText style={[styles.origin, { color: iconColor }]}>
                    {item.feedback_origin}
                </ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={styles.summary}>
                {item.short_mistake_summary}
            </ThemedText>
            {item.comments !== null && (
                <ThemedText style={[styles.comment, { color: iconColor }]}>
                    {item.comments}
                </ThemedText>
            )}
        </View>
    );
}

function ContentSection({ content }: { content: string }) {
    const [expanded, setExpanded] = useState(false);
    const tintColor = useThemeColor({}, 'tint');
    const toggle = useCallback(() => setExpanded((prev) => !prev), []);

    return (
        <View style={styles.contentSection}>
            <ThemedText numberOfLines={expanded ? undefined : CONTENT_LINE_LIMIT} style={styles.contentText}>
                {content}
            </ThemedText>
            <TouchableOpacity onPress={toggle} style={styles.expandBtn}>
                <ThemedText style={[styles.expandLabel, { color: tintColor }]}>
                    {expanded ? 'Show less' : 'Show more'}
                </ThemedText>
            </TouchableOpacity>
        </View>
    );
}

function EssayDetailView({ detail }: { detail: EssayDetailResponse }) {
    const iconColor = useThemeColor({}, 'icon');
    const statusColorKey = STATUS_COLORS[detail.analysis_status] ?? 'icon';
    const statusColor = useThemeColor({}, statusColorKey);

    const date = new Date(detail.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <>
            <ThemedText type="title">{detail.title}</ThemedText>
            <View style={styles.metaRow}>
                {detail.cerf_level_grade !== null && (
                    <ThemedText style={[styles.cerfBadge, { color: iconColor }]}>
                        CEFR: {detail.cerf_level_grade}
                    </ThemedText>
                )}
                <ThemedText style={[styles.metaText, { color: iconColor }]}>{date}</ThemedText>
                <ThemedText style={[styles.statusText, { color: statusColor }]}>
                    {detail.analysis_status}
                </ThemedText>
            </View>
            {detail.original_content !== null && (
                <>
                    <ThemedText type="subtitle">Essay</ThemedText>
                    <ContentSection content={detail.original_content} />
                </>
            )}
            {detail.feedback_items.length > 0 && (
                <>
                    <ThemedText type="subtitle">Mistakes ({detail.feedback_items.length})</ThemedText>
                    {detail.feedback_items.map((item) => (
                        <FeedbackCard key={item.id} item={item} />
                    ))}
                </>
            )}
        </>
    );
}

export default function EssayOverview() {
    const detail = useEssayDataStore((state) => state.selectedEssay);
    const iconColor = useThemeColor({}, 'icon');

    return (
        <ThemedScroll>
            {detail === null ? (
                <ThemedText style={[styles.centeredText, { color: iconColor }]}>
                    Essay is still processing.
                </ThemedText>
            ) : (
                <EssayDetailView detail={detail} />
            )}
        </ThemedScroll>
    );
}

const styles = StyleSheet.create({
    metaRow: {
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    cerfBadge: {
        fontSize: 13,
        fontWeight: '600',
    },
    metaText: {
        fontSize: 13,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 'auto',
        textTransform: 'capitalize',
    },
    contentSection: {
        gap: 8,
    },
    contentText: {
        lineHeight: 22,
    },
    expandBtn: {
        alignSelf: 'flex-start',
    },
    expandLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    feedbackCard: {
        borderRadius: 12,
        borderWidth: 1,
        gap: 6,
        padding: 14,
    },
    feedbackRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    category: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    origin: {
        fontSize: 12,
    },
    summary: {
        fontSize: 15,
    },
    comment: {
        fontSize: 14,
        lineHeight: 20,
    },
    centeredText: {
        marginTop: 40,
        textAlign: 'center',
    },
});
