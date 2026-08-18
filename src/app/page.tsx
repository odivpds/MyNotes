import { redirect } from 'next/navigation'
import { getNotes } from '@/app/notes/actions'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const allNotes = await getNotes()
  const activeNotes = allNotes.filter(n => !n.isDeleted && !n.isArchived)
  
  if (activeNotes.length > 0) {
    // Open the most recently updated active note
    redirect(`/notes/${activeNotes[0].id}`)
  } else {
    // No active notes, open a new one
    redirect('/notes?new=true')
  }
}
