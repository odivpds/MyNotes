'use client'

import { useState } from 'react'
import { NotesSidebar } from './NotesSidebar'
import { NotesSearch } from './NotesSearch'

export function NotesLayout({ 
  children, 
  currentTab, 
  currentQuery 
}: { 
  children: React.ReactNode
  currentTab: string
  currentQuery: string
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPinned, setIsPinned] = useState(false) // Whether it was opened via button

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsSidebarOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    const newState = !isSidebarOpen
    setIsSidebarOpen(newState)
    setIsPinned(newState)
  }

  return (
    <>
      {/* Invisible Hover Trigger for Desktop */}
      <div 
        className="hidden sm:block absolute left-0 top-0 h-full w-4 z-40" 
        onMouseEnter={handleMouseEnter}
      />

      <NotesSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isPinned={isPinned}
        setIsPinned={setIsPinned}
        currentTab={currentTab} 
        onMouseLeave={handleMouseLeave}
      />
      
      {/* Notes Grid Area */}
      <div className="tour-grid flex-1 sm:flex-none w-full sm:w-[320px] md:w-[380px] lg:w-[450px] xl:w-[600px] overflow-y-auto p-4 sm:p-6 lg:p-10 mx-auto sm:mx-0 shrink-0">
        <NotesSearch 
          onToggleSidebar={toggleSidebar} 
          currentQuery={currentQuery} 
          currentTab={currentTab} 
        />
        {children}
      </div>
    </>
  )
}
