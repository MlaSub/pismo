import { Stack } from 'expo-router';
import 'react-native-reanimated';


export default function unAuthStack() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
}