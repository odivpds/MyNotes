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
// import { ThemeSwitcher } from '@/components/ThemeSwitcher'
// import { DeleteNoteButton } from '@/components/notes/DeleteNoteButton'

import { notes } from '@/db/schema'

type Note = typeof notes.$inferSelect

const COLORS = ['Default', 'Yellow', 'Pink', 'Blue', 'Green', 'Purple', 'Orange', 'Red', 'Mint', 'Gray'];

import { NOTE_COLORS, getColorStyles } from '@/lib/colors'
import { Plus, MoreHorizontal, X as CloseIcon, List, Trash, Eye, EyeOff, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function NoteEditor({ initialNote, onDelete }: { initialNote: Note, onDelete?: () => Promise<void> }) {
  const router = useRouter()
  const [noteColor, setNoteColor] = useState(initialNote.color || 'Yellow')
  const colorStyles = getColorStyles(noteColor)
  const isElectron = typeof window !== 'undefined' && navigator.userAgent.includes('Electron')

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [title, setTitle] = useState(initialNote.title || '')
  const [isToolbarOpen, setIsToolbarOpen] = useState(false)
  const [showTitle, setShowTitle] = useState(true)

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
        placeholder: 'Take a note...',
      }),
    ],
    content: initialNote.content || '',
    editorProps: {
      attributes: {
        class: `tiptap focus:outline-none min-h-full max-w-none text-lg`,
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
    if (saveStatus === 'saving') return <span className="text-xs font-bold px-2 py-1 bg-black/10 rounded-full">Saving...</span>
    if (saveStatus === 'error') return <span className="text-xs font-bold text-white bg-red-500 px-2 py-1 rounded-full">Error</span>
    return null
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
    <div className="flex flex-col h-full flex-1 overflow-hidden transition-colors duration-300 bg-app text-foreground relative">

      {/* Sticky Top Bar */}
      <div className={`px-0 py-1 flex items-center justify-between select-none drag-region ${colorStyles.bg} ${colorStyles.text} opacity-90 hover:opacity-100 transition-opacity`}>
        <div className="flex items-center no-drag">
          {isElectron ? (
            <Button variant="ghost" size="icon" className={`rounded-none hover:bg-black/10 ${colorStyles.text}`} title="New Note" onClick={() => window.open('/notes?new=true', '_blank')}>
              <Plus className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/notes?new=true" prefetch={false} title="New Note">
              <Button variant="ghost" size="icon" className={`rounded-none hover:bg-black/10 ${colorStyles.text}`}>
                <Plus className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center no-drag">
          <StatusIndicator />

          <DropdownMenu>
            <DropdownMenuTrigger className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 rounded-none hover:bg-black/10 ${colorStyles.text}`}>
              <MoreHorizontal className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[280px] p-0 bg-note-default border-4 border-black rounded-xl shadow-[6px_6px_0_0_#000] text-note-fg overflow-hidden z-50">

              {/* Color Grid */}
              <div className="flex h-12 border-b-4 border-black w-full">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`flex-1 h-full cursor-pointer hover:brightness-90 flex items-center justify-center transition-all ${color.bg}`}
                    title={color.id}
                  >
                    {noteColor === color.id && <Check className="w-5 h-5 text-black" strokeWidth={3} />}
                  </button>
                ))}
              </div>

              <div className="p-2 flex flex-col gap-1">
                <DropdownMenuItem onClick={() => setShowTitle(!showTitle)} className="cursor-pointer font-bold focus:bg-note-gray focus:text-note-fg p-3 outline-none rounded-lg flex items-center">
                  {showTitle ? <EyeOff className="w-4 h-4 mr-3" /> : <Eye className="w-4 h-4 mr-3" />}
                  {showTitle ? 'Hide title' : 'Show title'}
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer font-bold focus:bg-note-gray focus:text-note-fg p-0 outline-none rounded-lg">
                  {isElectron ? (
                    <button onClick={() => { window.open('/notes', '_blank'); }} className="flex items-center w-full p-3">
                      <List className="w-4 h-4 mr-3" />
                      Notes list
                    </button>
                  ) : (
                    <Link href="/notes" className="flex items-center w-full p-3">
                      <List className="w-4 h-4 mr-3" />
                      Notes list
                    </Link>
                  )}
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onDelete} className="cursor-pointer font-bold focus:bg-red-500 focus:text-white p-3 outline-none rounded-lg text-red-600 flex items-center">
                  <Trash className="w-4 h-4 mr-3" />
                  Move to Trash
                </DropdownMenuItem>
              </div>

            </DropdownMenuContent>
          </DropdownMenu>

          {isElectron ? (
            <Button variant="ghost" size="icon" title="Close" className={`rounded-none hover:bg-red-500 hover:text-white ${colorStyles.text}`} onClick={() => window.close()}>
              <CloseIcon className="w-5 h-5" />
            </Button>
          ) : (
            <Link href="/notes" prefetch={false} title="Close">
              <Button variant="ghost" size="icon" className={`rounded-none hover:bg-red-500 hover:text-white ${colorStyles.text}`}>
                <CloseIcon className="w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Header / Title area (Plain) */}
      {showTitle && (
        <div className="flex items-center pt-6 sm:pt-8 px-6 sm:px-12 gap-4">
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
            className="text-3xl sm:text-4xl font-black focus:outline-none w-full bg-transparent placeholder:text-foreground/30 text-foreground resize-none overflow-hidden"
          />
        </div>
      )}

      {/* Editor Content */}
      <div className={`flex-1 overflow-y-auto cursor-text px-6 sm:px-12 pb-32 ${!showTitle ? 'pt-4 sm:pt-6' : 'pt-1'}`} onClick={() => editor?.commands.focus()}>
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

      </div>
    </div>
  )
}
