import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import DashboardPage from "@/app/dashboard/page"

const authProtect = vi.hoisted(() => vi.fn())
const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  })
)

vi.mock("@clerk/nextjs/server", () => ({
  auth: {
    protect: authProtect,
  },
}))

vi.mock("@clerk/nextjs", () => ({
  OrganizationSwitcher: () => <div data-testid="organization-switcher" />,
  UserButton: () => <button aria-label="Open user menu" />,
}))

vi.mock("next/navigation", () => ({
  redirect,
}))

describe("DashboardPage", () => {
  beforeEach(() => {
    authProtect.mockReset()
    redirect.mockClear()
  })

  it("redirects signed-in users without an active organization", async () => {
    authProtect.mockResolvedValueOnce({ orgId: null })

    await expect(DashboardPage()).rejects.toThrow(
      "NEXT_REDIRECT:/choose-organization"
    )
    expect(redirect).toHaveBeenCalledWith("/choose-organization")
  })

  it("renders the dashboard when the user has an active organization", async () => {
    authProtect.mockResolvedValueOnce({ orgId: "org_123" })

    render(await DashboardPage())

    expect(screen.getByRole("heading")).toBeVisible()
    expect(screen.getByRole("button", { name: "Open user menu" })).toBeVisible()
    expect(screen.getByTestId("organization-switcher")).toBeVisible()
    expect(redirect).not.toHaveBeenCalled()
  })
})
