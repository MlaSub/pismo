# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pismo is a monorepo with a Python/FastAPI backend and a React Native (Expo) mobile app. Root-level tooling handles linting and git hooks.

## Commands

### Linting (run from repo root)
- `npm run lint` — lint mobile code
- `npm run lint:fix` — lint and auto-fix mobile code

### Mobile (run from `mobile/`)
- `npm start` — start Expo dev server
- `npm run ios` — start on iOS simulator
- `npm run android` — start on Android emulator
- `npm run web` — start web version

### Backend (run from `backend/`)
- `uvicorn app.main:app --reload` — start FastAPI dev server
- Python virtualenv is at `backend/venv`

### Docker (run from repo root)
- `docker compose up` — start all services (database + backend)
- `docker compose up -d` — start in detached mode
- `docker compose down` — stop all services
- `docker compose down -v` — stop and remove volumes (resets database)
- Database exposed on port 5439, backend on port 8000
- Backend runs via `fastapi dev --host 0.0.0.0 app/main.py` inside Docker
- Environment variables loaded from `.env.development`

## Architecture

```
pismo/
├── backend/              # FastAPI backend (Python 3.12+)
│   └── app/
│       ├── main.py       # FastAPI app entry point
│       ├── config.py     # Pydantic BaseSettings (loads .env.development)
│       ├── database/
│       │   ├── database.py   # SQLAlchemy engine, Base, SessionLocal, get_db()
│       │   └── entities.py   # Models: User, Essay, EssayAnalysis, Feedback
│       ├── routes/           # APIRouter modules
│       └── schemas/          # Pydantic request/response schemas
├── mobile/               # Expo/React Native app (TypeScript)
├── dockerfiles/          # backend.dockerfile (Python 3.14-slim)
├── eslint.config.mjs     # ESLint flat config for mobile
├── pyproject.toml        # Ruff config for backend
├── .husky/               # Pre-commit runs lint-staged
└── package.json          # Root: lint scripts, husky, lint-staged config
```

### Backend

FastAPI app defined in `backend/app/main.py` (note: `app/` subdirectory, not root). Database models auto-created on startup via `Base.metadata.create_all()` — no Alembic migrations. PostgreSQL driver is `psycopg` v3 (`postgresql+psycopg`). Session management via `get_db()` dependency.

Key env vars (in `.env.development`): `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `ENVIROMENT`, `database_host`, `database_port`.

### Mobile App Routing
Uses Expo Router (file-based routing):
- `mobile/app/_layout.tsx` — Root Stack navigator
- `mobile/app/(tabs)/_layout.tsx` — Tab navigator layout
- `mobile/app/(tabs)/*.tsx` — Individual tab screens

### Path Aliases
The mobile app uses `@/` as an alias for the `mobile/` directory (e.g., `import { useColorScheme } from '@/hooks/use-color-scheme'`).

### Theme/Colors
Colors must come from `mobile/constants/theme.ts` (enforced by `react-native/no-color-literals`). The theme exports `Colors.light` and `Colors.dark` palettes, and `Fonts` with platform-specific system fonts.

## Pre-commit Hooks

Husky runs `lint-staged` on commit, which triggers **both** linters:
- **Mobile**: `eslint --fix` on `mobile/**/*.{js,jsx,ts,tsx}`
- **Backend**: `ruff check --fix` then `ruff format` on `backend/**/*.py`

## Linting Rules to Know

### ESLint (Mobile)

- **No inline styles** in React Native (`react-native/no-inline-styles`)
- **No color literals** — colors must come from a theme/constants (`react-native/no-color-literals`)
- **No magic numbers** (except 0, 1, -1)
- **Max function length**: 50 lines (excluding blanks/comments)
- **Max nesting depth**: 3
- **Complexity limit**: 10
- **Import ordering**: grouped (builtin → external → internal → parent → sibling → index) with newlines between groups, alphabetized
- **TypeScript**: use `type` imports for type-only imports, prefer `interface` over `type` for object shapes, no `I` prefix on interfaces
- **No `console.log`** — only `console.warn` and `console.error` allowed
- **Promises**: no floating promises, no misused promises, `return await` only in try-catch
- **No param reassignment**
- **Strict equality** (`===`) required

### Ruff (Backend)

Configured in `pyproject.toml`. Line length 88, target Python 3.12, auto-fix enabled.
- Selected rule sets: E, W, F, I, N, UP, B, C4, SIM, TCH, Q, RET, ARG, PTH, ERA, PL, ASYNC, S
- Ignored: `E501` (line length), `PLR0913` (too many args), `ARG002` (unused method arg), `B008` (function call in default), `N999` (invalid module name)
- Isort: first-party = `["app"]`
- Format: double quotes, space indent

## TypeScript

- Strict mode enabled
- Unused vars must be prefixed with `_`
- `@ts-ignore` and `@ts-nocheck` are banned; use `@ts-expect-error` with a description (10+ chars)
