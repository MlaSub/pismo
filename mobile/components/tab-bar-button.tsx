import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const SCALE_PRESSED = 0.95;

const SPRING_CONFIG = {
    damping: 15,
    stiffness: 400,
};

export function TabBarButton(props: BottomTabBarButtonProps) {
    const { children, style, onPress, accessibilityState, testID } = props;
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = useCallback(() => {
        scale.value = withSpring(SCALE_PRESSED, SPRING_CONFIG);
    }, [scale]);

    const handlePressOut = useCallback(() => {
        scale.value = withSpring(1, SPRING_CONFIG);
    }, [scale]);

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            testID={testID}
            style={[styles.button, style]}
        >
            <Animated.View style={[styles.content, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
    },
});
