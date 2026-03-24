import { fireEvent, render, waitFor } from '@testing-library/react-native';

import WriteEssayPage from '@/app/(tabs)/WriteEssayPage';

export async function openNewEssay(mockPush: jest.Mock): Promise<void> {
    const writeEssayPage = render(<WriteEssayPage />);

    await waitFor(() => expect(writeEssayPage.getByText('My Drafts')).toBeTruthy());
    fireEvent.press(writeEssayPage.getByText('+ New Essay'));
    expect(mockPush).toHaveBeenCalledWith('/(noneMainScreens)/WriteEssayScreen');

    writeEssayPage.unmount();
}
