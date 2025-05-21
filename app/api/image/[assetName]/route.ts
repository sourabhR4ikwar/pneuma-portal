import { type NextRequest, NextResponse } from "next/server"
import { getFileUrl } from "@/lib/storage/r2"

export async function GET(request: NextRequest, { params }: { params: { assetName: string } }) {
  try {
    const assetName = params.assetName

    if (!assetName) {
      return NextResponse.json({ message: "Asset name is required" }, { status: 400 })
    }

    // Determine if this is an FFP logo or credit card logo
    const path = assetName.includes("ffp-") ? `ffp-logos/${assetName}` : `credit-card-logos/${assetName}`

    const url = await getFileUrl(path)

    // Redirect to the signed URL
    return NextResponse.redirect(url)
  } catch (error) {
    console.error("Error getting image:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
