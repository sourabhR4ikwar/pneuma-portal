import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

// Secret key for JWT
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_in_production")

// Session type
export type Session = {
  id: number
  email: string
}

// Create a session
export async function createSession(userId: number, email: string): Promise<string> {
  const token = await new SignJWT({ id: userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secretKey)

  cookies().set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })

  return token
}

// Get the current session
export async function getSession(): Promise<Session | null> {
  const token = cookies().get("session_token")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secretKey)
    return verified.payload as Session
  } catch (error) {
    console.error("Error verifying session token:", error)
    return null
  }
}

// Delete the session
export function deleteSession(): void {
  cookies().delete("session_token")
}
