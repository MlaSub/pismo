import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';

import Essay from '@/components/essay/Essay';
import ThemedScreen from '@/components/themed-screen';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { EssayResponse } from '@/store/essayData';
import { useEssayDataStore } from '@/store/essayData';

export default function EssaysScreen() {
    const essays = useEssayDataStore((state) => state.essays);
    const fetchEssays = useEssayDataStore((state) => state.fetchEssays);
    const fetchEssayDetail = useEssayDataStore((state) => state.fetchEssayDetail);
    const tintColor = useThemeColor({}, 'tint');
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        void fetchEssays();
    }, [fetchEssays]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEssays();
        setRefreshing(false);
    }, [fetchEssays]);

    const onEssayPress = useCallback(async (essay: EssayResponse) => {
        const success = await fetchEssayDetail(essay.id);
        if (success) {
            router.push('/(noneMainScreens)/EssayOverview');
        }
    }, [fetchEssayDetail, router]);

    return (
        <ThemedScreen>
            <FlatList
                data={essays}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Essay essay={item} onPress={() => void onEssayPress(item)} />
                )}
                ListHeaderComponent={<ThemedText type="title">Essays</ThemedText>}
                ListEmptyComponent={<ThemedText>No essays yet.</ThemedText>}
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
