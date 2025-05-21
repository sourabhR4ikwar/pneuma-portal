import { type NextRequest, NextResponse } from "next/server"
import { login } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const result = await login(email, password)

    if (result.success) {
      return NextResponse.json({ message: "Login successful" }, { status: 200 })
    } else {
      return NextResponse.json({ message: result.message }, { status: 401 })
    }
  } catch (error) {
    console.error("Error in login route:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
