import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import ThemeToggle from "../theme-toggle"

const Header = () => {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold">
          BrowserBuddy
        </Link>
        <nav aria-label="Authentication" className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="outline">Sign in</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default">Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "default" })}
            >
              Dashboard
            </Link>
          </Show>
        </nav>
      </div>
    </header>
  )
}

export default Header
