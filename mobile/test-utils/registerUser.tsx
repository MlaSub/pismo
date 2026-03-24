import { fireEvent, render, waitFor } from '@testing-library/react-native';

import LoginScreen from '@/app/(unAuthStack)/login';

export async function registerUser(mockReplace: jest.Mock): Promise<string> {
    const username = `TestUser-${Date.now()}`;
    const loginScreen = render(<LoginScreen />);

    fireEvent.changeText(loginScreen.getByPlaceholderText('Enter your name'), username);
    fireEvent.press(loginScreen.getByText('Continue'));

    await waitFor(
        () => expect(mockReplace).toHaveBeenCalledWith('/(tabs)/AssignmentsList'),
        { timeout: 10_000 },
    );

    loginScreen.unmount();
    return username;
}
