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
import { Palette } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

type Note = {
  id: string
  title: string
  content: any
  color: string | null
}

const COLORS = ['Default', 'Yellow', 'Pink', 'Blue', 'Green', 'Purple', 'Orange', 'Red', 'Mint', 'Gray'];

export function NoteEditor({ initialNote }: { initialNote: Note }) {
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
  
  const [noteColor, setNoteColor] = useState(initialNote.color || 'Default')
  const bgColor = colorMap[noteColor] || colorMap['Default']

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [title, setTitle] = useState(initialNote.title || '')
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
        class: 'tiptap focus:outline-none min-h-[400px] max-w-none p-6 text-lg',
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="flex flex-col border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] overflow-hidden text-note-fg bg-note-default">
      {/* Header / Title area */}
      <div className={`flex justify-between items-center p-4 border-b-4 border-black ${bgColor}`}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Note Title"
          className="text-2xl sm:text-3xl font-black focus:outline-none w-full bg-transparent placeholder:text-note-fg/50 text-note-fg"
        />
        <div className="flex items-center gap-4 ml-4 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all rounded-full bg-white text-black h-8 w-8">
              <Palette className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-4 border-black rounded-xl p-3 shadow-[4px_4px_0_0_#000] bg-white w-48" align="end">
              <div className="mb-2 font-bold text-sm text-black">Color</div>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((colorName) => (
                  <DropdownMenuItem
                    key={colorName}
                    onClick={() => handleColorChange(colorName)}
                    className={`w-6 h-6 rounded-full border-2 border-black cursor-pointer p-0 ${colorMap[colorName] || 'bg-note-default'} ${noteColor === colorName ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                    title={colorName}
                  />
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <StatusIndicator />
        </div>
      </div>
      
      {/* Toolbar */}
      <NoteToolbar editor={editor} />
      
      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto cursor-text bg-note-default" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
