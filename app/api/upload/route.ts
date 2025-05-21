import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { uploadFile } from "@/lib/storage/r2"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string

    if (!file || !type) {
      return NextResponse.json({ message: "File and type are required" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${type}-${Date.now()}-${file.name}`
    const path = type === "ffp" ? `ffp-logos/${fileName}` : `credit-card-logos/${fileName}`

    await uploadFile(buffer, path, file.type)

    return NextResponse.json({ fileName }, { status: 201 })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
