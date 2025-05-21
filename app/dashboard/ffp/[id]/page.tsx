import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getFFPById, getTransferRatiosForFFP } from "@/lib/services/ffp-service"
import { getAllCreditCards } from "@/lib/services/credit-card-service"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FFPForm } from "@/components/ffp/ffp-form"

export default async function EditFFPPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const id = Number.parseInt(params.id)
  const ffp = await getFFPById(id)

  if (!ffp) {
    redirect("/dashboard")
  }

  const transferRatios = await getTransferRatiosForFFP(id)
  const creditCards = await getAllCreditCards()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Frequent Flyer Program</h1>
        <FFPForm ffp={ffp} transferRatios={transferRatios} creditCards={creditCards} />
      </main>
    </div>
  )
}
