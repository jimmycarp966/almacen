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
    <div className="relative w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-gray-400">search</span>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white rounded-xl shadow-soft border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-main placeholder:text-text-secondary transition-all"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-text-main transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  )
}
