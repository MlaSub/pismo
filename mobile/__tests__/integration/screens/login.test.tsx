// Requires the backend to be running: docker compose up
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import LoginScreen from '@/app/(unAuthStack)/login';
import { useUserDataStore } from '@/store/userData';
import { registerUser } from '@/test-utils/registerUser';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: () => ({ replace: mockReplace, push: jest.fn(), back: jest.fn() }),
    useSegments: jest.fn(() => []),
}));

describe('LoginScreen - Registration (Integration)', () => {
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

    it('registers a new user and navigates to the main screen', async () => {
        const username = await registerUser(mockReplace);

        const { uuid, username: storedUsername, targetCefrLevel } = useUserDataStore.getState();
        expect(storedUsername).toBe(username);
        expect(uuid).toBeTruthy();
        expect(targetCefrLevel).toBe('B2');
    });

    it('does not navigate when name is empty', async () => {
        const { getByText } = render(<LoginScreen />);

        fireEvent.press(getByText('Continue'));

        await waitFor(() => {
            expect(mockReplace).not.toHaveBeenCalled();
        });
    });
});
