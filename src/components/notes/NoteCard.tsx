import { useState } from 'react'
import { notes } from '@/db/schema'
import { useRouter } from 'next/navigation'
import { MoreHorizontal, Trash, ExternalLink } from 'lucide-react'
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
import { deleteNote } from '@/app/notes/actions'
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
    'Yellow': 'bg-note-yellow',
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
    if (e) e.stopPropagation() // Prevent triggering the card click
    await deleteNote(note.id, true)
    setIsDeleteDialogOpen(false)
  }

  const requestDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLoaded && !confirmBeforeDelete) {
      handleDelete()
    } else {
      // Use setTimeout to allow the DropdownMenu to close properly 
      // before opening the Dialog, preventing Radix UI focus trap conflicts.
      setTimeout(() => {
        setIsDeleteDialogOpen(true)
      }, 10)
    }
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group border-4 border-black rounded-xl shadow-[6px_6px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex flex-col text-note-fg bg-note-default overflow-hidden h-full cursor-pointer relative"
      >
        {/* Header / Navbar */}
        <div className={`px-4 py-3 border-b-4 border-black flex justify-between items-start gap-2 ${bgColor}`}>
          <h3 className="font-bold text-lg truncate flex-1">{note.title || 'Untitled'}</h3>
          
          <div className="flex items-center gap-1 -mt-1 -mr-1">
            <span className={`text-xs font-bold opacity-70 transition-all whitespace-nowrap mt-1.5 mr-1 ${isMenuOpen ? 'hidden' : 'sm:group-hover:hidden'}`}>
              {formattedDate}
            </span>
            
            {/* Mobile Direct Delete Button */}
            <button 
              type="button"
              className="sm:hidden p-1 outline-none hover:text-red-600 transition-colors" 
              onClick={requestDelete}
              title="Delete Note"
            >
              <Trash className="w-5 h-5" />
            </button>
            
            {/* Desktop Dropdown Menu */}
            <div className={`hidden sm:block ${isMenuOpen ? 'sm:block' : 'sm:hidden sm:group-hover:block'} transition-all`} onClick={(e) => e.stopPropagation()}>
              <DropdownMenu onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger className="p-1 outline-none">
                  <MoreHorizontal className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-4 border-black rounded-xl shadow-[4px_4px_0_0_#000] bg-white text-black min-w-[150px]">
                  <DropdownMenuItem onClick={handleCardClick} className="cursor-pointer font-bold py-2 focus:bg-note-yellow focus:text-black">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Note
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={requestDelete} 
                    className="cursor-pointer font-bold py-2 text-red-600 focus:text-white focus:bg-red-500"
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete Note
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
            <DialogTitle className="font-black text-2xl uppercase">Delete Note?</DialogTitle>
            <DialogDescription className="font-medium text-note-fg/80 text-base">
              Are you sure you want to delete <strong className="text-note-fg">"{note.title || 'Untitled'}"</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-white text-black"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-red-500 text-white hover:bg-red-600"
            >
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
