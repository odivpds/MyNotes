'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { NoteToolbar } from './NoteToolbar'
import { useEffect, useState, useCallback, useRef } from 'react'
import debounce from 'lodash.debounce'
import { updateNote } from '@/app/notes/actions'
import { Palette, ArrowLeft, PenTool, X, Pin, PinOff, Archive, ArchiveRestore } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import { DeleteNoteButton } from '@/components/notes/DeleteNoteButton'

import { notes } from '@/db/schema'

type Note = typeof notes.$inferSelect

const COLORS = ['Default', 'Yellow', 'Pink', 'Blue', 'Green', 'Purple', 'Orange', 'Red', 'Mint', 'Gray'];

export function NoteEditor({ initialNote, onDelete }: { initialNote: Note, onDelete?: () => Promise<void> }) {
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

  const [noteColor, setNoteColor] = useState(initialNote.color || 'Default')
  const bgColor = colorMap[noteColor] || colorMap['Default']

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [title, setTitle] = useState(initialNote.title || '')
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(initialNote.isPinned || false)
  const [isArchived, setIsArchived] = useState(initialNote.isArchived || false)

  const handleTogglePin = async () => {
    const newVal = !isPinned
    setIsPinned(newVal)
    await updateNote(initialNote.id, { isPinned: newVal })
  }

  const handleToggleArchive = async () => {
    const newVal = !isArchived
    setIsArchived(newVal)
    await updateNote(initialNote.id, { isArchived: newVal })
  }

  const titleRef = useRef(title)
  const contentRef = useRef(initialNote.content)

  // Sync refs so debounce uses latest state
  useEffect(() => {
    titleRef.current = title
  }, [title])

  const debouncedSave = useCallback(
    debounce(async () => {
      setSaveStatus('saving')
      try {
        await updateNote(initialNote.id, {
          title: titleRef.current,
          content: contentRef.current,
        })
        setSaveStatus('saved')
      } catch (err) {
        setSaveStatus('error')
      }
    }, 1000),
    [initialNote.id]
  )

  const editor = useEditor({
    extensions: [
      StarterKit,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Write something brilliant...',
      }),
    ],
    content: initialNote.content || '',
    editorProps: {
      attributes: {
        class: 'tiptap focus:outline-none min-h-full max-w-none p-6 text-lg',
      },
    },
    onUpdate: ({ editor }) => {
      contentRef.current = editor.getJSON()
      debouncedSave()
    },
  })

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel()
    }
  }, [debouncedSave])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTitle(e.target.value)
    debouncedSave()
  }

  const handleColorChange = async (newColor: string) => {
    setNoteColor(newColor)
    setSaveStatus('saving')
    try {
      await updateNote(initialNote.id, { color: newColor })
      setSaveStatus('saved')
    } catch (err) {
      setSaveStatus('error')
    }
  }

  const StatusIndicator = () => {
    if (saveStatus === 'saving') return <span className="text-sm font-bold text-note-fg bg-note-default px-2 py-1 rounded-full border-2 border-black">Saving...</span>
    if (saveStatus === 'error') return <span className="text-sm font-bold text-white bg-red-500 px-2 py-1 rounded-full border-2 border-black">Error</span>
    return <span className="text-sm font-bold text-note-fg bg-note-green px-2 py-1 rounded-full border-2 border-black">Saved</span>
  }

  const titleTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize title textarea
  useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto'
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`
    }
  }, [title])

  return (
    <div className="flex flex-col h-full flex-1 overflow-hidden text-note-fg bg-note-default relative">

      {/* Expanding Top Navbar */}
      <div className="absolute top-0 left-0 right-0 h-16 [@media(hover:hover)]:h-6 z-20 group">
        <div className={`absolute top-0 left-0 w-full flex flex-col justify-center overflow-hidden transition-all duration-300 ease-out h-16 [@media(hover:hover)]:h-1.5 [@media(hover:hover)]:group-hover:h-16 ${bgColor} shadow-[0_4px_0_0_#000] [@media(hover:hover)]:shadow-none [@media(hover:hover)]:group-hover:shadow-[0_4px_0_0_#000] border-b-4 border-black [@media(hover:hover)]:border-b-0 [@media(hover:hover)]:group-hover:border-b-4`}>
          <div className="w-full flex items-center justify-between px-4 sm:px-6 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-300">
            <Link href="/notes" className="flex items-center gap-2 font-bold hover:-translate-y-0.5 transition-transform" title="Back to Notes">
              <ArrowLeft className="w-6 h-6" />
              <span className="hidden sm:inline uppercase tracking-widest">Back</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="outline"
                size="icon"
                title={isPinned ? "Unpin Note" : "Pin Note"}
                onClick={handleTogglePin}
                className={`hidden sm:inline-flex border-2 border-black rounded-none shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all w-8 h-8 ${isPinned ? 'bg-note-yellow text-black' : 'bg-white dark:bg-zinc-800 text-black dark:text-white'}`}
              >
                {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                title={isArchived ? "Unarchive Note" : "Archive Note"}
                onClick={handleToggleArchive}
                className={`hidden sm:inline-flex border-2 border-black rounded-none shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all w-8 h-8 ${isArchived ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-zinc-800 text-black dark:text-white'}`}
              >
                {isArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              </Button>

              <ThemeSwitcher />
              {onDelete && <DeleteNoteButton onDelete={onDelete} />}
            </div>
          </div>
        </div>
      </div>

      {/* Header / Title area (Plain) */}
      <div className="flex items-center pt-24 [@media(hover:hover)]:pt-10 px-6 sm:px-12 gap-4">
        <textarea
          ref={titleTextareaRef}
          value={title}
          onChange={handleTitleChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              editor?.commands.focus()
            }
          }}
          placeholder="Note Title"
          rows={1}
          className="text-3xl sm:text-4xl font-black focus:outline-none w-full bg-transparent placeholder:text-note-fg/30 text-note-fg resize-none overflow-hidden"
        />
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto cursor-text px-6 sm:px-12 pb-32 mt-4" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>

      {/* Bottom Floating Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-end pointer-events-none">

        {/* Formatting Toolbar Area */}
        <div className="pointer-events-auto relative flex flex-col items-start sm:gap-0">

          {/* Mobile Toggle Button */}
          <Button
            onClick={() => setIsToolbarOpen(!isToolbarOpen)}
            className="sm:hidden flex items-center justify-center border-4 border-black shadow-[4px_4px_0_0_#000] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all bg-note-default text-note-fg hover:bg-black/5 h-12 w-12 rounded-full z-20 relative"
          >
            {isToolbarOpen ? <X className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
          </Button>

          {/* Collapsible Toolbar */}
          <div className={`absolute bottom-full left-0 mb-4 sm:static sm:mb-0 overflow-hidden transition-all duration-300 ease-out origin-bottom-left sm:origin-bottom ${isToolbarOpen ? 'opacity-100 scale-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-95 pointer-events-none translate-y-2 sm:translate-y-0 sm:pointer-events-auto sm:opacity-100 sm:scale-100'
            } bg-note-default rounded-xl sm:border-4 border-black sm:shadow-[4px_4px_0_0_#000] z-10`}>
            {/* Wrapper to maintain border safely during animation */}
            <div className={`border-4 border-black sm:border-0 rounded-xl sm:rounded-none bg-note-default`}>
              <NoteToolbar editor={editor} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 pointer-events-auto bg-note-default p-2 rounded-xl border-4 border-black shadow-[4px_4px_0_0_#000]">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center border-2 border-black hover:translate-y-0.5 hover:translate-x-0.5 transition-all rounded-full bg-white text-black h-8 w-8">
              <Palette className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-4 border-black rounded-xl p-3 shadow-[4px_4px_0_0_#000] bg-white w-48 mb-2" align="end" sideOffset={10}>
              <div className="mb-2 font-bold text-sm text-black">Color</div>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((colorName) => (
                  <DropdownMenuItem
                    key={colorName}
                    onClick={() => handleColorChange(colorName)}
                    className={`w-6 h-6 rounded-full border-2 border-black cursor-pointer p-0 ${colorMap[colorName].split(' ')[0] || 'bg-note-default'} ${noteColor === colorName ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                    title={colorName}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <StatusIndicator />
        </div>
      </div>
    </div>
  )
}
