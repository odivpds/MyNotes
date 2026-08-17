'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

export function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`peer ${props.className || ''} pr-12`}
      />
      <div className="absolute right-4 top-0 bottom-0 flex items-center justify-center transition-all peer-focus-visible:translate-x-1.5 peer-focus-visible:translate-y-1.5 pointer-events-none">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-black hover:opacity-70 transition-opacity pointer-events-auto"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <Eye className="w-6 h-6" />
          ) : (
            <EyeOff className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  )
}
