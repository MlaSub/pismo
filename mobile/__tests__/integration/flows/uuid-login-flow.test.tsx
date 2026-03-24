// Requires the backend to be running: docker compose up
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as Clipboard from 'expo-clipboard';

import LoginScreen from '@/app/(unAuthStack)/login';
import ProfileScreen from '@/app/(tabs)/profile';
import { useUserDataStore } from '@/store/userData';
import { registerUser } from '@/test-utils/registerUser';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
    useSegments: jest.fn(() => []),
}));

describe('UUID login flow (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useUserDataStore.setState({
            uuid: null,
            username: null,
            targetCefrLevel: null,
            pushToken: null,
            hydrated: true,
        });
    });

    it('registers, copies UUID from profile, logs out, then logs back in with UUID', async () => {
        // Step 1: Register a new user
        const username = await registerUser(mockReplace);

        // Capture the UUID from the store before logout
        const { uuid } = useUserDataStore.getState();
        expect(uuid).toBeTruthy();

        // Step 2: Render ProfileScreen, copy UUID, then log out
        const profileScreen = render(<ProfileScreen />);
        fireEvent.press(profileScreen.getByText('Copy UUID'));
        expect(Clipboard.setStringAsync).toHaveBeenCalledWith(uuid);

        fireEvent.press(profileScreen.getByText('Log out'));
        profileScreen.unmount();

        await waitFor(() => {
            expect(useUserDataStore.getState().uuid).toBeNull();
        });

        // Step 3: Log back in with UUID via LoginScreen
        mockReplace.mockClear();
        const loginScreenUuid = render(<LoginScreen />);
        fireEvent.press(loginScreenUuid.getByText('Have a UUID'));
        fireEvent.changeText(loginScreenUuid.getByPlaceholderText('Enter your name'), username);
        fireEvent.changeText(loginScreenUuid.getByPlaceholderText('Paste your UUID'), uuid as string);
        fireEvent.press(loginScreenUuid.getByText('Continue'));

        await waitFor(
            () => expect(mockReplace).toHaveBeenCalledWith('/(tabs)/AssignmentsList'),
            { timeout: 10_000 },
        );

        const finalState = useUserDataStore.getState();
        expect(finalState.uuid).toBe(uuid);
        expect(finalState.username).toBe(username);
        expect(finalState.targetCefrLevel).toBe('B2');
    });
});
