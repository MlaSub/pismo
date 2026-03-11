import { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import Essay from '@/components/essay/Essay';
import ThemedScreen from '@/components/themed-screen';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEssayDataStore } from '@/store/essayData';

export default function EssaysScreen() {
    const essays = useEssayDataStore((state) => state.essays);
    const fetchEssays = useEssayDataStore((state) => state.fetchEssays);
    const tintColor = useThemeColor({}, 'tint');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        void fetchEssays();
    }, [fetchEssays]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchEssays();
        setRefreshing(false);
    }, [fetchEssays]);

    return (
        <ThemedScreen>
            <FlatList
                data={essays}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => <Essay essay={item} />}
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
