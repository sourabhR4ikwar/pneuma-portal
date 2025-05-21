import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { getFFPById, updateFFP, archiveFFP } from "@/lib/services/ffp-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const ffp = await getFFPById(id)

    if (!ffp) {
      return NextResponse.json({ message: "Frequent flyer program not found" }, { status: 404 })
    }

    return NextResponse.json(ffp)
  } catch (error) {
    console.error("Error getting FFP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const ffp = await getFFPById(id)

    if (!ffp) {
      return NextResponse.json({ message: "Frequent flyer program not found" }, { status: 404 })
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const assetName = formData.get("assetName") as string;
    const enabled = formData.get("enabled") === "true";

    const data = { name, assetName, enabled };

    const updatedFFP = await updateFFP(id, data);

    return NextResponse.json(updatedFFP);
  } catch (error) {
    console.error("Error updating FFP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const ffp = await getFFPById(id)

    if (!ffp) {
      return NextResponse.json({ message: "Frequent flyer program not found" }, { status: 404 })
    }

    const archivedFFP = await archiveFFP(id)

    return NextResponse.json(archivedFFP)
  } catch (error) {
    console.error("Error deleting FFP:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
