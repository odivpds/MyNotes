'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { resetPassword } from '@/app/login/actions'

export function ForgotPasswordDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleReset = async () => {
    if (!email) return
    setIsLoading(true)
    setStatus({})
    const result = await resetPassword(email)
    setStatus(result)
    setIsLoading(false)
    if (result.success) {
      setTimeout(() => setOpen(false), 3000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-sm font-bold opacity-70 hover:opacity-100 hover:underline text-black uppercase text-right w-full mt-2 transition-all">
        Forgot Password?
      </DialogTrigger>
      <DialogContent className="border-4 border-black rounded-xl shadow-[8px_8px_0_0_#000] bg-[#FDE047] text-black sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-black text-2xl uppercase border-b-4 border-black pb-4">Reset Password</DialogTitle>
          <DialogDescription className="text-black font-bold pt-2 opacity-80">
            Enter your email and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            type="email"
            className="border-4 border-black rounded-none shadow-[4px_4px_0_0_#000] focus-visible:ring-0 focus-visible:translate-y-1 focus-visible:translate-x-1 focus-visible:shadow-none bg-white text-black placeholder:text-black/50 transition-all h-12 text-lg font-bold"
          />
          {status.message && (
            <p className={`text-sm font-black uppercase ${status.success ? 'text-green-700' : 'text-red-600'}`}>
              {status.message}
            </p>
          )}
          <div className="flex gap-2 justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-4 border-black rounded-none font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-white text-black"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReset}
              disabled={isLoading || !email}
              className="border-4 border-black rounded-none font-black uppercase shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all bg-black text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Link'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
