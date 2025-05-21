"use client"

import { useState } from "react"
import Link from "next/link"
import type { FrequentFlyerProgram } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, Trash2, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { DeleteFFPDialog } from "./delete-ffp-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FrequentFlyerProgramsTableProps {
  ffps: FrequentFlyerProgram[]
}

export function FrequentFlyerProgramsTable({ ffps: initialFFPs }: FrequentFlyerProgramsTableProps) {
  const [ffps, setFFPs] = useState<FrequentFlyerProgram[]>(initialFFPs)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedFFP, setSelectedFFP] = useState<FrequentFlyerProgram | null>(null)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Calculate pagination values
  const totalItems = ffps.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const currentItems = ffps.slice(startIndex, endIndex)

  const handleToggleEnabled = async (id: number, currentEnabled: boolean) => {
    try {
      const response = await fetch(`/api/ffp/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled: !currentEnabled }),
      })

      if (response.ok) {
        setFFPs(ffps.map((ffp) => (ffp.id === id ? { ...ffp, enabled: !currentEnabled } : ffp)))
      }
    } catch (error) {
      console.error("Error toggling FFP status:", error)
    }
  }

  const handleDeleteClick = (ffp: FrequentFlyerProgram) => {
    setSelectedFFP(ffp)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedFFP) return

    try {
      const response = await fetch(`/api/ffp/${selectedFFP.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setFFPs(ffps.filter((ffp) => ffp.id !== selectedFFP.id))

        // Adjust current page if we deleted the last item on the page
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      }
    } catch (error) {
      console.error("Error deleting FFP:", error)
    } finally {
      setDeleteDialogOpen(false)
      setSelectedFFP(null)
    }
  }

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)
  const goToLastPage = () => goToPage(totalPages)

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = Number.parseInt(value)
    setItemsPerPage(newItemsPerPage)

    // Adjust current page to keep items in view
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage)
    if (currentPage > newTotalPages) {
      setCurrentPage(Math.max(1, newTotalPages))
    }
  }

  return (
    <>
      <div className="rounded-xl overflow-hidden bg-white/90 shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-pneuma-50 hover:bg-pneuma-50/80">
              <TableHead className="font-semibold text-pneuma-700">Logo</TableHead>
              <TableHead className="font-semibold text-pneuma-700">Name</TableHead>
              <TableHead className="font-semibold text-pneuma-700">Enabled</TableHead>
              <TableHead className="font-semibold text-pneuma-700">Created</TableHead>
              <TableHead className="font-semibold text-pneuma-700">Modified</TableHead>
              <TableHead className="text-right font-semibold text-pneuma-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalItems === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-pneuma-500">
                  No frequent flyer programs found
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((ffp) => (
                <TableRow key={ffp.id} className="hover:bg-pneuma-50/50">
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-white shadow-sm border border-pneuma-100 p-1">
                      <img
                        src={`/api/image/${ffp.assetName}`}
                        alt={`${ffp.name} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-pneuma-800">{ffp.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={ffp.enabled}
                      onCheckedChange={() => handleToggleEnabled(ffp.id, ffp.enabled)}
                      className="data-[state=checked]:bg-pneuma-500"
                    />
                  </TableCell>
                  <TableCell className="text-pneuma-600">{formatDate(ffp.createdAt)}</TableCell>
                  <TableCell className="text-pneuma-600">{formatDate(ffp.modifiedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-pneuma-600 hover:text-pneuma-800 hover:bg-pneuma-50"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="pneuma-card border-pneuma-100">
                        <DropdownMenuItem asChild className="text-pneuma-700 focus:text-pneuma-800 focus:bg-pneuma-50">
                          <Link href={`/dashboard/ffp/${ffp.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 focus:text-red-600 focus:bg-red-50"
                          onClick={() => handleDeleteClick(ffp)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-pneuma-700">
          <div className="flex items-center space-x-2">
            <span>Rows per page:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <span className="mr-4">
              {startIndex + 1}-{endIndex} of {totalItems}
            </span>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="sr-only">First page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>
              <span className="px-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
                <span className="sr-only">Last page</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      <DeleteFFPDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        ffp={selectedFFP}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
