import { setupClerkTestingToken } from "@clerk/testing/playwright"
import type { Page } from "@playwright/test"

export async function setupOptionalClerkTestingToken(page: Page) {
  if (!process.env.CLERK_TESTING_TOKEN) {
    return
  }

  await setupClerkTestingToken({ page })
}
