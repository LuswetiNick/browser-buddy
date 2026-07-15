import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it, vi } from "vitest"

import Header from "@/components/marketing/header"

const clerkState = vi.hoisted(() => ({
  status: "signed-out" as "signed-in" | "signed-out",
}))

vi.mock("@clerk/nextjs", () => ({
  Show: ({
    children,
    when,
  }: {
    children: ReactNode
    when: "signed-in" | "signed-out"
  }) => (when === clerkState.status ? <>{children}</> : null),
  SignInButton: ({ children }: { children: ReactNode }) => <>{children}</>,
  SignUpButton: ({ children }: { children: ReactNode }) => <>{children}</>,
  UserButton: () => <button aria-label="Open user menu">User</button>,
}))

describe("marketing Header auth controls", () => {
  it("shows sign-in and sign-up actions when signed out", () => {
    clerkState.status = "signed-out"

    render(<Header />)

    expect(screen.getByRole("link", { name: "BrowserBuddy" })).toHaveAttribute(
      "href",
      "/"
    )
    expect(screen.getByRole("button", { name: "Sign in" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Sign up" })).toBeVisible()
    expect(
      screen.queryByRole("button", { name: "Open user menu" })
    ).not.toBeInTheDocument()
  })

  it("shows the user menu when signed in", () => {
    clerkState.status = "signed-in"

    render(<Header />)

    expect(screen.getByRole("button", { name: "Open user menu" })).toBeVisible()
    expect(
      screen.queryByRole("button", { name: "Sign in" })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Sign up" })
    ).not.toBeInTheDocument()
  })
})
