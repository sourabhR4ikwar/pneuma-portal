"use client"

import type { FrequentFlyerProgram } from "@/lib/db/schema"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteFFPDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ffp: FrequentFlyerProgram | null
  onConfirm: () => void
}

export function DeleteFFPDialog({ open, onOpenChange, ffp, onConfirm }: DeleteFFPDialogProps) {
  if (!ffp) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the frequent flyer program &quot;{ffp.name}&quot; and all associated transfer
            ratios. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
