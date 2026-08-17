'use client'

import { useSettings } from '@/hooks/useSettings'

export function AppTitle({ defaultName }: { defaultName: string }) {
  const { appSuffix, isLoaded } = useSettings()

  // Use appSuffix (Nopepads Name setting) as the base, fallback to defaultName
  const baseName = (isLoaded && appSuffix) ? appSuffix : defaultName
  
  // Prevent double suffix if user accidentally types "Odiv's NOPEPADS"
  const cleanName = baseName.replace(/'[sS]?\s*NOPEPADS$/i, '').trim()
  
  const displayTitle = `${cleanName}'S NOPEPADS`.toUpperCase()

  return (
    <h1 className="text-2xl md:text-3xl font-pixel uppercase tracking-widest text-white [text-shadow:4px_4px_0_#000] mt-1 text-center sm:text-left">
      {displayTitle}
    </h1>
  )
}
