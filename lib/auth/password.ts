import { hash, compare } from "bcrypt"

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

// Verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}
