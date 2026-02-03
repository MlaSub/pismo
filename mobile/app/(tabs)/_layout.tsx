import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { TabBarButton } from '@/components/tab-bar-button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface TabIconProps {
    color: string;
    size: number;
}

function HomeIcon({ color, size }: TabIconProps) {
    return <Ionicons name="home" size={size} color={color} />;
}

function ExploreIcon({ color, size }: TabIconProps) {
    return <Ionicons name="compass" size={size} color={color} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.tint,
                tabBarInactiveTintColor: colors.tabIconDefault,
                tabBarButton: TabBarButton,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="AssignmentsList"
                options={{
                    title: 'Home',
                    tabBarIcon: HomeIcon,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ExploreIcon,
                }}
            />
        </Tabs>
    );
}
