import { relations } from "drizzle-orm"
import { pgTable, serial, varchar, boolean, timestamp, decimal, integer, primaryKey } from "drizzle-orm/pg-core"

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Frequent Flyer Programs table
export const frequentFlyerPrograms = pgTable("frequent_flyer_programs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  assetName: varchar("asset_name", { length: 255 }).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  modifiedAt: timestamp("modified_at").defaultNow().notNull(),
})

// Credit Cards table
export const creditCards = pgTable("credit_cards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  bankName: varchar("bank_name", { length: 255 }).notNull(),
  assetName: varchar("asset_name", { length: 255 }).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  modifiedAt: timestamp("modified_at").defaultNow().notNull(),
})

// Transfer Ratios table
export const transferRatios = pgTable(
  "transfer_ratios",
  {
    id: serial("id").primaryKey(),
    programId: integer("program_id")
      .notNull()
      .references(() => frequentFlyerPrograms.id),
    creditCardId: integer("credit_card_id")
      .notNull()
      .references(() => creditCards.id),
    ratio: decimal("ratio", { precision: 5, scale: 2 }).notNull(),
    archived: boolean("archived").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    modifiedAt: timestamp("modified_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.programId, table.creditCardId] }),
    }
  },
)

// Define relations
export const frequentFlyerProgramsRelations = relations(frequentFlyerPrograms, ({ many }) => ({
  transferRatios: many(transferRatios),
}))

export const creditCardsRelations = relations(creditCards, ({ many }) => ({
  transferRatios: many(transferRatios),
}))

export const transferRatiosRelations = relations(transferRatios, ({ one }) => ({
  program: one(frequentFlyerPrograms, {
    fields: [transferRatios.programId],
    references: [frequentFlyerPrograms.id],
  }),
  creditCard: one(creditCards, {
    fields: [transferRatios.creditCardId],
    references: [creditCards.id],
  }),
}))

// Types
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type FrequentFlyerProgram = typeof frequentFlyerPrograms.$inferSelect
export type NewFrequentFlyerProgram = typeof frequentFlyerPrograms.$inferInsert

export type CreditCard = typeof creditCards.$inferSelect
export type NewCreditCard = typeof creditCards.$inferInsert

export type TransferRatio = typeof transferRatios.$inferSelect
export type NewTransferRatio = typeof transferRatios.$inferInsert
