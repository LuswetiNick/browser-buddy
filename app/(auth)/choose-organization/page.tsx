import { TaskChooseOrganization } from "@clerk/nextjs"

export default function ChooseOrganizationPage() {
  return (
    <main
      aria-label="Choose organization"
      className="flex min-h-screen items-center justify-center px-4 py-12"
    >
      <TaskChooseOrganization redirectUrlComplete="/dashboard" />
    </main>
  )
}
