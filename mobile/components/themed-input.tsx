import { useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

const BORDER_RADIUS = 8;
const BORDER_WIDTH = 1;
const FONT_SIZE = 16;
const PADDING_HORIZONTAL = 12;
const PADDING_VERTICAL = 12;

export interface ThemedInputProps extends TextInputProps {
    lightColor?: string;
    darkColor?: string;
    hasError?: boolean;
    height?: number;
}

export function ThemedInput({
    style,
    lightColor,
    darkColor,
    hasError = false,
    height,
    onFocus,
    onBlur,
    ...rest
}: ThemedInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const backgroundColor = useThemeColor({}, 'card');
    const borderColor = useThemeColor({}, 'border');
    const focusedBorderColor = useThemeColor({}, 'tint');
    const errorBorderColor = useThemeColor({}, 'error');
    const placeholderColor = useThemeColor({}, 'icon');

    const getBorderColor = () => {
        if (hasError) {
            return errorBorderColor;
        }
        if (isFocused) {
            return focusedBorderColor;
        }
        return borderColor;
    };

    const handleFocus: TextInputProps['onFocus'] = (e) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur: TextInputProps['onBlur'] = (e) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    return (
        <TextInput
            style={[
                styles.input,
                {
                    color: textColor,
                    backgroundColor,
                    borderColor: getBorderColor(),
                },
                height !== undefined && { height, textAlignVertical: 'top' },
                style,
            ]}
            multiline={height !== undefined}
            placeholderTextColor={placeholderColor}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: BORDER_RADIUS,
        borderWidth: BORDER_WIDTH,
        fontSize: FONT_SIZE,
        paddingHorizontal: PADDING_HORIZONTAL,
        paddingVertical: PADDING_VERTICAL,
    },
});
