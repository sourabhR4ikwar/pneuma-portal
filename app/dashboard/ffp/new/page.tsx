import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FFPForm } from "@/components/ffp/ffp-form"

export default async function NewFFPPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Add Frequent Flyer Program</h1>
        <FFPForm />
      </main>
    </div>
  )
}
