import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import CustomSidebarTrigger from "@/components/dashboard/custom-sidebar-trigger"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => false,
}))

describe("CustomSidebarTrigger", () => {
  it("uses the sidebar button as the tooltip trigger", () => {
    const { container } = render(
      <TooltipProvider>
        <SidebarProvider>
          <CustomSidebarTrigger />
        </SidebarProvider>
      </TooltipProvider>
    )

    expect(
      screen.getAllByRole("button", { name: "Toggle Sidebar" })
    ).toHaveLength(1)
    expect(container.querySelector("button button")).not.toBeInTheDocument()
  })
})
