import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import AppSidebar from "@/components/dashboard/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const organizationSwitcher = vi.hoisted(() => vi.fn(() => null))

vi.mock("@clerk/nextjs", () => ({
  OrganizationSwitcher: organizationSwitcher,
}))

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

describe("AppSidebar", () => {
  it("centers the visible logo icon and hides only the wordmark when collapsed", () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
      </SidebarProvider>
    )

    const wordmark = screen.getByText("BrowserBuddy.")
    const logoButton = wordmark.closest("button")
    const icon = wordmark.parentElement?.querySelector("svg")

    expect(logoButton).toHaveClass(
      "group-data-[collapsible=icon]:justify-center"
    )
    expect(wordmark).toHaveClass("group-data-[collapsible=icon]:hidden")
    expect(icon).toBeInTheDocument()
    expect(icon).not.toHaveClass("group-data-[collapsible=icon]:hidden")
  })

  it("hides non-logo organization switcher elements when collapsed", () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
      </SidebarProvider>
    )

    expect(organizationSwitcher).toHaveBeenCalledWith(
      expect.objectContaining({
        appearance: {
          elements: expect.objectContaining({
            organizationPreviewTextContainer: expect.stringContaining(
              "group-data-[collapsible=icon]:hidden"
            ),
            organizationSwitcherTriggerIcon: expect.stringContaining(
              "group-data-[collapsible=icon]:hidden"
            ),
            notificationBadge: expect.stringContaining(
              "group-data-[collapsible=icon]:hidden"
            ),
          }),
        },
      }),
      undefined
    )
  })
})
