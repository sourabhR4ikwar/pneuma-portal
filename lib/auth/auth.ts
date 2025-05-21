import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { hashPassword, verifyPassword } from "./password"
import { createSession, deleteSession } from "./session"

// Register a new user
export async function register(email: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      return { success: false, message: "User already exists" }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
      })
      .returning()

    return { success: true, message: "User registered successfully" }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, message: "Failed to register user" }
  }
}

// Login a user
export async function login(email: string, password: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find the user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password" }
    }

    // Create a session
    await createSession(user.id, user.email)

    return { success: true, message: "Login successful" }
  } catch (error) {
    console.error("Error logging in:", error)
    return { success: false, message: "Failed to login" }
  }
}

// Logout a user
export async function logout(): Promise<{ success: boolean; message: string }> {
  try {
    deleteSession()
    return { success: true, message: "Logout successful" }
  } catch (error) {
    console.error("Error logging out:", error)
    return { success: false, message: "Failed to logout" }
  }
}
