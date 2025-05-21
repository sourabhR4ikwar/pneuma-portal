import { type NextRequest, NextResponse } from "next/server"
import { register } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const result = await register(email, password)

    if (result.success) {
      return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
    } else {
      return NextResponse.json({ message: result.message }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in register route:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
