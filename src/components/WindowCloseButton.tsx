'use client'

import { Button } from '@/components/ui/button'
import { X as CloseIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function WindowCloseButton() {
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.userAgent.includes('Electron')) {
      setIsElectron(true)
    }
  }, [])

  if (!isElectron) return null

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      title="Close" 
      className="rounded-none hover:bg-red-500 hover:text-white text-black border-2 border-black ml-2 bg-[#FDE047] shadow-[2px_2px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none transition-all no-drag" 
      onClick={() => window.close()}
    >
      <CloseIcon className="w-5 h-5" />
    </Button>
  )
}
