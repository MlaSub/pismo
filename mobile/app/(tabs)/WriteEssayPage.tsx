import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import WriteEssayDraftCard from '@/components/essay/WriteEssayDraftCard';
import ThemedScreen from '@/components/themed-screen';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useWriteEssayStore } from '@/store/writeEssay';
import type { WriteEssayDraftResponse } from '@/utils/writeEssayCall';

const NEW_DRAFT_BUTTON_LABEL = '+ New Draft';

export default function WriteEssayPage() {
    const drafts = useWriteEssayStore((state) => state.drafts);
    const fetchDrafts = useWriteEssayStore((state) => state.fetchDrafts);
    const cleanEssayData = useWriteEssayStore((state) => state.cleanEssayData);
    const setEssayTitle = useWriteEssayStore((state) => state.setEssayTitle);
    const setEssayContent = useWriteEssayStore((state) => state.setEssayContent);
    const tintColor = useThemeColor({}, 'tint');
    const cardColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        void fetchDrafts();
    }, [fetchDrafts]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchDrafts();
        setRefreshing(false);
    }, [fetchDrafts]);

    const onNewDraft = useCallback(() => {
        cleanEssayData();
        router.push('/(noneMainScreens)/WriteEssayScreen');
    }, [cleanEssayData, router]);

    const onDraftPress = useCallback((draft: WriteEssayDraftResponse) => {
        setEssayTitle(draft.title ?? '');
        setEssayContent(draft.content ?? '');
        useWriteEssayStore.setState({ savedDraftId: draft.id });
        router.push('/(noneMainScreens)/WriteEssayScreen');
    }, [setEssayTitle, setEssayContent, router]);

    return (
        <ThemedScreen>
            <FlatList
                data={drafts}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <WriteEssayDraftCard draft={item} onPress={() => onDraftPress(item)} />
                )}
                ListHeaderComponent={
                    <>
                        <ThemedText type="title">My Drafts</ThemedText>
                        <Pressable
                            onPress={onNewDraft}
                            style={[
                                styles.newButton,
                                { backgroundColor: cardColor, borderColor },
                            ]}
                        >
                            <ThemedText style={[styles.newButtonText, { color: tintColor }]}>
                                {NEW_DRAFT_BUTTON_LABEL}
                            </ThemedText>
                        </Pressable>
                    </>
                }
                ListEmptyComponent={
                    <ThemedText style={styles.empty}>No drafts yet. Start writing!</ThemedText>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => void onRefresh()}
                        tintColor={tintColor}
                    />
                }
            />
        </ThemedScreen>
    );
}

const styles = StyleSheet.create({
    empty: {
        marginTop: 16,
    },
    newButton: {
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        marginVertical: 12,
        padding: 14,
    },
    newButtonText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
