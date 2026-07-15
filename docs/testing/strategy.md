# BrowserBuddy Testing Strategy

BrowserBuddy is a workflow AI builder. The testing strategy should protect the highest-risk behavior first: authentication, workflow graph correctness, editor interactions, AI execution boundaries, persistence, and permissions.

## Recommended Stack

Use this stack as the project grows:

- Unit and integration tests: Vitest
- React component tests: React Testing Library, `@testing-library/user-event`, `@testing-library/jest-dom`, jsdom
- End-to-end tests: Playwright
- Clerk E2E support: `@clerk/testing`
- Network and AI mocks: MSW

Do not add all tools before they are needed. Add Vitest when the first domain logic or component test is introduced. Add Playwright before implementing the workflow editor or any authenticated user flow beyond basic Clerk setup.

## Test Layers

### Static Checks

Run on every change:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build` before merging larger UI, routing, auth, or server changes

Static checks are required but not sufficient. They do not prove the workflow builder works from a user perspective.

### Unit Tests

Use unit tests for deterministic logic that should not need a browser:

- Workflow graph validation
- Cycle detection
- Node connection rules
- Execution ordering
- Input/output schema validation
- Prompt template variable parsing
- Retry/backoff utilities
- Permission and ownership predicates

Prefer table-driven tests for graph and workflow cases. Keep test data small, explicit, and named.

### Component Tests

Use React Testing Library for focused UI behavior:

- Header signed-in and signed-out states with mocked Clerk components
- Node configuration panels
- Form validation and error states
- Sidebar and command palette behavior
- Empty states, loading states, and disabled controls

Test by accessible role, label, and visible text first. Use `data-testid` only when canvas or icon-only controls have no stable accessible query.

### End-to-End Tests

Use Playwright for user journeys that cross routing, browser behavior, authentication, drag/drop, persistence, or server boundaries:

- Signed-out user can reach sign-in and sign-up
- Authenticated user lands in the builder
- Create a workflow
- Add nodes to the canvas
- Connect nodes
- Configure node inputs
- Save and reload a workflow
- Run a workflow with mocked AI/API responses
- Permission checks for another user's workflow

Use Clerk testing helpers for authenticated flows. Do not rely on a personal Clerk session or manual sign-in for automated tests.

### Contract and Integration Tests

Add these when the app has a database, API routes, or server actions:

- API route request/response contracts
- Server action validation
- Database repository behavior against a test database
- Webhook signature and event handling
- AI provider adapter behavior with mocked responses

Never call paid AI providers in normal CI. Mock provider responses with MSW or adapter-level fixtures.

## Feature Testing Checklist

For every feature, decide which boxes apply:

- Does this add or change business logic? Add unit tests.
- Does this add or change user-facing UI behavior? Add component tests or E2E tests.
- Does this touch routing, auth, persistence, or browser-only behavior? Add Playwright coverage.
- Does this call external services? Add mocked integration tests.
- Does this change permissions or ownership rules? Add positive and negative authorization tests.
- Does this change workflow execution semantics? Add graph/execution regression tests.

## Initial Coverage Plan

Start with these tests:

1. Auth smoke E2E: signed-out users see sign-in and sign-up controls.
2. Auth route E2E: `/sign-in` and `/sign-up` render Clerk pages.
3. Header component test: signed-out state shows auth actions; signed-in state shows the user menu.
4. Workflow graph unit tests once graph utilities exist: valid connection, invalid connection, cycle rejection, topological order.

## CI Policy

Target this CI shape once test tools are installed:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

For quick local feature work:

```bash
pnpm typecheck
pnpm test -- --run
```

Run Playwright locally before merging editor, auth, persistence, or permission changes.

## Test Naming

Use behavior-oriented names:

- Good: `rejects a connection that would create a cycle`
- Good: `shows sign-up when the user is signed out`
- Avoid: `works`, `renders`, `test graph`

## Tracking

Track feature-to-test coverage in `docs/testing/test-ledger.md`. Every feature entry should include:

- Feature name
- Changed areas
- Risks
- Test files added or updated
- Verification commands
- Known gaps
