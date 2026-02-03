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
- `uvicorn main:app --reload` — start FastAPI dev server
- Python virtualenv is at `backend/venv`

### Docker (run from repo root)
- `docker compose up` — start all services (database + backend)
- `docker compose up -d` — start in detached mode
- `docker compose down` — stop all services
- `docker compose down -v` — stop and remove volumes (resets database)
- Database exposed on port 5439, backend on port 8000
- Environment variables loaded from `.env.development`

## Architecture

```
pismo/
├── backend/         # FastAPI backend (Python)
├── mobile/          # Expo/React Native app (TypeScript)
├── eslint.config.mjs  # Shared ESLint flat config
├── .husky/          # Pre-commit runs lint-staged on mobile/**/*.{ts,tsx}
└── package.json     # Root: lint scripts, husky, lint-staged config
```

### Mobile App Routing
Uses Expo Router (file-based routing):
- `mobile/app/_layout.tsx` — Root Stack navigator
- `mobile/app/(tabs)/_layout.tsx` — Tab navigator layout
- `mobile/app/(tabs)/*.tsx` — Individual tab screens

### Backend
FastAPI app defined in `backend/main.py`. Dependencies include Pydantic, Sentry SDK, and python-dotenv (available via `backend/requirements.txt`).

### Path Aliases
The mobile app uses `@/` as an alias for the `mobile/` directory (e.g., `import { useColorScheme } from '@/hooks/use-color-scheme'`).

### Theme/Colors
Colors must come from `mobile/constants/theme.ts` (enforced by `react-native/no-color-literals`). The theme exports `Colors.light` and `Colors.dark` palettes.

## Linting Rules to Know

The ESLint config enforces strict rules that the pre-commit hook will catch:

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

## TypeScript

- Strict mode enabled
- Unused vars must be prefixed with `_`
- `@ts-ignore` and `@ts-nocheck` are banned; use `@ts-expect-error` with a description (10+ chars)
