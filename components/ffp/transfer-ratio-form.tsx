"use client"

import type React from "react"

import { useState } from "react"
import type { CreditCard } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface TransferRatioFormProps {
  creditCards: CreditCard[]
  onSubmit: (creditCardId: number, ratio: number) => void
}

export function TransferRatioForm({ creditCards, onSubmit }: TransferRatioFormProps) {
  const [creditCardId, setCreditCardId] = useState<string>("")
  const [ratio, setRatio] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit(Number.parseInt(creditCardId), Number.parseFloat(ratio))
      setCreditCardId("")
      setRatio("")
    } catch (error) {
      console.error("Error adding transfer ratio:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium text-pneuma-800">Add Transfer Ratio</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="creditCard" className="text-pneuma-700">
            Credit Card
          </Label>
          <Select value={creditCardId} onValueChange={setCreditCardId} required>
            <SelectTrigger id="creditCard" className="pneuma-input">
              <SelectValue placeholder="Select a credit card" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-pneuma-100">
              {creditCards.map((card) => (
                <SelectItem key={card.id} value={card.id.toString()}>
                  {card.name} ({card.bankName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ratio" className="text-pneuma-700">
            Ratio
          </Label>
          <Input
            id="ratio"
            type="number"
            step="0.01"
            min="0.01"
            max="5"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            required
            className="pneuma-input"
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" disabled={isLoading || !creditCardId || !ratio} className="pneuma-button">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? "Adding..." : "Add Ratio"}
          </Button>
        </div>
      </div>
    </form>
  )
}
