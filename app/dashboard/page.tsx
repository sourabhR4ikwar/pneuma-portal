import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getAllFFPs } from "@/lib/services/ffp-service"
import { FrequentFlyerProgramsTable } from "@/components/ffp/ffp-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const ffps = await getAllFFPs()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="pneuma-card p-8 mb-8">
          <h1 className="text-3xl font-bold text-pneuma-800 mb-2">Frequent Flyer Programs</h1>
          <p className="text-pneuma-600 mb-6">
            Manage your frequent flyer programs and their transfer ratios with credit card partners.
          </p>
          <Button asChild className="pneuma-button">
            <a href="/dashboard/ffp/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Program
            </a>
          </Button>
        </div>
        <div className="pneuma-card p-6">
          <FrequentFlyerProgramsTable ffps={ffps} />
        </div>
      </main>
    </div>
  )
}
