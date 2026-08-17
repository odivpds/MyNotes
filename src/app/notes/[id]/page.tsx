import { db } from '@/db'
import { notes } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteNote } from '../actions'
import { NoteEditor } from '@/components/notes/NoteEditor'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { DeleteNoteButton } from '@/components/notes/DeleteNoteButton'
import { ArrowLeft } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'

export default async function NoteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const note = await db.query.notes.findFirst({
    where: and(eq(notes.id, id), eq(notes.userId, user.id))
  })

  if (!note) return notFound()

  async function handleDelete() {
    'use server'
    await deleteNote(id, true) // soft delete
    redirect('/notes')
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-app flex flex-col font-sans transition-colors duration-300">
      <main className="flex-1 w-full flex flex-col min-h-0">
        <NoteEditor initialNote={note} onDelete={handleDelete} />
      </main>
    </div>
  )
}
