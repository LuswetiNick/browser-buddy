import { expect, test } from "@playwright/test"

import { setupOptionalClerkTestingToken } from "./clerk"

test.beforeEach(async ({ page }) => {
  await setupOptionalClerkTestingToken(page)
})

test("signed-out users see auth controls on the homepage", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("link", { name: "BrowserBuddy" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Sign up" })).toBeVisible()
})

test("sign-in route renders", async ({ page }) => {
  await page.goto("/sign-in")

  await expect(page).toHaveURL(/\/sign-in/)
  await expect(page.getByRole("main", { name: "Sign in" })).toBeVisible()
})

test("sign-up route renders", async ({ page }) => {
  await page.goto("/sign-up")

  await expect(page).toHaveURL(/\/sign-up/)
  await expect(page.getByRole("main", { name: "Sign up" })).toBeVisible()
})
