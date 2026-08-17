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

export function NoteGrid({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="border-4 border-black p-8 rounded-xl shadow-[8px_8px_0_0_#000] bg-[#FDE047] text-black text-center max-w-md mx-auto mt-10 hover:rotate-1 hover:scale-105 transition-transform cursor-default"
      >
        <h2 className="text-2xl font-black uppercase mb-4">No notes yet</h2>
        <p className="mb-6 font-medium">Your brain is empty. Let's fix that.</p>
        <p className="text-sm font-bold bg-white text-black border-2 border-black inline-block px-4 py-2 shadow-[2px_2px_0_0_#000]">Click "+" in the header to begin</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 w-full max-w-4xl mx-auto lg:mx-0"
    >
      {notes.map(note => (
        <motion.div key={note.id} variants={itemVariants} className="break-inside-avoid">
          <NoteCard note={note} />
        </motion.div>
      ))}
    </motion.div>
  )
}
