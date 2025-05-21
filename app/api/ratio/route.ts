import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { upsertTransferRatio } from "@/lib/services/ffp-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    if (!data.programId || !data.creditCardId || data.ratio === undefined) {
      return NextResponse.json({ message: "Program ID, credit card ID, and ratio are required" }, { status: 400 })
    }

    const ratio = await upsertTransferRatio({
      programId: data.programId,
      creditCardId: data.creditCardId,
      ratio: data.ratio,
      archived: false,
    })

    return NextResponse.json(ratio, { status: 201 })
  } catch (error) {
    console.error("Error creating/updating ratio:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
