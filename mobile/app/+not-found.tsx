import { Redirect } from 'expo-router';

import { useUserDataStore } from '@/store/userData';

export default function NotFound() {
    const uuid = useUserDataStore((state) => state.uuid);

    return uuid !== null
        ? <Redirect href="/(tabs)/AssignmentsList" />
        : <Redirect href="/(unAuthStack)/login" />;
}
