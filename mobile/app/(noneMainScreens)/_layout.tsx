import { Stack } from 'expo-router';


export const unstable_settings = {
    initialRouteName: 'EssayOverview',
};

export default function AuthenticatedLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="EssayOverview" />
            <Stack.Screen name="WriteEssayScreen" />
        </Stack>
    );
}