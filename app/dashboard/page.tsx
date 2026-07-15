import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { orgId } = await auth.protect()

  if (!orgId) {
    redirect("/choose-organization")
  }

  return (
    <h1>
      <UserButton /> <OrganizationSwitcher />
    </h1>
  )
}
