'use client'

import { Trash } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSettings } from '@/hooks/useSettings'

export function DeleteNoteButton({
  onDelete
}: {
  onDelete: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { confirmBeforeDelete, isLoaded } = useSettings()

  const requestDelete = () => {
    if (isLoaded && !confirmBeforeDelete) {
      onDelete()
    } else {
      setIsOpen(true)
    }
  }

  const handleDelete = () => {
    setIsOpen(false)
    onDelete()
  }

  return (
    <>
      <Button
        type="button"
        size="icon"
        title="Delete Note"
        onClick={requestDelete}
        className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-red-500 text-white hover:bg-red-600"
      >
        <Trash className="w-5 h-5" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] bg-note-default text-note-fg sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-black text-2xl uppercase">Move to Trash?</DialogTitle>
            <DialogDescription className="font-medium text-note-fg/80 text-base">
              This note will be moved to the trash and will be permanently deleted after 7 days.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-4 mt-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-red-500 text-black hover:bg-red-600"
            >
              Yes, Move to Trash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
