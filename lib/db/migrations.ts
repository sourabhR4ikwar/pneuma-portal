import { migrate } from "drizzle-orm/neon-http/migrator"
import { db } from "./index"

// This function will run the migrations
export async function runMigrations() {
  console.log("Running migrations...")

  try {
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations completed successfully")
  } catch (error) {
    console.error("Error running migrations:", error)
    throw error
  }
}
