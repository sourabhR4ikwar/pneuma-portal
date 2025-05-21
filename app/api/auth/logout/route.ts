import { type NextRequest, NextResponse } from "next/server"
import { logout } from "@/lib/auth/auth"

export async function POST(request: NextRequest) {
  try {
    const result = await logout()

    // Set the response with a cleared cookie
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

    // Ensure the cookie is cleared in the response
    response.cookies.delete("session_token")

    return response
  } catch (error) {
    console.error("Error in logout route:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
