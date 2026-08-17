'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Settings, LogOut } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { logout } from '@/app/login/actions'

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const { confirmBeforeDelete, toggleConfirm } = useSettings()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" title="Settings" className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform bg-note-default text-note-fg" />
        }
      >
        <Settings className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] bg-app text-foreground sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-black text-2xl uppercase border-b-4 border-black pb-4">Settings</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-lg">Confirm before deleting</h4>
              <p className="text-sm opacity-70">Show a popup before deleting a note</p>
            </div>

            {/* Custom Neobrutalist Toggle */}
            <button
              type="button"
              onClick={() => toggleConfirm(!confirmBeforeDelete)}
              className={`relative w-14 h-8 border-2 border-black rounded-full shadow-[2px_2px_0_0_#000] transition-colors focus:outline-none ${confirmBeforeDelete ? 'bg-note-green' : 'bg-gray-400'}`}
            >
              <span className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-black rounded-full transition-all ${confirmBeforeDelete ? 'left-[calc(100%-1.5rem)]' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t-4 border-black mt-2">
          <form action={logout}>
            <Button
              type="submit"
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-red-500 text-white hover:bg-red-600 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </form>
          <Button
            onClick={() => setOpen(false)}
            className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-note-yellow text-white hover:bg-note-yellow/90"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
