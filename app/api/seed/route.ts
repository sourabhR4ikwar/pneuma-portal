import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { creditCards, frequentFlyerPrograms } from "@/lib/db/schema"

// Seed data
const ffpSeedData = [
  { name: "Royal Orchid Plus", asset_name: "royal-orchid-plus.svg", enabled: true },
  { name: "KrisFlyer", asset_name: "krisflyer.svg", enabled: true },
  { name: "Asiana Club", asset_name: "asiana club.svg", enabled: true },
  { name: "AAdvantage", asset_name: "aadvantage.svg", enabled: true },
  { name: "Flying Blue", asset_name: "flying-blue.svg", enabled: true },
  { name: "SkyMiles", asset_name: "skymiles.svg", enabled: true },
  { name: "Enrich", asset_name: "enrich.svg", enabled: true },
  { name: "Privilege Club", asset_name: "privilege club.svg", enabled: true },
  { name: "Miles&Smiles", asset_name: "miles-and-smiles.svg", enabled: true },
  { name: "Skywards", asset_name: "skywards.svg", enabled: true },
  { name: "Asia Miles", asset_name: "asia miles.svg", enabled: true },
  { name: "Airpoints", asset_name: "airpoints.svg", enabled: true },
  { name: "Maharaja Club", asset_name: "maharaja-club.svg", enabled: true },
  { name: "TrueBlue", asset_name: "trueblue.svg", enabled: true },
  { name: "LifeMiles", asset_name: "lifemiles.svg", enabled: true },
  { name: "Aeroplan", asset_name: "aeroplan.svg", enabled: true },
  { name: "Executive Club", asset_name: "executive club.svg", enabled: true },
  { name: "Frequent Flyer", asset_name: "qantas-frequent-flyer.svg", enabled: true },
  { name: "TAP Miles&Go", asset_name: "miles-and-go.svg", enabled: true },
  { name: "AeroMexico Rewards", asset_name: "aeromexico rewards.svg", enabled: true },
]

const creditCardSeedData = [
  { name: "Air India Signature", asset_name: "state-bank-of-india.svg", enabled: true, bankName: "SBI" },
  { name: "Rewards", asset_name: "axis-bank.svg", enabled: true, bankName: "AXIS" },
  { name: "Centurion", asset_name: "american-express.svg", enabled: true, bankName: "AMEX" },
  { name: "Indulge", asset_name: "indusind-bank.svg", enabled: true, bankName: "IndusInd" },
  { name: "First Preferred credit card", asset_name: "yes-bank.svg", enabled: false, bankName: "YES" },
  { name: "ThankYou Preferred", asset_name: "citibank.svg", enabled: true, bankName: "Citibank" },
  { name: "Pride platinum", asset_name: "axis-bank.svg", enabled: false, bankName: "AXIS" },
  { name: "Platinum Plus Credit Card", asset_name: "hdfc-bank.svg", enabled: false, bankName: "HDFC" },
  { name: "Ink Business Cash", asset_name: "chase bank.svg", enabled: true, bankName: "Chase" },
  { name: "The Platinum Card", asset_name: "american express.svg", enabled: true, bankName: "AMEX" },
  { name: "Membership Rewards", asset_name: "american express.svg", enabled: true, bankName: "AMEX" },
  { name: "Etihad Guest Premier", asset_name: "state-bank-of india.svg", enabled: true, bankName: "SBI" },
  { name: "Ink Plus", asset_name: "chase bank.svg", enabled: false, bankName: "Chase" },
  { name: "Propel American Express", asset_name: "wells fargo.svg", enabled: false, bankName: "Wells Fargo" },
  { name: "Diners Club Rewardz Credit Card", asset_name: "hdfc bank.svg", enabled: false, bankName: "HDFC" },
  { name: "PRIVATE Credit Card", asset_name: "yes bank.svg", enabled: false, bankName: "YES" },
  { name: "Air India Platinum", asset_name: "state-bank-of india.svg", enabled: true, bankName: "SBI" },
  { name: "Venture X Rewards", asset_name: "capital one.svg", enabled: true, bankName: "Capital One" },
  { name: "Iconia", asset_name: "indusind bank.svg", enabled: true, bankName: "IndusInd" },
  { name: "Business Gold", asset_name: "american express.svg", enabled: true, bankName: "AMEX" },
]

export async function GET(request: NextRequest) {
  try {
    // Check if this is a development environment
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ message: "Seed endpoint is only available in development" }, { status: 403 })
    }

    // Seed FFPs
    await db.insert(frequentFlyerPrograms).values(
      ffpSeedData.map((ffp) => ({
        name: ffp.name,
        assetName: ffp.asset_name,
        enabled: ffp.enabled,
        archived: false,
      })),
    )

    // Seed Credit Cards
    await db.insert(creditCards).values(
      creditCardSeedData.map((card) => ({
        name: card.name,
        bankName: card.bankName,
        assetName: card.asset_name,
        enabled: card.enabled,
        archived: false,
      })),
    )

    return NextResponse.json({ message: "Database seeded successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ message: "Error seeding database", error: String(error) }, { status: 500 })
  }
}
