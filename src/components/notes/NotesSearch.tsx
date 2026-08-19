'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Menu } from 'lucide-react'
import { useState, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function NotesSearch({ 
  onToggleSidebar,
  currentQuery,
  currentTab
}: {
  onToggleSidebar: () => void
  currentQuery: string
  currentTab: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(currentQuery)

  const updateUrl = useCallback((tab: string, q: string) => {
    const params = new URLSearchParams()
    if (tab !== 'active') params.set('tab', tab)
    if (q) params.set('q', q)
    router.push(`/notes?${params.toString()}`)
  }, [router])

  const debouncedSearch = useCallback(
    debounce((q: string) => {
      updateUrl(currentTab, q)
    }, 300),
    [currentTab, updateUrl]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchValue(val)
    debouncedSearch(val)
  }

  const clearSearch = () => {
    setSearchValue('')
    updateUrl(currentTab, '')
  }

  return (
    <div className="flex items-center gap-2 mb-6 w-full">
      <Button 
        onClick={onToggleSidebar}
        title="Toggle Sidebar"
        className="w-14 h-14 shrink-0 border-4 border-black rounded-none shadow-[4px_4px_0_0_#000] bg-note-yellow text-black hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
        <Input
          placeholder="Search notes..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full h-14 pl-10 pr-10 border-4 border-black rounded-none shadow-[4px_4px_0_0_#000] focus-visible:ring-0 focus-visible:shadow-none focus-visible:translate-x-1 focus-visible:translate-y-1 transition-all text-lg font-bold bg-note-default text-note-fg"
        />
        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-300" />
          </button>
        )}
      </div>
    </div>
  )
}
