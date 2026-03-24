# Integration Tests

These tests drive the mobile UI end-to-end and make **real HTTP calls** to the backend. No API layer is mocked.

## Prerequisites

The backend must be running before you run any test:

```bash
docker compose up
```

## Running the tests

```bash
# From mobile/
npm test

# With coverage
npm run test:coverage
```

## Test files

### `screens/login.test.tsx`

Tests the **LoginScreen** registration flow.

| Test | What it does |
|------|--------------|
| registers a new user and navigates to the main screen | Fills in a username, selects a CEFR level, submits the form, and asserts the store is populated and the router navigated to the main tab |
| does not navigate when name is empty | Presses Continue with no input and asserts the router was never called |

---

### `flows/uuid-login-flow.test.tsx`

Tests the full **UUID-based re-login** flow across multiple screens.

| Test | What it does |
|------|--------------|
| registers, copies UUID from profile, logs out, then logs back in with UUID | Registers a new user → opens ProfileScreen and copies the UUID → logs out → switches the LoginScreen to UUID mode → pastes the UUID and username → asserts the user lands back on the main tab with the same UUID and profile data |

---

### `screens/write-essay.test.tsx`

Tests the **WriteEssay flow** for Latin (non-Cyrillic) content.

| Test | What it does |
|------|--------------|
| creates a latin essay, verifies it after refresh, reads it back, then deletes it | Registers a user → opens WriteEssayPage and taps "+ New Essay" → types a title and Latin body text → saves → refreshes the drafts list and asserts the draft appears → taps the draft and verifies the stored title and content match → swipe-deletes the draft and asserts it disappears |

---

### `screens/write-essay-cyrillic.test.tsx`

Tests the **WriteEssay flow** for Cyrillic content, exercising the built-in Latin→Cyrillic transliteration keyboard.

The test covers every entry in the character maps (`SINGLE_CHAR_MAP` and `MULTI_CHAR_MAP_NEW`):

| Latin input | Cyrillic output |
|-------------|-----------------|
| Single chars: `a b v g d e i j k l m n o p r u f x w` | `а б в г д е и й к л м н о п р у ф х щ` |
| Digraphs: `yo zh ts ch sh yu ya qq` | `ё ж ц ч ш ю я ъ` |
| Guarded chars: `z s t c y q h` (followed by a neutral letter to suppress digraph) | `з с т ц ы ь х` |

| Test | What it does |
|------|--------------|
| creates a cyrillic essay covering all mapped characters, verifies it after refresh, reads it back, then deletes it | Registers a user → opens WriteEssayPage → switches the content field to "Latin → Cyrillic" mode → feeds the full Latin input string in one shot → asserts the field shows the expected Cyrillic output before saving → saves → refreshes and verifies the draft appears → opens the draft and confirms both title and Cyrillic content are persisted correctly → swipe-deletes and confirms removal |

---

## Test utilities (`test-utils/`)

| File | Purpose |
|------|---------|
| `registerUser.tsx` | Renders LoginScreen, fills in a unique timestamped username, picks CEFR level B2, submits, and waits for navigation — returns the username |
| `openNewEssay.tsx` | Renders WriteEssayPage, presses "+ New Essay", and waits for the router push to WriteEssayScreen |

## Notes

- Usernames are suffixed with `Date.now()` to avoid unique-constraint conflicts across runs.
- Zustand stores are reset in `beforeEach` — `hydrated: true` is set explicitly so the app does not wait for SecureStore hydration.
- `expo-router` is mocked per file so each test controls its own `mockReplace` / `mockPush` / `mockBack` spies.
- `react-native-gesture-handler/ReanimatedSwipeable` is mocked in write-essay tests to expose the swipe action buttons synchronously.
