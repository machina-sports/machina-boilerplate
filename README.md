# Developer Guide (folder-level overview)

This document focuses on the folder/architecture layout (no component API deep dives).

## Top-level map
- `app/`: Next.js App Router entrypoints, layouts, route handlers.
- `components/`: Shared UI and data widgets (Shadcn under `components/ui`, nav/header shells, workflow visualizers, table/form building blocks). Keep feature-specific state out of here.
- `containers/`: Feature modules (admin/core) bundling Redux slice, thunks, services, schemas, and view components per domain.
- `providers/`: Runtime wrappers (Session, Data, Navbar, analytics) and domain providers each with `actions.ts`, `reducer.ts`, `service.ts`, optional `schemas.ts`.
- `store/`: Redux Toolkit setup (`makeStore`, `getStore`, typed hooks). Logging is gated by `NEXT_PUBLIC_WEBAPP_REDUX_LOGS`.
- `lib/`: Cross-cutting helpers (auth/session validation, telemetry edge hook, logger, date utils).
- `libs/`: HTTP/client layer (Axios controller/service bases, organization SDK, fonts, generators).
- `hooks/`: Reusable React hooks not tied to a single feature.
- `utils/`: Small pure helpers (cookies, proxy helpers, URL encoding, organization tab config).
- `config/runtime.ts`: Runtime config for template repo paths.
- Tooling roots: `components.json`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`, `tsconfig.json` (path alias `@/*` to repo root).

## State & providers
- Store lives in `store/index.ts`; SSR-safe creation via `getStore`; typed hooks in `store/useState.ts` and `store/dispatch.ts`.
- Provider chain (`providers/index.tsx`): Redux Provider → PostHogIdentify → SessionProvider → DataProvider → page children. HTML shell wraps analytics/theming (GoogleAnalyticsProvider, PostHogProvider, ThemeProvider, StructuredData).
- DataProvider: loads projects/docs and performs project health check on `/project/[id]`, redirecting to status when failing.

## Library boundaries (`lib` vs `libs`)
- `lib/*`: framework-level utilities (session token parsing, logger, OpenTelemetry edge, date/time helpers).
- `libs/*`: transport/client layer on Axios plus shared assets (fonts) and organization helpers.

## Directory expectations
- `components/`: Keep primitives and cross-feature widgets; no feature-specific Redux usage.
- `containers/<feature>/`: One folder per domain with `actions.ts`, `reducer.ts`, `service.ts`, `schemas.ts`, and view components (`container-*`). Wire reducers in `store/index.ts`.
- `providers/<domain>/`: Mirrors container pattern but used as runtime context wrappers; same file naming (`actions/reducer/service/schemas`).
- `app/`: Routes compose providers + containers; avoid business logic in route files.
- `utils/` and `hooks/`: Keep pure and side-effect free (except hooks that wrap browser APIs).
- `config/`: Minimal runtime knobs; prefer env vars and typed config objects.

## Routing shorthand
- Lists: `/[section]/[resource]`
- Create: `/[section]/[resource]/new`
- Detail: `/[section]/[resource]/[id]`
- Edit: `/[section]/[resource]/[id]/edit`
- Nested: `/[section]/[resource]/[id]/[subresource]`

## Framework baseline vs target
- Current project: Next.js `14.2.26`, React 18, Tailwind 3.4, TypeScript 5.
- Target for new boilerplates: Next.js `16.0.7` (secure baseline) with expected React 19; revalidate Radix/Shadcn and ESLint/TS configs when upgrading.

## Boilerplate blueprint (git-clone-and-go)
- Layout: `app/`, `components/ui|data-*`, `containers/`, `providers/`, `store/`, `lib/`, `libs/`, `hooks/`, `utils/`, `config/`.
- State: ship `store/index.ts`, `dispatch.ts`, `useState.ts`, sample slice; SSR-safe store and dev-only logger flag.
- Providers: include `BaseProviders` and `HtmlLayout` equivalents with theme + analytics toggles via env; scaffold `SessionProvider` and `DataProvider`.
- HTTP layer: Axios base controller with session cookie injection + error handling; base service classes; prefix conventions documented.
- Tooling: ESLint (Next + TS), Prettier/Tailwind plugin, `next lint`, GitHub Actions for build/test/lint, optional Husky + lint-staged.
- DX: `components.json`/Shadcn setup, Tailwind/PostCSS configs, `.env.example` covering session cookie, analytics keys, API base. Include README explaining folder boundaries and extension points.

## Prerequisites
- Node.js (LTS), npm or yarn, Git


# Get Help
- If you find any issues, please mail me: mateus.pinheiro@machina.gg