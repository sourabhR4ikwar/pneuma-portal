"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { FrequentFlyerProgram, CreditCard } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Upload, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TransferRatioForm } from "./transfer-ratio-form"

interface FFPFormProps {
  ffp?: FrequentFlyerProgram
  transferRatios?: any[]
  creditCards?: CreditCard[]
}

export function FFPForm({ ffp, transferRatios = [], creditCards = [] }: FFPFormProps) {
  const router = useRouter()
  const [name, setName] = useState(ffp?.name || "")
  const [enabled, setEnabled] = useState(ffp?.enabled || true)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(ffp ? `/api/image/${ffp.assetName}` : null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [localTransferRatios, setLocalTransferRatios] = useState(transferRatios)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let assetName = ffp?.assetName || ""

      // Upload file if a new one is selected
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", "ffp")

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (uploadResponse.ok) {
          const { fileName } = await uploadResponse.json()
          assetName = fileName
        } else {
          throw new Error("Failed to upload logo")
        }
      }

      // Create or update the FFP
      const method = ffp ? "PATCH" : "POST"
      const url = ffp ? `/api/ffp/${ffp.id}` : "/api/ffp"

      const formData = new FormData()
      formData.append("name", name)
      formData.append("assetName", assetName)
      formData.append("enabled", enabled.toString())

      const response = await fetch(url, {
        method,
        body: formData,
      })

      if (response.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.message || "Failed to save frequent flyer program")
      }
    } catch (err) {
      setError("An error occurred while saving")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddRatio = async (creditCardId: number, ratio: number) => {
    try {
      if (!ffp) return

      const response = await fetch("/api/ratio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId: ffp.id,
          creditCardId,
          ratio,
        }),
      })

      if (response.ok) {
        const newRatio = await response.json()

        // Find the credit card to add to the local state
        const creditCard = creditCards.find((cc) => cc.id === creditCardId)

        if (creditCard) {
          setLocalTransferRatios([
            ...localTransferRatios,
            {
              ...newRatio,
              creditCard: {
                id: creditCard.id,
                name: creditCard.name,
                bankName: creditCard.bankName,
                assetName: creditCard.assetName,
              },
            },
          ])
        }
      }
    } catch (error) {
      console.error("Error adding transfer ratio:", error)
    }
  }

  const handleDeleteRatio = async (ratioId: number) => {
    try {
      if (!ffp) return

      const response = await fetch(`/api/ratio/${ratioId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLocalTransferRatios(localTransferRatios.filter((ratio) => ratio.id !== ratioId))
      }
    } catch (error) {
      console.error("Error deleting transfer ratio:", error)
    }
  }

  // Filter out credit cards that already have a ratio
  const availableCreditCards = creditCards.filter((cc) => !localTransferRatios.some((tr) => tr.creditCardId === cc.id))

  return (
    <Card className="pneuma-card border-white/50">
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-pneuma-50 p-1 rounded-full">
            <TabsTrigger
              value="details"
              className="rounded-full data-[state=active]:bg-white data-[state=active]:text-pneuma-700 data-[state=active]:shadow-sm"
            >
              Program Details
            </TabsTrigger>
            {ffp && (
              <TabsTrigger
                value="ratios"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-pneuma-700 data-[state=active]:shadow-sm"
              >
                Transfer Ratios
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-pneuma-700">
                  Program Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pneuma-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-pneuma-700">
                  Program Logo
                </Label>
                <div className="flex items-center gap-4">
                  {previewUrl && (
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-white shadow-sm border border-pneuma-100 p-1">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Logo preview"
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Label
                      htmlFor="logo-upload"
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-pneuma-100 bg-white/90 p-4 hover:bg-pneuma-50 transition-colors"
                    >
                      <Upload className="h-4 w-4 text-pneuma-500" />
                      <span className="text-pneuma-700">Upload logo</span>
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                  className="data-[state=checked]:bg-pneuma-500"
                />
                <Label htmlFor="enabled" className="text-pneuma-700">
                  Enabled
                </Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="border-pneuma-200 text-pneuma-700 hover:bg-pneuma-50 hover:text-pneuma-800"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="pneuma-button">
                  {isLoading ? "Saving..." : ffp ? "Update Program" : "Create Program"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="ratios">
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden bg-white/90 shadow border border-pneuma-50">
                <table className="w-full">
                  <thead>
                    <tr className="bg-pneuma-50">
                      <th className="px-4 py-3 text-left font-medium text-pneuma-700">Credit Card</th>
                      <th className="px-4 py-3 text-left font-medium text-pneuma-700">Bank</th>
                      <th className="px-4 py-3 text-left font-medium text-pneuma-700">Ratio</th>
                      <th className="px-4 py-3 text-right font-medium text-pneuma-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localTransferRatios.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-pneuma-500">
                          No transfer ratios found
                        </td>
                      </tr>
                    ) : (
                      localTransferRatios.map((ratio) => (
                        <tr key={ratio.id} className="border-t border-pneuma-50">
                          <td className="px-4 py-3 text-pneuma-700">{ratio.creditCard.name}</td>
                          <td className="px-4 py-3 text-pneuma-600">{ratio.creditCard.bankName}</td>
                          <td className="px-4 py-3 text-pneuma-700 font-medium">{ratio.ratio}</td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRatio(ratio.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {availableCreditCards.length > 0 && (
                <div className="bg-white/90 rounded-xl p-6 border border-pneuma-50 shadow">
                  <TransferRatioForm creditCards={availableCreditCards} onSubmit={handleAddRatio} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
