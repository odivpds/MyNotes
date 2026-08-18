'use client'

import { NoteCard } from './NoteCard'
import { notes } from '@/db/schema'
import { motion, Variants } from 'framer-motion'

type Note = typeof notes.$inferSelect

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
}

// Helper function to group notes by time
function groupNotesByTime(notes: Note[]): { label: string; notes: Note[] }[] {
  const groups: { label: string; notes: Note[] }[] = []
  
  notes.forEach(note => {
    const date = new Date(note.updatedAt)
    const now = new Date()
    
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const noteDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    const diffTime = today.getTime() - noteDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    let label = ''
    
    if (diffDays <= 0) {
      label = 'Today'
    } else if (diffDays === 1) {
      label = 'Yesterday'
    } else if (diffDays <= 7) {
      label = 'Previous 7 Days'
    } else if (diffDays <= 30) {
      label = 'Previous 30 Days'
    } else if (now.getFullYear() === date.getFullYear()) {
      label = date.toLocaleDateString('en-US', { month: 'long' })
    } else {
      label = date.getFullYear().toString()
    }
    
    if (groups.length > 0 && groups[groups.length - 1].label === label) {
      groups[groups.length - 1].notes.push(note)
    } else {
      groups.push({ label, notes: [note] })
    }
  })
  
  return groups
}

export function NoteGrid({ notes, tab = 'active' }: { notes: Note[], tab?: string }) {
  const isArchive = tab === 'archive'
  const isTrash = tab === 'trash'

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="border-4 border-black p-8 rounded-xl shadow-[8px_8px_0_0_#000] bg-[#FDE047] text-black text-center max-w-md mx-auto mt-10 hover:rotate-1 hover:scale-105 transition-transform cursor-default"
      >
        <h2 className="text-2xl font-black uppercase mb-4">
          {isTrash ? "Trash is empty" : isArchive ? "Archive is empty" : "No notes yet"}
        </h2>
        <p className="mb-6 font-medium">
          {isTrash ? "Nothing here. So clean!" : isArchive ? "Nothing tucked away yet." : "Your brain is empty. Let's fix that."}
        </p>
        {!isTrash && !isArchive && (
          <p className="text-sm font-bold bg-white text-black border-2 border-black inline-block px-4 py-2 shadow-[2px_2px_0_0_#000]">Click "+" in the header to begin</p>
        )}
      </motion.div>
    )
  }

  const pinnedNotes = tab === 'active' ? notes.filter(n => n.isPinned) : []
  const unpinnedNotes = tab === 'active' ? notes.filter(n => !n.isPinned) : notes
  
  const groupedUnpinnedNotes = groupNotesByTime(unpinnedNotes)

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto lg:mx-0">
      {pinnedNotes.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="font-black text-sm uppercase tracking-widest opacity-70 border-b-4 border-black pb-1 inline-block w-max">Pinned</h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {pinnedNotes.map(note => (
              <motion.div key={note.id} variants={itemVariants} className="break-inside-avoid">
                <NoteCard note={note} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {groupedUnpinnedNotes.map((group) => (
          <div key={group.label} className="flex flex-col gap-4">
            <h3 className="font-black text-sm uppercase tracking-widest opacity-70 border-b-4 border-black pb-1 inline-block w-max">
              {group.label}
            </h3>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-4"
            >
              {group.notes.map(note => (
                <motion.div key={note.id} variants={itemVariants} className="break-inside-avoid">
                  <NoteCard note={note} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  )
}
