import { Platform } from 'react-native';

const accentLight = '#4F46E5';
const accentDark = '#A5B4FC';

export const Colors = {
    light: {
        text: '#1F2937',
        background: '#FFFFFF',
        tint: accentLight,
        icon: '#6B7280',
        tabIconDefault: '#9CA3AF',
        tabIconSelected: accentLight,
        card: '#F9FAFB',
        border: '#E5E7EB',
        link: '#0A7EA4',
        success: '#16A34A',
        warning: '#D97706',
        error: '#DC2626',
    },
    dark: {
        text: '#F9FAFB',
        background: '#0F172A',
        tint: accentDark,
        icon: '#9CA3AF',
        tabIconDefault: '#6B7280',
        tabIconSelected: accentDark,
        card: '#020617',
        border: '#1E293B',
        link: '#5BC0EB',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
    },
};

export const Fonts = Platform.select({
    ios: {
        /** iOS `UIFontDescriptorSystemDesignDefault` */
        sans: 'system-ui',
        /** iOS `UIFontDescriptorSystemDesignSerif` */
        serif: 'ui-serif',
        /** iOS `UIFontDescriptorSystemDesignRounded` */
        rounded: 'ui-rounded',   // great for friendly language apps
        /** iOS `UIFontDescriptorSystemDesignMonospaced` */
        mono: 'ui-monospace',    // vocab, IPA, examples
    },
    default: {
        sans: 'normal',
        serif: 'serif',
        rounded: 'normal',
        mono: 'monospace',
    },
});