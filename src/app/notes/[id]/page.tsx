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
    <div className="min-h-screen bg-app flex flex-col font-sans transition-colors duration-300">
      <header className="border-b-4 border-black p-3 sm:p-4 flex items-center justify-between bg-header sticky top-0 z-10 transition-colors duration-300">

        <div className="flex items-center">
          <Link href="/notes">
            <Button
              variant="outline"
              size="icon"
              title="Back"
              className="border-2 border-black font-bold shadow-[3px_3px_0_0_#000] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all bg-note-default text-note-fg hover:brightness-95 h-10 w-10 sm:h-11 sm:w-11"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <DeleteNoteButton onDelete={handleDelete} />

          <div className="w-[2px] h-6 bg-black/10 dark:bg-white/10 hidden sm:block" />

          <ThemeSwitcher />
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
        <NoteEditor initialNote={note} />
      </main>
    </div>
  )
}
