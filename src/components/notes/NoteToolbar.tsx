import { Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, List, ListOrdered, CheckSquare, Quote, Code } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NoteToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run()
  const toggleItalic = () => editor.chain().focus().toggleItalic().run()
  const toggleStrike = () => editor.chain().focus().toggleStrike().run()
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run()
  const toggleTaskList = () => editor.chain().focus().toggleTaskList().run()
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor.chain().focus().toggleCodeBlock().run()

  const ToolbarBtn = ({ onClick, isActive, icon: Icon, title }: any) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      title={title}
      className={`border-2 border-black rounded-none shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all w-8 h-8 text-note-fg hover:bg-black/10 ${isActive ? 'bg-note-yellow' : 'bg-note-default'}`}
    >
      <Icon className="w-4 h-4" />
    </Button>
  )

  return (
    <div className="flex flex-wrap gap-2 p-2 border-b-4 border-black bg-black/5">
      <ToolbarBtn onClick={toggleBold} isActive={editor.isActive('bold')} icon={Bold} title="Bold (Ctrl+B)" />
      <ToolbarBtn onClick={toggleItalic} isActive={editor.isActive('italic')} icon={Italic} title="Italic (Ctrl+I)" />
      <ToolbarBtn onClick={toggleStrike} isActive={editor.isActive('strike')} icon={Strikethrough} title="Strikethrough (Ctrl+Shift+X)" />
      <ToolbarBtn onClick={toggleBulletList} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
      <ToolbarBtn onClick={toggleOrderedList} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
      <ToolbarBtn onClick={toggleTaskList} isActive={editor.isActive('taskList')} icon={CheckSquare} title="Task List" />
      <ToolbarBtn onClick={toggleBlockquote} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
      <ToolbarBtn onClick={toggleCodeBlock} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
    </div>
  )
}
