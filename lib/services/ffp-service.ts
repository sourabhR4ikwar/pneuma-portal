import { db } from "@/lib/db"
import {
  frequentFlyerPrograms,
  transferRatios,
  creditCards,
  type FrequentFlyerProgram,
  type NewFrequentFlyerProgram,
  type TransferRatio,
  type NewTransferRatio,
} from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getFileUrl, uploadFile } from "@/lib/storage/r2"

// Get all frequent flyer programs
export async function getAllFFPs(includeArchived = false): Promise<FrequentFlyerProgram[]> {
  try {
    let query = db.select().from(frequentFlyerPrograms)

    if (!includeArchived) {
      query = query.where(eq(frequentFlyerPrograms.archived, false))
    }

    return await query.orderBy(frequentFlyerPrograms.name)
  } catch (error) {
    console.error("Error getting FFPs:", error)
    throw new Error("Failed to get frequent flyer programs")
  }
}

// Get a frequent flyer program by ID
export async function getFFPById(id: number): Promise<FrequentFlyerProgram | null> {
  try {
    return await db.query.frequentFlyerPrograms.findFirst({
      where: eq(frequentFlyerPrograms.id, id),
    })
  } catch (error) {
    console.error("Error getting FFP by ID:", error)
    throw new Error("Failed to get frequent flyer program")
  }
}

// Create a new frequent flyer program
export async function createFFP(data: NewFrequentFlyerProgram): Promise<FrequentFlyerProgram> {
  try {
    const [newFFP] = await db.insert(frequentFlyerPrograms).values(data).returning()
    return newFFP
  } catch (error) {
    console.error("Error creating FFP:", error)
    throw new Error("Failed to create frequent flyer program")
  }
}

// Update a frequent flyer program
export async function updateFFP(id: number, data: Partial<NewFrequentFlyerProgram>): Promise<FrequentFlyerProgram> {
  try {
    const [updatedFFP] = await db
      .update(frequentFlyerPrograms)
      .set({ ...data, modifiedAt: new Date() })
      .where(eq(frequentFlyerPrograms.id, id))
      .returning()

    return updatedFFP
  } catch (error) {
    console.error("Error updating FFP:", error)
    throw new Error("Failed to update frequent flyer program")
  }
}

// Archive a frequent flyer program
export async function archiveFFP(id: number): Promise<FrequentFlyerProgram> {
  try {
    const [archivedFFP] = await db
      .update(frequentFlyerPrograms)
      .set({ archived: true, modifiedAt: new Date() })
      .where(eq(frequentFlyerPrograms.id, id))
      .returning()

    return archivedFFP
  } catch (error) {
    console.error("Error archiving FFP:", error)
    throw new Error("Failed to archive frequent flyer program")
  }
}

// Get transfer ratios for a frequent flyer program
export async function getTransferRatiosForFFP(programId: number): Promise<any[]> {
  try {
    return await db
      .select({
        id: transferRatios.id,
        programId: transferRatios.programId,
        creditCardId: transferRatios.creditCardId,
        ratio: transferRatios.ratio,
        archived: transferRatios.archived,
        createdAt: transferRatios.createdAt,
        modifiedAt: transferRatios.modifiedAt,
        creditCard: {
          id: creditCards.id,
          name: creditCards.name,
          bankName: creditCards.bankName,
          assetName: creditCards.assetName,
        },
      })
      .from(transferRatios)
      .innerJoin(creditCards, eq(transferRatios.creditCardId, creditCards.id))
      .where(and(eq(transferRatios.programId, programId), eq(transferRatios.archived, false)))
  } catch (error) {
    console.error("Error getting transfer ratios:", error)
    throw new Error("Failed to get transfer ratios")
  }
}

// Create or update a transfer ratio
export async function upsertTransferRatio(data: NewTransferRatio): Promise<TransferRatio> {
  try {
    // Check if the ratio already exists
    const existingRatio = await db.query.transferRatios.findFirst({
      where: and(eq(transferRatios.programId, data.programId), eq(transferRatios.creditCardId, data.creditCardId)),
    })

    if (existingRatio) {
      // Update existing ratio
      const [updatedRatio] = await db
        .update(transferRatios)
        .set({
          ratio: data.ratio,
          archived: data.archived !== undefined ? data.archived : existingRatio.archived,
          modifiedAt: new Date(),
        })
        .where(eq(transferRatios.id, existingRatio.id))
        .returning()

      return updatedRatio
    } else {
      // Create new ratio
      const [newRatio] = await db.insert(transferRatios).values(data).returning()

      return newRatio
    }
  } catch (error) {
    console.error("Error upserting transfer ratio:", error)
    throw new Error("Failed to create or update transfer ratio")
  }
}

// Upload an FFP logo
export async function uploadFFPLogo(file: Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    return await uploadFile(file, `ffp-logos/${fileName}`, contentType)
  } catch (error) {
    console.error("Error uploading FFP logo:", error)
    throw new Error("Failed to upload logo")
  }
}

// Get FFP logo URL
export async function getFFPLogoUrl(assetName: string): Promise<string> {
  try {
    return await getFileUrl(`ffp-logos/${assetName}`)
  } catch (error) {
    console.error("Error getting FFP logo URL:", error)
    throw new Error("Failed to get logo URL")
  }
}
