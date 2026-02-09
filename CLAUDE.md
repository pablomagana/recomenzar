# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**reComenzar** is a Spanish-language personal accountability/recovery app built with Vue 3 + Capacitor. Users track daily mood, submit reports, manage weekly challenges (max 3), and plan tomorrow's schedule with time-based corrections. The backend API is external (not in this repo).

## Development Commands

```bash
npm run dev          # Start Vite dev server (port 5173)
npm run build        # Type-check with vue-tsc then build with Vite
npm run lint         # ESLint with --fix across all source files
npm run format       # Prettier on src/
```

### Capacitor (mobile)

```bash
npx cap sync         # Sync web build to native projects
npx cap open ios     # Open iOS project in Xcode
npx cap open android # Open Android project in Android Studio
```

Build output goes to `dist/`, which Capacitor reads from (`webDir: 'dist'` in capacitor.config.ts).

## Architecture

**Stack:** Vue 3 (Composition API + `<script setup>`), Pinia, Vue Router, TypeScript, Tailwind CSS, Axios, Capacitor 6

**Path alias:** `@/` maps to `src/`

### Layer Structure

- **`src/types/index.ts`** — All TypeScript interfaces. Domain model uses Spanish field names matching the backend API (`estadoAnimo`, `horarioCumplido`, `registradoPara`, etc.)
- **`src/services/api/`** — API layer. Each file wraps axios calls for a domain. `client.ts` configures the shared axios instance with JWT auth interceptor and automatic token refresh with request queuing on 401.
- **`src/services/storage.ts`** — Wraps `@capacitor/preferences` for persistent key-value storage (tokens, user data). Handles `undefined`/`null` string edge cases.
- **`src/services/notifications.ts`** — Local notification scheduling via `@capacitor/local-notifications`. Three categories: `reminder` (recurring daily), `schedule` (one-time activity alerts), `alert`. Uses ID ranges (1000+, 2000+, 3000+) to avoid collisions.
- **`src/services/timeUtils.ts`** — Date/time helpers for limit checks, week calculations, formatting (es-ES locale).
- **`src/stores/`** — Pinia stores (Composition API style). Each store owns loading/error state and calls its corresponding API service. `auth` store manages JWT tokens + initialization from storage on app start.
- **`src/composables/`** — `useAuth` (login/register/logout with navigation), `useTimeRestrictions` (reactive time-limit warnings driven by env vars).
- **`src/views/`** — Page-level components. Tabbed layout (`TabsLayout.vue`) with 4 tabs: Profile, Challenges, Reports, Schedule.
- **`src/components/`** — Organized by domain: `auth/`, `profile/`, `challenges/`, `reports/`, `schedule/`, `common/`.

### Auth Flow

1. `App.vue` calls `authStore.initialize()` on mount, restoring tokens from Capacitor Preferences
2. Router guard (`router/guards.ts`) checks `requiresAuth`/`requiresGuest` meta on every navigation
3. API client interceptor auto-attaches Bearer token and handles 401 refresh with queue

### Key Domain Concepts

- **Reports** — One daily report per user. Time-restricted by `VITE_HORA_LIMITE_REPORTE`. Includes mood (1-5), schedule compliance, calls made, challenge completion (keyed by challenge ID), and written report.
- **Schedule** — Plan *tomorrow's* schedule with time+action entries. After the day passes, corrections (`horaCorreccion`/`accionCorreccion`) can be recorded. Uses `registradoPara` (not `fecha`) when creating via API.
- **Challenges** — Weekly challenges, max 3 per user. Reset tracking tied to `VITE_HORA_REINICIO_RETOS`.

## Environment Variables

Configured in `.env` (see `.env.example`). All prefixed with `VITE_`:

- `VITE_API_BASE_URL` — Backend API base URL
- `VITE_HORA_LIMITE_REPORTE` / `VITE_HORA_LIMITE_HORARIO` / `VITE_HORA_REINICIO_RETOS` — Time limits (HH:MM format)
- `VITE_NOTIF_HORAS` — Comma-separated notification times
- `VITE_NOTIF_MENSAJE_*` — Notification message templates

## Brand Colors (Tailwind)

Defined in `tailwind.config.js` under `brand-*`: brown `#4A3728`, green `#2E7D32`, green-light `#E8F5E9`, orange `#F9A825`, gray-dark `#424242`, gray-light `#F5F5F5`.
