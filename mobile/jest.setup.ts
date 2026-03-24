// Integration tests require the backend to be running: docker compose up
process.env.EXPO_PUBLIC_API_URL = 'http://localhost:8000';

jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn().mockResolvedValue(null),
    setItemAsync: jest.fn().mockResolvedValue(undefined),
    deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('expo-notifications', () => ({
    getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
    getExpoPushTokenAsync: jest.fn(),
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
    addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    AndroidImportance: { MAX: 5 },
}));

jest.mock('expo-constants', () => ({
    default: {
        isDevice: false,
        expoConfig: null,
    },
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SafeAreaProvider: ({ children }: any) => children,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SafeAreaView: ({ children }: any) => children,
}));

jest.mock('expo-clipboard', () => ({
    setStringAsync: jest.fn().mockResolvedValue(undefined),
    getStringAsync: jest.fn().mockResolvedValue(''),
}));

jest.mock('react-native-dropdown-picker', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: jest.fn(() => React.createElement(View, { testID: 'cefr-dropdown' })),
    };
});
