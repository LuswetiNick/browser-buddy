# CI/CD Plan

BrowserBuddy uses GitHub Actions for test gates and Vercel for deployments.

## Branch Flow

- Feature branches target `staging` with pull requests.
- `staging` is the integration branch for upcoming changes.
- `master` is the production branch and should only receive promoted, tested changes from `staging`.

## Required GitHub Checks

Require the `CI / Quality Gate` and `CI / Browser E2E` checks before merging into both `staging` and `master`.

Recommended branch protection:

- Require pull requests before merging.
- Require status checks to pass.
- Require branches to be up to date before merging.
- Do not allow force pushes.
- Restrict direct pushes to `master`.

## CI Workflow

The workflow in `.github/workflows/ci.yml` runs on:

- Pull requests into `staging` and `master`
- Pushes to `staging` and `master`
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

## CD Workflow

Deployment jobs run only after the CI jobs pass.

On pushes to `staging`, GitHub Actions deploys a Vercel Preview deployment:

```bash
vercel pull --yes --environment=preview
vercel build
vercel deploy --prebuilt
```

On pushes to `master`, GitHub Actions deploys a Vercel Production deployment:

```bash
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

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

Assign staging or test Clerk keys to Vercel Preview, and production Clerk keys to Vercel Production. The GitHub deploy jobs run `vercel pull`, so Vercel provides those application variables to `vercel build`.

## Deployment Policy

Recommended deployment behavior:

- `staging` branch deploys to a staging/preview environment.
- `master` branch deploys to production.
- Production deployment should happen only after the CI workflow passes on the merge to `master`.

If the Vercel Git integration is currently auto-deploying this repository, either disable automatic Vercel deployments or remove the GitHub Actions deploy jobs to avoid duplicate deployments.

References:

- Vercel GitHub Actions guide: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
- Vercel CLI deploy docs: https://vercel.com/docs/cli/deploy
