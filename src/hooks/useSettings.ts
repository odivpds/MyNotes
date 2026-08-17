import { useState, useEffect } from 'react'

export function useSettings() {
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('confirmBeforeDelete')
      if (stored !== null) {
        setConfirmBeforeDelete(stored === 'true')
      }
      setIsLoaded(true)
    }

    // Initial load
    handleStorageChange()
    
    // Listen for custom event
    window.addEventListener('settings-changed', handleStorageChange)
    
    return () => {
      window.removeEventListener('settings-changed', handleStorageChange)
    }
  }, [])

  const toggleConfirm = (value: boolean) => {
    setConfirmBeforeDelete(value)
    localStorage.setItem('confirmBeforeDelete', String(value))
    window.dispatchEvent(new Event('settings-changed'))
  }

  return {
    confirmBeforeDelete,
    toggleConfirm,
    isLoaded
  }
}
