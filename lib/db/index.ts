import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

// Check if the DATABASE_URL environment variable is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not defined")
}

// Create a Neon connection
const sql = neon(process.env.DATABASE_URL)

// Create a Drizzle instance
export const db = drizzle(sql, { schema })
