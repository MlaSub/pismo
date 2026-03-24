import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import WriteEssayPage from '@/app/(tabs)/WriteEssayPage';
import WriteEssayScreen from '@/app/(noneMainScreens)/WriteEssayScreen';
import { useUserDataStore } from '@/store/userData';
import { useWriteEssayStore } from '@/store/writeEssay';
import { openNewEssay } from '@/test-utils/openNewEssay';
import { registerUser } from '@/test-utils/registerUser';

const mockPush = jest.fn();
const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: () => ({ push: mockPush, back: mockBack, replace: mockReplace }),
    useSegments: jest.fn(() => []),
}));

jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        default: ({ children, renderRightActions }: any) =>
            React.createElement(View, null, children, renderRightActions?.()),
    };
});

describe('WriteEssay flow (Integration)', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useUserDataStore.setState({
            uuid: null,
            username: null,
            targetCefrLevel: null,
            pushToken: null,
            hydrated: true,
        });
        useWriteEssayStore.setState({
            essayTitle: '',
            essayContent: '',
            savedDraftId: null,
            drafts: [],
        });
    });

    it('creates a latin essay, verifies it after refresh, reads it back, then deletes it', async () => {
        const essayTitle = `Latin Essay ${Date.now()}`;
        const essayContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

        // Step 1: Register a user
        await registerUser(mockReplace);

        // Step 2: Open WriteEssayPage, press "+ New Essay"
        await openNewEssay(mockPush);

        // Step 3: Write a latin essay and save it
        const writeEssayScreen = render(<WriteEssayScreen />);
        fireEvent.changeText(writeEssayScreen.getByPlaceholderText('Title'), essayTitle);
        fireEvent.changeText(writeEssayScreen.getByPlaceholderText('Start writing...'), essayContent);
        fireEvent.press(writeEssayScreen.getByText('Save'));
        await waitFor(
            () => expect(mockBack).toHaveBeenCalled(),
            { timeout: 10_000 },
        );
        writeEssayScreen.unmount();

        // Step 4: Go back to WriteEssayPage, refresh, verify draft appears
        const writeEssayPage2 = render(<WriteEssayPage />);
        await act(async () => {
            await useWriteEssayStore.getState().fetchDrafts();
        });
        await waitFor(
            () => expect(writeEssayPage2.getByText(essayTitle)).toBeTruthy(),
            { timeout: 10_000 },
        );

        // Step 5: Press the draft card to open it
        mockPush.mockClear();
        fireEvent.press(writeEssayPage2.getByText(essayTitle));
        expect(mockPush).toHaveBeenCalledWith('/(noneMainScreens)/WriteEssayScreen');
        writeEssayPage2.unmount();

        // Step 6: Verify the title and content match what was written
        const writeEssayScreen2 = render(<WriteEssayScreen />);
        const titleInput = writeEssayScreen2.getByPlaceholderText('Title');
        const contentInput = writeEssayScreen2.getByPlaceholderText('Start writing...');
        expect(titleInput.props.value).toBe(essayTitle);
        expect(contentInput.props.value).toBe(essayContent);
        writeEssayScreen2.unmount();

        // Step 7: Go back to WriteEssayPage, swipe-delete the draft
        const writeEssayPage3 = render(<WriteEssayPage />);
        await waitFor(
            () => expect(writeEssayPage3.getByText(essayTitle)).toBeTruthy(),
            { timeout: 10_000 },
        );
        fireEvent.press(writeEssayPage3.getByText('Delete'));
        await waitFor(
            () => expect(writeEssayPage3.queryByText(essayTitle)).toBeNull(),
            { timeout: 10_000 },
        );
    // eslint-disable-next-line no-magic-numbers
    }, 30_000);
});
