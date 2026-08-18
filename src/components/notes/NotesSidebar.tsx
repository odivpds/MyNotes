'use client'

import { useRouter } from 'next/navigation'
import { FileText, Archive, Trash2 } from 'lucide-react'
import { useCallback } from 'react'

export function NotesSidebar({ 
  isOpen, 
  setIsOpen,
  isPinned,
  setIsPinned,
  currentTab,
  onMouseLeave
}: { 
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isPinned: boolean
  setIsPinned: (pinned: boolean) => void
  currentTab: string
  onMouseLeave: () => void
}) {
  const router = useRouter()

  const tabs = [
    { id: 'active', label: 'Notes', icon: FileText },
    { id: 'archive', label: 'Archive', icon: Archive },
    { id: 'trash', label: 'Trash', icon: Trash2 },
  ]

  const updateUrl = useCallback((tab: string) => {
    const params = new URLSearchParams(window.location.search)
    if (tab !== 'active') {
      params.set('tab', tab)
    } else {
      params.delete('tab')
    }
    router.push(`/notes?${params.toString()}`)
  }, [router])

  const handleTabClick = (tabId: string) => {
    updateUrl(tabId)
    // Optional: auto-close on mobile after selection if not pinned
    if (window.innerWidth < 768) {
      setIsOpen(false)
      setIsPinned(false)
    }
  }

  return (
    <>
      {/* Sidebar Container */}
      <div
        onMouseLeave={onMouseLeave}
        className={`fixed sm:absolute left-0 top-0 h-full bg-note-gray dark:bg-zinc-800 border-black z-40 flex flex-col pt-24 sm:pt-6 transition-all duration-300 ease-in-out overflow-x-hidden ${
          isOpen ? 'w-64 translate-x-0 border-r-4 shadow-[4px_0_0_0_#000]' : 'w-0 -translate-x-full sm:translate-x-0 border-r-0'
        }`}
      >
        <div className="flex flex-col gap-2 p-4 w-64">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-4 px-4 py-3 border-4 border-black font-bold uppercase whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-note-yellow shadow-none translate-x-1 translate-y-1 text-black'
                    : 'bg-white shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0_0_#000] text-black'
                }`}
                title={tab.label}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Overlay for mobile and desktop click-outside */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-30 bg-black/50 sm:bg-transparent block ${isPinned ? 'sm:block' : 'sm:hidden'}`}
          onClick={() => {
            setIsOpen(false)
            setIsPinned(false)
          }}
        />
      )}
    </>
  )
}
