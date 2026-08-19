'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { createNote } from '@/app/notes/actions'

export function NewNoteButton({ children }: { children: React.ReactNode }) {
  const [isElectron, setIsElectron] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent.includes('Electron')) {
      setIsElectron(true)
    }
  }, [])

  const handleNewNote = async () => {
    if (isCreating) return
    setIsCreating(true)
    try {
      const note = await createNote(false)
      window.open(`/notes/${note.id}`, '_blank')
    } catch (err) {
      console.error('Failed to create note:', err)
    } finally {
      setIsCreating(false)
    }
  }

  // In Electron: render our own button that opens a frameless window
  if (isElectron) {
    return (
      <Button
        onClick={handleNewNote}
        disabled={isCreating}
        size="icon"
        title="New Note"
        className="tour-new-note border-2 border-black font-black text-2xl uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform bg-note-yellow text-black"
      >
        +
      </Button>
    )
  }

  // On web: render the original server action form (passed as children)
  return <>{children}</>
}
