import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

import { useEssayDataStore } from '@/store/essayData';
import { useUserDataStore } from '@/store/userData';

export function useNotificationHandler() {
    const lastNotificationResponse = Notifications.useLastNotificationResponse();
    const handledRef = useRef<string | null>(null);
    const router = useRouter();
    const uuid = useUserDataStore((state) => state.uuid);
    const fetchEssayDetail = useEssayDataStore((state) => state.fetchEssayDetail);

    useEffect(() => {
        if (!lastNotificationResponse || !uuid) return;

        const notificationId = lastNotificationResponse.notification.request.identifier;
        if (handledRef.current === notificationId) return;

        const essayId = lastNotificationResponse.notification.request.content.data.essay_id;
        if (typeof essayId !== 'number') return;

        handledRef.current = notificationId;

        void (async () => {
            try {
                const success = await fetchEssayDetail(essayId);
                if (success) {
                    router.push('/(noneMainScreens)/EssayOverview');
                }
            } catch (error: unknown) {
                console.error('Failed to fetch essay detail from notification:', error);
            }
        })();
    }, [lastNotificationResponse, uuid, fetchEssayDetail, router]);
}
