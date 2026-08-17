// Removed logout import
import { getNotes, createNote } from './actions'
import { Button } from '@/components/ui/button'
import { NoteGrid } from '@/components/notes/NoteGrid'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { SettingsDialog } from '@/components/SettingsDialog'
import { MotivationalQuote } from '@/components/MotivationalQuote'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const notes = await getNotes()

  const activeNotes = notes.filter(n => !n.isDeleted && !n.isArchived)

  async function handleCreateNote() {
    'use server'
    const note = await createNote()
    redirect(`/notes/${note.id}`)
  }

  return (
    <div className="h-screen bg-app text-foreground flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      <header className="border-b-4 border-black px-6 md:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 bg-header sticky top-0 z-10 transition-colors duration-300">
        <h1 className="text-2xl md:text-3xl font-pixel uppercase tracking-widest text-white [text-shadow:4px_4px_0_#000] mt-1 text-center sm:text-left">My Notes</h1>
        <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-center sm:justify-end">
          <SettingsDialog />
          <ThemeSwitcher />
          <form action={handleCreateNote}>
            <Button type="submit" size="icon" title="New Note" className="border-2 border-black font-black text-2xl uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform bg-note-yellow text-black">
              +
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-[380px] lg:w-[450px] xl:w-[600px] overflow-y-auto p-4 md:p-6 lg:p-10 mx-auto md:mx-0">
          <NoteGrid notes={activeNotes} />
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center p-6 lg:p-10 relative">
          <MotivationalQuote userName={user.email?.split('@')[0] || 'User'} />
        </div>
      </main>
    </div>
  )
}
