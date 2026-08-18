import { AppTitle } from '@/components/AppTitle'
import { OnboardingTour } from '@/components/OnboardingTour'
import { getNotes, createNote } from './actions'
import { Button } from '@/components/ui/button'
import { NoteGrid } from '@/components/notes/NoteGrid'
import { NotesLayout } from '@/components/notes/NotesLayout'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { SettingsDialog } from '@/components/SettingsDialog'
import { MotivationalQuote } from '@/components/MotivationalQuote'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ tab?: string, q?: string, new?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { tab = 'active', q = '', new: createNew } = await searchParams

  if (createNew === 'true') {
    const note = await createNote()
    redirect(`/notes/${note.id}`)
  }

  const allNotes = await getNotes()
  const userName = user.email?.split('@')[0] || 'User'

  // Filter notes based on tab
  let filteredNotes = allNotes
  if (tab === 'archive') {
    filteredNotes = allNotes.filter(n => n.isArchived && !n.isDeleted)
  } else if (tab === 'trash') {
    filteredNotes = allNotes.filter(n => n.isDeleted)
  } else {
    // Default: Active notes
    filteredNotes = allNotes.filter(n => !n.isDeleted && !n.isArchived)
  }

  // Filter by search query if any
  if (q.trim()) {
    const query = q.toLowerCase()
    filteredNotes = filteredNotes.filter(n => 
      (n.title && n.title.toLowerCase().includes(query)) || 
      (n.content && JSON.stringify(n.content).toLowerCase().includes(query))
    )
  }

  const isReturningUser = allNotes.length > 0 || (Date.now() - new Date(user.created_at).getTime() > 1000 * 60 * 5)

  async function handleCreateNote() {
    'use server'
    const note = await createNote()
    redirect(`/notes/${note.id}`)
  }

  return (
    <div className="h-screen bg-app text-foreground flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      <header className="border-b-4 border-black px-6 md:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 bg-header sticky top-0 z-20 transition-colors duration-300">
        <div className="tour-title">
          <AppTitle defaultName={userName} />
        </div>
        <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto justify-center sm:justify-end">
          <div className="tour-settings">
            <SettingsDialog />
          </div>
          <div className="tour-theme">
            <ThemeSwitcher />
          </div>
          <form action={handleCreateNote}>
            <Button type="submit" size="icon" title="New Note" className="tour-new-note border-2 border-black font-black text-2xl uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform bg-note-yellow text-black">
              +
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 flex flex-col sm:flex-row overflow-hidden relative">
        <NotesLayout currentTab={tab} currentQuery={q}>
          <NoteGrid notes={filteredNotes} tab={tab} />
        </NotesLayout>
        
        {/* Right Hero / Motivation */}
        <div className="hidden sm:flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 relative">
          <MotivationalQuote userName={userName} />
        </div>
        <OnboardingTour userName={userName} isReturningUser={isReturningUser} />
      </main>
    </div>
  )
}
