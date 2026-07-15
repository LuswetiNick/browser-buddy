import { auth } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  await auth.protect()
  return <h1>Dashboard</h1>
}
