import { useState } from 'react'
import { notes } from '@/db/schema'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Trash, ExternalLink, Pin, Archive, Undo2, PinOff } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { deleteNote, updateNote } from '@/app/notes/actions'
import { useSettings } from '@/hooks/useSettings'

type Note = typeof notes.$inferSelect

function extractTextFromTiptap(json: any): string {
  if (!json) return '';
  if (typeof json === 'string') return json;
  if (json.type === 'text') return json.text || '';

  let text = '';
  if (json.content && Array.isArray(json.content)) {
    text = json.content.map(extractTextFromTiptap).join('');
  }

  if (['paragraph', 'heading', 'listItem'].includes(json.type)) {
    text += ' ';
  }

  return text;
}

export function NoteCard({ note }: { note: Note }) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { confirmBeforeDelete, isLoaded } = useSettings()

  const colorMap: Record<string, string> = {
    'Default': 'bg-note-default',
    'Yellow': 'bg-note-yellow text-black',
    'Pink': 'bg-note-pink',
    'Blue': 'bg-note-blue',
    'Green': 'bg-note-green',
    'Purple': 'bg-note-purple',
    'Orange': 'bg-note-orange',
    'Red': 'bg-note-red',
    'Mint': 'bg-note-mint',
    'Gray': 'bg-note-gray'
  }

  const bgColor = colorMap[note.color || 'Default'] || colorMap['Default']

  const plainText = extractTextFromTiptap(note.content).trim();
  const words = plainText.split(/\s+/);
  const truncatedText = words.length > 500 ? words.slice(0, 500).join(' ') + '...' : plainText;
  const displayContent = truncatedText || 'Empty note';

  // Format date like "29 Jul, 01:56"
  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(note.updatedAt))

  const handleCardClick = () => {
    router.push(`/notes/${note.id}`)
  }

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    // If it's already in trash, delete forever
    await deleteNote(note.id, !note.isDeleted)
    setIsDeleteDialogOpen(false)
  }

  const requestDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoaded && !confirmBeforeDelete && !note.isDeleted) {
      handleDelete()
    } else {
      setTimeout(() => {
        setIsDeleteDialogOpen(true)
      }, 10)
    }
  }

  const handleTogglePin = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    await updateNote(note.id, { isPinned: !note.isPinned })
  }

  const handleToggleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    await updateNote(note.id, { isArchived: !note.isArchived })
  }

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMenuOpen(false)
    await updateNote(note.id, { isDeleted: false })
  }

  return (
    <>
      <div
        onClick={note.isDeleted ? undefined : handleCardClick}
        className={`group border-4 border-black rounded-xl shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex flex-col text-note-fg bg-note-default overflow-hidden h-full relative ${note.isDeleted ? 'opacity-80 grayscale-[50%] cursor-default' : 'cursor-pointer'
          }`}
      >
        {/* Header / Navbar */}
        <div className={`px-4 py-3 border-b-4 border-black flex justify-between items-start gap-2 ${bgColor}`}>
          <div className="flex-1 flex items-center gap-2 truncate">
            {note.isPinned && !note.isDeleted && !note.isArchived && (
              <Pin className="w-4 h-4 fill-current shrink-0 rotate-45" />
            )}
            <h3 className="font-bold text-lg truncate flex-1">{note.title || 'Untitled'}</h3>
          </div>

          <div className="flex items-center gap-1 -mt-1 -mr-1">
            <span className={`text-xs font-bold opacity-70 transition-all whitespace-nowrap mt-1.5 mr-1 ${isMenuOpen ? 'hidden' : 'sm:group-hover:hidden'}`}>
              {formattedDate}
            </span>

            {/* Dropdown Menu (Always visible on mobile, visible on hover/open on desktop) */}
            <div className={`block sm:hidden sm:group-hover:block ${isMenuOpen ? 'sm:!block' : ''} transition-all`} onClick={(e) => e.stopPropagation()}>
              <DropdownMenu onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger className="p-1 outline-none">
                  <MoreHorizontal className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-4 border-black rounded-xl shadow-[4px_4px_0_0_#000] bg-white text-black min-w-[150px]">
                  {!note.isDeleted && (
                    <DropdownMenuItem onClick={handleCardClick} className="cursor-pointer font-bold py-2 focus:bg-note-gray focus:text-note-fg">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Note
                    </DropdownMenuItem>
                  )}

                  {!note.isDeleted && !note.isArchived && (
                    <DropdownMenuItem onClick={handleTogglePin} className="cursor-pointer font-bold py-2 focus:bg-note-gray focus:text-note-fg">
                      {note.isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                      {note.isPinned ? 'Unpin Note' : 'Pin Note'}
                    </DropdownMenuItem>
                  )}

                  {!note.isDeleted && (
                    <DropdownMenuItem onClick={handleToggleArchive} className="cursor-pointer font-bold py-2 focus:bg-note-gray focus:text-note-fg">
                      <Archive className="w-4 h-4 mr-2" />
                      {note.isArchived ? 'Unarchive' : 'Archive Note'}
                    </DropdownMenuItem>
                  )}

                  {note.isDeleted && (
                    <DropdownMenuItem onClick={handleRestore} className="cursor-pointer font-bold py-2 text-green-600 focus:text-white focus:bg-green-600">
                      <Undo2 className="w-4 h-4 mr-2" />
                      Restore Note
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={requestDelete}
                    className="cursor-pointer font-bold py-2 text-red-600 focus:text-white focus:bg-red-500"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {note.isDeleted ? 'Delete 4ever' : 'Trash Note'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* Body / Content */}
        <div className="p-4 flex-1 text-sm whitespace-pre-wrap bg-note-default break-words">
          <div className="line-clamp-[10]">
            {displayContent}
          </div>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] bg-note-default text-note-fg sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="font-black text-2xl uppercase">
              {note.isDeleted ? 'Delete 4ever?' : 'Trash Note?'}
            </DialogTitle>
            <DialogDescription className="font-medium text-note-fg/80 text-base">
              {note.isDeleted
                ? <>Are you sure you want to permanently delete <strong className="text-note-fg">"{note.title || 'Untitled'}"</strong>? This cannot be undone.</>
                : <>Move <strong className="text-note-fg">"{note.title || 'Untitled'}"</strong> to Trash?</>
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-4 mt-4">
            <Button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-red-500 text-black hover:bg-red-600"
            >
              {note.isDeleted ? 'Delete 4ever' : 'Yes, Trash It'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
