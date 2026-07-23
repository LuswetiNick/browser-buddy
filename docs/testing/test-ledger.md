# BrowserBuddy Test Ledger

This file tracks feature-to-test coverage. Update it whenever a feature changes behavior or when tests are added, removed, skipped, or materially rewritten.

## Current Baseline

| Area             | Status                 | Notes                                                                        |
| ---------------- | ---------------------- | ---------------------------------------------------------------------------- |
| Authentication   | Implemented and tested | Clerk is installed and wired into the app. Auth smoke coverage now exists.   |
| Workflow builder | Not implemented        | Add graph and editor tests with the first workflow feature.                  |
| AI execution     | Not implemented        | Use mocked provider responses when added.                                    |
| Persistence      | Schema implemented     | Neon, Drizzle, the workflow schema, and versioned migrations are configured. |
| Authorization    | Partial                | Clerk exists; app-level ownership and permissions are not implemented yet.   |
| Test tooling     | Implemented            | Vitest, React Testing Library, Playwright, Clerk testing, and MSW exist.     |

## Feature Records

### Template

Copy this section for each feature:

```md
### YYYY-MM-DD - Feature Name

- Changed areas:
- Primary risks:
- Tests added:
- Tests updated:
- Verification:
- Known gaps:
```

### 2026-07-15 - Clerk Authentication

- Changed areas: root layout auth provider, sign-in route, sign-up route, Clerk proxy, Clerk environment configuration
- Primary risks: signed-out controls missing, Clerk routes unavailable, signed-in user controls not visible
- Tests added:
  - `tests/components/auth-header.test.tsx`
  - `tests/e2e/auth.spec.ts`
  - `tests/e2e/clerk.ts`
- Tests updated: none
- Verification: `clerk doctor`, `pnpm test:run`, `pnpm test:e2e`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: add authenticated Playwright flows once BrowserBuddy has a real signed-in workflow page beyond the protected dashboard path

### 2026-07-15 - Testing Tooling Baseline

- Changed areas: package scripts, Vitest config, Playwright config, test setup, Playwright browser installation
- Primary risks: tests not resolving TypeScript aliases, E2E tests requiring manual dev server startup, Clerk testing helpers not available for future authenticated flows
- Tests added:
  - `tests/components/auth-header.test.tsx`
  - `tests/e2e/auth.spec.ts`
  - `tests/e2e/clerk.ts`
- Tests updated: none
- Verification: `pnpm test:run`, `pnpm test:e2e`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: add workflow graph unit tests with the first workflow domain utilities; add MSW handlers when API or AI provider calls are introduced

### 2026-07-15 - Hook Lint Cleanup

