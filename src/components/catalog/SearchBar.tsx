'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export function SearchBar({ placeholder = 'Buscar productos...', onSearch }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams?.get('q') || '')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams?.toString() || '')
      if (query.trim()) {
        params.set('q', query)
      } else {
        params.delete('q')
      }
      router.push(`/catalogo?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, searchParams, router])

  const handleClear = () => {
    setQuery('')
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.delete('q')
    router.push(`/catalogo?${params.toString()}`)
  }

  return (
    <div className="relative flex-1 min-w-0 max-w-[200px] sm:max-w-[280px] md:max-w-[320px]">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-gray-400 text-xl sm:text-2xl">search</span>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 sm:pl-12 pr-8 sm:pr-10 py-2.5 sm:py-3 bg-white rounded-xl shadow-soft border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main placeholder:text-text-secondary transition-all text-sm"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-text-main transition-colors"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      )}
    </div>
  )
}
