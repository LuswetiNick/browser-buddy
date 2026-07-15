import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <main
      aria-label="Sign up"
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center"
    >
      <SignUp />
    </main>
  )
}