- Changed areas: `hooks/use-mobile.ts`, `components/ui/carousel.tsx`
- Primary risks: lint blocked CI verification; changes needed to preserve existing responsive and carousel behavior
- Tests added: none
- Tests updated: none
- Verification: `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, `pnpm test:e2e`, `pnpm build`
- Known gaps: no dedicated carousel or responsive hook tests yet; add focused tests when those components become feature-critical

### 2026-07-15 - Choose Organization Task Route

- Changed areas: Clerk provider task URL mapping, `choose-organization` session-task page
- Primary risks: Clerk session task not mapped to the app route, choose-organization task UI not rendered, users not redirected to the dashboard after task completion
- Tests added:
  - `tests/components/choose-organization-page.test.tsx`
- Tests updated: none
- Verification: `pnpm test:run -- tests/components/choose-organization-page.test.tsx`, `pnpm test:run`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: no live E2E coverage for the session-task state yet; add authenticated Clerk task-flow coverage after Organizations are enabled and a test user can enter the `choose-organization` task

### 2026-07-15 - Auth Route Group Organization

- Changed areas: `sign-in`, `sign-up`, and `choose-organization` pages moved under `app/(auth)` route group
- Primary risks: route URLs changing unintentionally, tests importing the old page module path
- Tests added: none
- Tests updated:
  - `tests/components/choose-organization-page.test.tsx`
- Verification: `pnpm exec next typegen`, `pnpm test:run -- tests/components/choose-organization-page.test.tsx tests/components/dashboard-page.test.tsx`, `pnpm test:run`, `pnpm test:e2e`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: none

### 2026-07-15 - Dashboard Organization Guard

- Changed areas: `app/dashboard/page.tsx`
- Primary risks: signed-in users without an active organization could access the dashboard
- Tests added:
  - `tests/components/dashboard-page.test.tsx`
- Tests updated: none
- Verification: `pnpm test:run -- tests/components/dashboard-page.test.tsx`, `pnpm test:run`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: add live authenticated E2E coverage once Clerk organization test fixtures are available

### 2026-07-16 - Collapsed Sidebar Organization Switcher

- Changed areas: dashboard sidebar Clerk organization switcher appearance
- Primary risks: collapsed sidebar overflows with organization text or controls; expanded and mobile switchers are unintentionally hidden
- Tests added:
  - `tests/components/app-sidebar.test.tsx`
- Tests updated: none
- Verification: `pnpm exec vitest run tests/components/app-sidebar.test.tsx`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: jsdom does not apply Tailwind responsive variants or render Clerk's live switcher DOM; verify the collapsed and mobile visuals in an authenticated browser session

### 2026-07-16 - Sidebar Tooltip Trigger Composition

- Changed areas: dashboard custom sidebar trigger
- Primary risks: nested buttons produce invalid HTML and hydration errors; tooltip or sidebar trigger loses its button semantics
- Tests added:
  - `tests/components/custom-sidebar-trigger.test.tsx`
- Tests updated:
  - `tests/components/dashboard-page.test.tsx`
- Verification: `pnpm test:run`, `pnpm typecheck`, `pnpm lint`, `pnpm build`
- Known gaps: no authenticated browser test currently exercises the dashboard header tooltip

### 2026-07-22 - Collapsible Sidebar Logo

- Changed areas: shared logo component customization and dashboard sidebar header
- Primary risks: the logo wordmark remains visible and overflows the collapsed sidebar; the remaining icon is hidden or misaligned; the expanded or mobile logo loses its wordmark
- Tests added: none
- Tests updated:
  - `tests/components/app-sidebar.test.tsx`
- Verification: `pnpm exec vitest run tests/components/app-sidebar.test.tsx`, `pnpm typecheck`, `pnpm lint`
- Known gaps: jsdom does not apply Tailwind group-data variants; verify expanded, collapsed, and mobile logo presentation in a browser session

### 2026-07-22 - External Store Hook Lint Fix

- Changed areas: carousel navigation state, responsive mobile state, and marketing header logo assertion
- Primary risks: carousel navigation buttons do not reflect Embla selection changes; responsive layouts do not update when crossing the mobile breakpoint; the quality gate remains blocked by synchronous effect state updates
- Tests added:
  - `tests/components/carousel.test.tsx`
  - `tests/hooks/use-mobile.test.tsx`
- Tests updated:
  - `tests/components/auth-header.test.tsx`
- Verification: `pnpm exec vitest run tests/components/carousel.test.tsx tests/hooks/use-mobile.test.tsx tests/components/auth-header.test.tsx`, `pnpm lint`, `pnpm typecheck`, `pnpm test:run`, `pnpm build`
- Known gaps: carousel geometry and responsive presentation still require browser-level visual coverage when these components become feature-critical

### 2026-07-22 - Neon Drizzle Foundation

- Changed areas: Neon project context, database environment validation, pooled Drizzle client, Drizzle Kit configuration and scripts, package dependencies, deployment environment documentation
- Primary risks: database credentials leaking into client code, missing environment variables failing unclearly, migrations using a pooled connection, Vercel function instances retaining idle connections
- Tests added:
  - `tests/db/env.test.ts`
- Tests updated: none
- Verification: `pnpm exec vitest run tests/db/env.test.ts`, `pnpm db:generate`, `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, `pnpm build`, direct `SELECT 1` through the configured PostgreSQL pool
- Known gaps: no workflow repository exists yet, so database integration tests should be added with the first persistence service

### 2026-07-23 - Drizzle CLI Connection Timeout

- Changed areas: `db:push` and `db:migrate` package scripts
- Primary risks: Node's default network-family attempt timeout expires before the Neon TCP connection completes; local migration behavior differs from the deployment workflow
- Tests added: none
- Tests updated: none
- Verification: `pnpm db:push --explain`, `npm run db:migrate -- --help`, package-script assertion, `node_modules/.bin/vitest run tests/db/env.test.ts`
- Known gaps: `db:studio` still uses Node's default network-family attempt timeout

### 2026-07-23 - Production Database Migration Pipeline

- Changed areas: secure migration URL validation, server-only database boundary, staging and production deployment workflow, CI/CD documentation, initial workflow migration
- Primary risks: production credentials exposed outside the migration step, pooled connections used for DDL, migrations interrupted by newer deploys, application deployment continuing after a failed migration, initial migration colliding with a table previously created by `db:push`
- Tests added: none
- Tests updated:
  - `tests/db/env.test.ts`
- Verification: `pnpm exec vitest run tests/db/env.test.ts`, `pnpm db:generate`, `drizzle-kit check`, `pnpm db:push --explain`, workflow YAML validation, `pnpm typecheck`, `pnpm lint`, `pnpm test:run`, `pnpm build`
- Known gaps: database repository integration tests will be added with the first workflow persistence service; production environment approval and secret configuration must be completed in GitHub

### 2026-07-23 - Deployment Environment Alignment

- Changed areas: deployment workflow environment mapping, local database variable guidance, and CI/CD secret scoping documentation
- Primary risks: staging deploys cannot access Preview-scoped migration secrets; production deploys bypass Production protection rules because of a case-mismatched environment name; direct migration credentials are unnecessarily exposed to the application runtime
- Tests added: none
- Tests updated: none
- Verification: workflow YAML validation, Prettier, `git diff --check`, `node_modules/.bin/vitest run`
- Known gaps: `Preview` and `Production` environment secrets and deployment branch policies must be configured in GitHub
