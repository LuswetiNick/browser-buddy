import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main
      aria-label="Sign in"
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center"
    >
      <SignIn />
    </main>
  )
}
