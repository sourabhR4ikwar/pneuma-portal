import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { createFFP } from "@/lib/services/ffp-service"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get("name") as string
    const assetName = formData.get("assetName") as string
    const enabled = formData.get("enabled") === "true"

    if (!name || !assetName) {
      return NextResponse.json({ message: "Name and asset name are required" }, { status: 400 })
    }

    const newFFP = await createFFP({
      name,
      assetName,
      enabled,
      archived: false,
    })

    return NextResponse.json(newFFP, { status: 201 })
  } catch (error) {
    console.error("Error creating FFP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
