'use server'

import { db } from '@/db'
import { notes } from '@/db/schema'
import { eq, desc, and, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

async function getUserId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}

export async function getNotes() {
  const userId = await getUserId()
  const userNotes = await db.query.notes.findMany({
    where: eq(notes.userId, userId),
    orderBy: [desc(notes.updatedAt)],
  })

  return userNotes
}

export async function createNote(shouldRevalidate = true) {
  const userId = await getUserId()
  const [newNote] = await db.insert(notes).values({
    userId,
    title: '',
    content: null,
    color: 'Yellow',
  }).returning()

  if (shouldRevalidate) {
    revalidatePath('/notes')
  }
  return newNote
}

export async function updateNote(id: string, data: Partial<typeof notes.$inferInsert>) {
  const userId = await getUserId()
  await db.update(notes)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)))

  revalidatePath('/notes')
}

export async function deleteNote(id: string, softDelete = true) {
  const userId = await getUserId()
  if (softDelete) {
    await db.update(notes)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
  } else {
    await db.delete(notes)
      .where(and(eq(notes.id, id), eq(notes.userId, userId)))
  }

  revalidatePath('/notes')
}

export async function deleteNotesBulk(ids: string[], softDelete = true) {
  if (ids.length === 0) return;
  const userId = await getUserId()
  if (softDelete) {
    await db.update(notes)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(and(inArray(notes.id, ids), eq(notes.userId, userId)))
  } else {
    await db.delete(notes)
      .where(and(inArray(notes.id, ids), eq(notes.userId, userId)))
  }

  revalidatePath('/notes')
}
