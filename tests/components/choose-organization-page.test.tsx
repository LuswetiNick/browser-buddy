import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import ChooseOrganizationPage from "@/app/(auth)/choose-organization/page"

const taskChooseOrganization = vi.fn()

vi.mock("@clerk/nextjs", () => ({
  TaskChooseOrganization: (props: { redirectUrlComplete: string }) => {
    taskChooseOrganization(props)

    return <div data-testid="choose-organization-task" />
  },
}))

describe("ChooseOrganizationPage", () => {
  it("renders Clerk's choose-organization task UI", () => {
    render(<ChooseOrganizationPage />)

    expect(
      screen.getByRole("main", { name: "Choose organization" })
    ).toBeVisible()
    expect(screen.getByTestId("choose-organization-task")).toBeVisible()
    expect(taskChooseOrganization).toHaveBeenCalledWith({
      redirectUrlComplete: "/dashboard",
    })
  })
})
