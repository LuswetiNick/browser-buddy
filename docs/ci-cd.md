# CI/CD Plan

BrowserBuddy uses GitHub Actions for test gates and Vercel for deployments. CI and deployment are split into separate workflows so pull requests only show checks that matter before merge.

## Branch Flow

- Feature branches target `staging` with pull requests.
- `staging` is the integration branch for upcoming changes.
- `master` is the production branch and should only receive promoted, tested changes from `staging`.

## Required GitHub Checks

Require the `CI / Quality Gate` and `CI / Browser E2E` checks before merging into both `staging` and `master`.

Do not require deployment workflow checks for pull requests. Deployment checks only run after code is merged or pushed to a deployment branch.

Recommended branch protection:

- Require pull requests before merging.
- Require status checks to pass.
- Require branches to be up to date before merging.
- Do not allow force pushes.
- Restrict direct pushes to `master`.

## CI Workflow

The workflow in `.github/workflows/ci.yml` runs on:

- Pull requests into `staging` and `master`
- Manual dispatch

The quality gate runs:

```bash
pnpm install --frozen-lockfile
pnpm exec next typegen
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

The browser E2E gate runs:

```bash
pnpm exec playwright install --with-deps chromium
pnpm test:e2e
```

## Deploy Workflow

The workflow in `.github/workflows/deploy.yml` runs on:

- Pushes to `staging` and `master`
- Manual dispatch

The deploy workflow reruns the same quality and browser E2E gates before deploying. This keeps PR checks clean while still preventing deploys when tests fail.

On pushes to `staging`, GitHub Actions builds a Vercel Preview deployment,
applies committed migrations to the staging database, and then deploys:

```bash
vercel pull --yes --environment=preview
vercel build
pnpm db:migrate
vercel deploy --prebuilt
```

On pushes to `master`, GitHub Actions builds a Vercel Production deployment,
applies committed migrations to the production database, and then deploys:

```bash
vercel pull --yes --environment=production
vercel build --prod
pnpm db:migrate
vercel deploy --prebuilt --prod
```

Deployment workflow runs are serialized per branch and are not canceled in
progress, preventing a newer push from interrupting a database migration.

## Database Migration Policy

- Define schema changes in `db/schema.ts`.
- Run `pnpm db:generate` locally and commit the generated `db/migrations`
  files.
- The initial workflow migration uses `CREATE TABLE IF NOT EXISTS` to adopt
  environments where the matching table was previously created with
  `db:push`. Subsequent migrations should remain explicit so unexpected schema
  drift fails visibly.
- Use `pnpm db:push` only for local prototyping. Production and staging use
  the committed migration history through `pnpm db:migrate`.
- Use a direct, unpooled Neon connection for migrations. The migration
  configuration enforces `sslmode=verify-full` and
  `channel_binding=require`.
- Keep migrations backward compatible with the currently deployed
  application whenever possible because the database is migrated immediately
  before the new Vercel artifacts are deployed.

## Local Database Variables

Keep both local database URLs in `.env.local`, which is excluded from Git:

```dotenv
DATABASE_URL="<runtime URL for the development Neon branch>"
DATABASE_URL_UNPOOLED="<direct URL for the same development Neon branch>"
```

Both URLs must target the same Neon branch, database, and role.
`DATABASE_URL_UNPOOLED` must be the direct URL whose hostname does not contain
`-pooler`. Use a separate development branch rather than production; using the
staging branch locally is acceptable only when a dedicated development branch
is not available.

If Neon credentials are rotated, replace both local values with the matching
new URLs. The migration configuration adds `sslmode=verify-full` and
`channel_binding=require`, but keeping those parameters in the stored URLs is
also recommended.

## Required GitHub Secrets

Add these repository secrets in GitHub for CI builds and tests:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Optional for future authenticated E2E tests:

- `CLERK_TESTING_TOKEN`

Use non-production Clerk keys for normal CI until you intentionally split CI by environment. Do not commit Clerk secrets.

Add these repository secrets in GitHub for Vercel deployment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Vercel decides whether the deployment is Preview or Production from the CLI commands in the workflow. Do not use `staging` as a Vercel environment value; Vercel's standard targets here are `preview` and `production`.

Use the existing GitHub environments named `Preview` and `Production`. Add a
`DATABASE_URL_UNPOOLED` environment secret to each one using the direct Neon
connection for the matching database branch:

- `Preview` → staging Neon branch
- `Production` → production Neon branch

The URL must use:

```text
sslmode=verify-full&channel_binding=require
```

Restrict the `Preview` environment to the `staging` branch. Protect the
`Production` environment with required reviewers and restrict it to the
`master` branch. GitHub environment names are case-sensitive, so the workflow
uses the existing names exactly. Environment scoping keeps migration
credentials out of the normal CI, test, dependency-installation, and build
steps.

## Vercel Setup

Create a Vercel token in Vercel account settings and add it to GitHub as `VERCEL_TOKEN`.

To find the org and project IDs:

```bash
vercel link
```

Then read `.vercel/project.json` locally and add the values as GitHub secrets:

- `orgId` → `VERCEL_ORG_ID`
- `projectId` → `VERCEL_PROJECT_ID`

Do not commit `.vercel/project.json` unless you intentionally want to share project linkage metadata.

Set application runtime variables in the Vercel dashboard under Project Settings → Environment Variables. At minimum, this project needs Clerk keys for the relevant Vercel environments:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL`

Assign staging or test Clerk keys to Vercel Preview, and production Clerk keys to Vercel Production. The GitHub deploy jobs run `vercel pull`, so Vercel provides those application variables to `vercel build`.

Do not add `DATABASE_URL_UNPOOLED` to Vercel for this pipeline. The direct
migration credential is read only from the protected GitHub environment during
the migration step.

## Deployment Policy

Recommended deployment behavior:

- Pull requests run only the CI workflow.
- `staging` branch uses the GitHub `Preview` environment and deploys a Vercel Preview after deploy workflow checks pass.
- `master` branch deploys to production after deploy workflow checks pass.
- Production deployment should happen only after a reviewed merge to `master`.

If the Vercel Git integration is currently auto-deploying this repository, either disable automatic Vercel deployments or remove the GitHub Actions deploy jobs to avoid duplicate deployments.

References:

- Vercel GitHub Actions guide: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
- Vercel CLI deploy docs: https://vercel.com/docs/cli/deploy
