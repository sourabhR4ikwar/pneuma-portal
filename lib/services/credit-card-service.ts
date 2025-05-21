import { db } from "@/lib/db"
import { creditCards, type CreditCard, type NewCreditCard } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getFileUrl, uploadFile } from "@/lib/storage/r2"

// Get all credit cards
export async function getAllCreditCards(includeArchived = false): Promise<CreditCard[]> {
  try {
    let query = db.select().from(creditCards)

    if (!includeArchived) {
      query = query.where(eq(creditCards.archived, false))
    }

    return await query.orderBy(creditCards.name)
  } catch (error) {
    console.error("Error getting credit cards:", error)
    throw new Error("Failed to get credit cards")
  }
}

// Get a credit card by ID
export async function getCreditCardById(id: number): Promise<CreditCard | null> {
  try {
    return await db.query.creditCards.findFirst({
      where: eq(creditCards.id, id),
    })
  } catch (error) {
    console.error("Error getting credit card by ID:", error)
    throw new Error("Failed to get credit card")
  }
}

// Create a new credit card
export async function createCreditCard(data: NewCreditCard): Promise<CreditCard> {
  try {
    const [newCreditCard] = await db.insert(creditCards).values(data).returning()
    return newCreditCard
  } catch (error) {
    console.error("Error creating credit card:", error)
    throw new Error("Failed to create credit card")
  }
}

// Update a credit card
export async function updateCreditCard(id: number, data: Partial<NewCreditCard>): Promise<CreditCard> {
  try {
    const [updatedCreditCard] = await db
      .update(creditCards)
      .set({ ...data, modifiedAt: new Date() })
      .where(eq(creditCards.id, id))
      .returning()

    return updatedCreditCard
  } catch (error) {
    console.error("Error updating credit card:", error)
    throw new Error("Failed to update credit card")
  }
}

// Archive a credit card
export async function archiveCreditCard(id: number): Promise<CreditCard> {
  try {
    const [archivedCreditCard] = await db
      .update(creditCards)
      .set({ archived: true, modifiedAt: new Date() })
      .where(eq(creditCards.id, id))
      .returning()

    return archivedCreditCard
  } catch (error) {
    console.error("Error archiving credit card:", error)
    throw new Error("Failed to archive credit card")
  }
}

// Upload a credit card logo
export async function uploadCreditCardLogo(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    return await uploadFile(file, `credit-card-logos/${fileName}`, contentType)
  } catch (error) {
    console.error("Error uploading credit card logo:", error)
    throw new Error("Failed to upload logo")
  }
}

// Get credit card logo URL
export async function getCreditCardLogoUrl(assetName: string): Promise<string> {
  try {
    return await getFileUrl(`credit-card-logos/${assetName}`)
  } catch (error) {
    console.error("Error getting credit card logo URL:", error)
    throw new Error("Failed to get logo URL")
  }
}
