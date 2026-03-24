# Mobile Testing Guide

Framework: Jest + `jest-expo` preset + React Native Testing Library.

Tests are **integration tests** — they drive the UI and make real HTTP calls to the backend. Run locally only (no CI, no simulator).

## Prerequisites

```bash
docker compose up   # from repo root
```

## Running tests

```bash
# From mobile/
npm test
npm run test:coverage
```

## Key conventions

- Test files live in `mobile/__tests__/integration/` mirroring the source structure
- Global mocks are in `mobile/jest.setup.ts` (loaded via `setupFiles` in `package.json`)
- `expo-router` (`useRouter`) is mocked **per test file** — each file defines its own `mockReplace`, `mockPush`, and `mockBack` as `jest.fn()`; declare only the ones the screen under test actually uses
- No mocking of API utilities (`createUser`, `backendCall`) — real HTTP calls are made
- Use `Date.now()` in usernames/titles to avoid unique constraint conflicts across runs

## Store reset (`beforeEach`)

Do **not** call `clearAll()` — it hits SecureStore. Reset stores directly:

```ts
useUserDataStore.setState({
    uuid: null,
    username: null,
    targetCefrLevel: null,
    pushToken: null,
    hydrated: true,   // must be true or the app waits for hydration
});

// Write-essay tests only:
useWriteEssayStore.setState({
    essayTitle: '',
    essayContent: '',
    savedDraftId: null,
    drafts: [],
});
```

## Navigation targets

- Registration → `/(tabs)/AssignmentsList`; default CEFR level is `B2`
- New essay → `/(noneMainScreens)/WriteEssayScreen`

## Per-test mocks (not in jest.setup.ts)

**`react-native-gesture-handler/ReanimatedSwipeable`** — required in write-essay tests to expose swipe action buttons synchronously:

```ts
jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
    const React = require('react');
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: ({ children, renderRightActions }: any) =>
            React.createElement(View, null, children, renderRightActions?.()),
    };
});
```

## Globally mocked modules (`jest.setup.ts`)

Native modules with no JS implementation — mocked to run in Node:

| Module | Mock behaviour |
|--------|---------------|
| `expo-secure-store` | `getItemAsync` / `setItemAsync` / `deleteItemAsync` as `jest.fn()` |
| `expo-notifications` | Returns `status: 'denied'` → push token is `null` |
| `expo-constants` | `isDevice: false` |
| `react-native-dropdown-picker` | Renders a plain `View` with `testID="cefr-dropdown"` |
| `@react-native-async-storage/async-storage` | Official jest mock via `moduleNameMapper` |

## Test utilities (`mobile/test-utils/`)

### `registerUser(mockReplace)`

Renders `LoginScreen`, enters a unique username (`TestUser-${Date.now()}`), presses Continue, waits for navigation to `/(tabs)/AssignmentsList`, unmounts, and returns the username string.

### `openNewEssay(mockPush)`

Renders `WriteEssayPage`, waits for "My Drafts" to appear, presses "+ New Essay", asserts `mockPush` was called with `/(noneMainScreens)/WriteEssayScreen`, then unmounts.
