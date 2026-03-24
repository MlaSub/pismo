// LATIN_CONTENT_INPUT exercises every entry in SINGLE_CHAR_MAP and MULTI_CHAR_MAP_NEW:
//
// Single-char mappings (typed standalone, not followed by a multi-char trigger):
//   a→а  b→б  v→в  g→г  d→д  e→е  i→и  j→й  k→к  l→л  m→м  n→н
//   o→о  p→п  r→р  u→у  f→ф  x→х  w→щ
//   z→з  (zb: b prevents зh trigger)
//   s→с  (sb: b prevents сh trigger)
//   t→т  (tb: b prevents тs trigger)
//   c→ц  (cb: b prevents цh trigger)
//   y→ы  (yb: b prevents ыo/ыu/ыa triggers)
//   q→ь  (qb: b prevents ьq trigger)
//   h→х  (typed after space, not after з/с/ц)
//
// Multi-char sequences (lastCyrillic + newLatin → replacement):
//   yo → ё   (ы+o)
//   zh → ж   (з+h)
//   ts → ц   (т+s)
//   ch → ч   (ц+h)
//   sh → ш   (с+h)
//   yu → ю   (ы+u)
//   ya → я   (ы+a)
//   qq → ъ   (ь+q)

import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import WriteEssayPage from '@/app/(tabs)/WriteEssayPage';
import WriteEssayScreen from '@/app/(noneMainScreens)/WriteEssayScreen';
import { useUserDataStore } from '@/store/userData';
import { useWriteEssayStore } from '@/store/writeEssay';
import { openNewEssay } from '@/test-utils/openNewEssay';
import { registerUser } from '@/test-utils/registerUser';

const LATIN_CONTENT_INPUT =
    'abvgde ijklmno pruf x w zb sb tb cb yb qb h yo zh ts ch sh yu ya qq';

const EXPECTED_CYRILLIC_CONTENT =
    'абвгде ийклмно пруф х щ зб сб тб цб ыб ьб х ё ж ц ч ш ю я ъ';

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

describe('WriteEssay Cyrillic flow (Integration)', () => {
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

    it('creates a cyrillic essay covering all mapped characters, verifies it after refresh, reads it back, then deletes it', async () => {
        const essayTitle = `Cyrillic Test ${Date.now()}`;

        // Step 1: Register a user
        await registerUser(mockReplace);

        // Step 2: Open WriteEssayPage, press "+ New Essay"
        await openNewEssay(mockPush);

        // Step 3: Write the essay — title in Latin mode, content in Cyrillic mode
        const writeEssayScreen = render(<WriteEssayScreen />);

        // Type title first (Latin mode, default)
        fireEvent.changeText(writeEssayScreen.getByPlaceholderText('Title'), essayTitle);

        // Switch to Cyrillic mode
        fireEvent.press(writeEssayScreen.getByText('Latin → Cyrillic'));

        // Feed the full Latin input in one shot — the component processes each character
        // through latinToCyrillic() and produces the Cyrillic output
        fireEvent.changeText(
            writeEssayScreen.getByPlaceholderText('Start writing...'),
            LATIN_CONTENT_INPUT,
        );

        // Verify the conversion before saving
        expect(
            writeEssayScreen.getByPlaceholderText('Start writing...').props.value,
        ).toBe(EXPECTED_CYRILLIC_CONTENT);

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

        // Step 6: Verify the title and Cyrillic content match what was saved
        const writeEssayScreen2 = render(<WriteEssayScreen />);
        expect(writeEssayScreen2.getByPlaceholderText('Title').props.value).toBe(essayTitle);
        expect(
            writeEssayScreen2.getByPlaceholderText('Start writing...').props.value,
        ).toBe(EXPECTED_CYRILLIC_CONTENT);
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
