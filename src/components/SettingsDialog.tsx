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
import { logout, updatePassword } from '@/app/login/actions'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { PasswordInput } from '@/components/PasswordInput'

export function SettingsDialog() {
  const [open, setOpen] = useState(false)
  const { confirmBeforeDelete, toggleConfirm, appName, updateAppName, appSuffix, updateAppSuffix, startTour, isLoaded } = useSettings()
  const [tempName, setTempName] = useState('')
  const [tempSuffix, setTempSuffix] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStatus, setPasswordStatus] = useState<{ success?: boolean; message?: string }>({})
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      if (appName) setTempName(appName)
      if (appSuffix) setTempSuffix(appSuffix)
    }
  }, [isLoaded, appName, appSuffix])

  const handleUpdatePassword = async () => {
    setPasswordStatus({})
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ success: false, message: 'Passwords do not match!' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ success: false, message: 'Password must be at least 6 characters.' })
      return
    }
    setIsUpdatingPassword(true)
    const result = await updatePassword(newPassword)
    setPasswordStatus(result)
    setIsUpdatingPassword(false)
    if (result.success) {
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordStatus({}), 3000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon" title="Settings" className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-transform bg-note-default text-note-fg" />
        }
      >
        <Settings className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] bg-app text-foreground sm:max-w-md [&>button]:hidden">
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

          <div className="space-y-2 border-t-2 border-black/10 pt-4">
            <h4 className="font-bold text-lg">Your Name</h4>
            <p className="text-sm opacity-70">Customize the name used in the motivational quotes</p>
            <div className="flex gap-2">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Custom Name"
                maxLength={15}
                className="border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] focus-visible:ring-0 bg-white dark:bg-black/20 text-black dark:text-white"
              />
              <Button onClick={() => updateAppName(tempName)} className="border-2 border-black font-bold uppercase shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all">
                Save
              </Button>
            </div>
          </div>

          <div className="space-y-2 border-t-2 border-black/10 pt-4">
            <h4 className="font-bold text-lg">Nopepads Name</h4>
            <p className="text-sm opacity-70">Customize the app title (e.g. type &quot;ODIV&quot; for &quot;ODIV&apos;S NOPEPADS&quot;)</p>
            <div className="flex gap-2">
              <Input
                value={tempSuffix}
                onChange={(e) => setTempSuffix(e.target.value)}
                placeholder="ODIV"
                maxLength={10}
                className="border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] focus-visible:ring-0 bg-white dark:bg-black/20 text-black dark:text-white"
              />
              <Button onClick={() => updateAppSuffix(tempSuffix)} className="border-2 border-black font-bold uppercase shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all">
                Save
              </Button>
            </div>
          </div>
          <div className="space-y-2 border-t-2 border-black/10 pt-4">
            <h4 className="font-bold text-lg">Change Password</h4>
            <p className="text-sm opacity-70">Update your account password</p>
            <div className="space-y-3 pt-2">
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                iconClassName="text-black dark:text-white"
                className="border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] focus-visible:ring-0 bg-white dark:bg-black/20 text-black dark:text-white"
              />
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                iconClassName="text-black dark:text-white"
                className="border-2 border-black rounded-lg shadow-[2px_2px_0_0_#000] focus-visible:ring-0 bg-white dark:bg-black/20 text-black dark:text-white"
              />
              {passwordStatus.message && (
                <p className={`text-sm font-bold ${passwordStatus.success ? 'text-note-green' : 'text-red-500'}`}>
                  {passwordStatus.message}
                </p>
              )}
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !newPassword || !confirmPassword}
                className="w-full border-2 border-black font-bold uppercase shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all disabled:opacity-50"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </div>
          <div className="space-y-2 border-t-2 border-black/10 pt-4 pb-2">
            <h4 className="font-bold text-lg">App Tour</h4>
            <p className="text-sm opacity-70">Need a refresher on how things work?</p>
            <Button
              onClick={() => {
                startTour()
                setOpen(false)
              }}
              className="w-full border-2 border-black font-bold uppercase shadow-[2px_2px_0_0_#000] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all"
            >
              Replay Tour
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t-4 border-black mt-2">
          <form action={logout}>
            <Button
              type="submit"
              onClick={() => {
                localStorage.removeItem('tourStatus')
                localStorage.removeItem('appName')
                localStorage.removeItem('appSuffix')
                localStorage.removeItem('confirmBeforeDelete')
                localStorage.removeItem('hasSeenTour')
              }}
              className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-red-500 text-black hover:bg-red-600 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </form>
          <Button
            onClick={() => setOpen(false)}
            className="border-2 border-black font-bold uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-note-yellow text-black hover:bg-note-yellow/90"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
