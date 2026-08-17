import { useState, useEffect } from 'react'

export function useSettings() {
  const [confirmBeforeDelete, setConfirmBeforeDelete] = useState(true)
  const [appName, setAppName] = useState<string | null>(null)
  const [appSuffix, setAppSuffix] = useState<string | null>(null)
  const [tourStatus, setTourStatus] = useState<'UNSET' | 'PENDING' | 'COMPLETED'>('COMPLETED') // default to completed to avoid flicker
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const handleStorageChange = () => {
      const storedConfirm = localStorage.getItem('confirmBeforeDelete')
      if (storedConfirm !== null) {
        setConfirmBeforeDelete(storedConfirm === 'true')
      }
      
      const storedAppName = localStorage.getItem('appName')
      if (storedAppName !== null) {
        setAppName(storedAppName)
      }

      const storedAppSuffix = localStorage.getItem('appSuffix')
      if (storedAppSuffix !== null) {
        setAppSuffix(storedAppSuffix)
      }

      const storedStatus = localStorage.getItem('tourStatus')
      if (storedStatus === 'COMPLETED') {
        setTourStatus(storedStatus)
      } else {
        setTourStatus('UNSET')
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

  const updateAppName = (name: string) => {
    setAppName(name)
    localStorage.setItem('appName', name)
    window.dispatchEvent(new Event('settings-changed'))
  }

  const updateAppSuffix = (suffix: string) => {
    setAppSuffix(suffix)
    localStorage.setItem('appSuffix', suffix)
    window.dispatchEvent(new Event('settings-changed'))
  }

  const startTour = () => {
    setTourStatus('COMPLETED')
    localStorage.setItem('tourStatus', 'COMPLETED')
    window.dispatchEvent(new Event('settings-changed'))
    window.dispatchEvent(new Event('start-tour'))
  }

  const completeTour = () => {
    setTourStatus('COMPLETED')
    localStorage.setItem('tourStatus', 'COMPLETED')
    window.dispatchEvent(new Event('settings-changed'))
  }

  return {
    confirmBeforeDelete,
    toggleConfirm,
    appName,
    updateAppName,
    appSuffix,
    updateAppSuffix,
    tourStatus,
    startTour,
    completeTour,
    isLoaded
  }
}
