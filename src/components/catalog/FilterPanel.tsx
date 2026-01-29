'use client'

import { useState } from 'react'
import { NumberInput } from '@/components/ui/NumberInput'

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
  categorias: any[]
}

export interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  categories: string[]
  inStock: boolean
  sortBy: 'nombre' | 'precio_asc' | 'precio_desc' | 'popularidad'
}

export function FilterPanel({ onFilterChange, initialFilters, categorias }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(
    initialFilters || {
      minPrice: null,
      maxPrice: null,
      categories: [],
      inStock: false,
      sortBy: 'nombre',
    }
  )

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]

    const newFilters = { ...filters, categories: newCategories }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: number | null) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleInStockToggle = () => {
    const newFilters = { ...filters, inStock: !filters.inStock }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    const newFilters = { ...filters, sortBy }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters: FilterState = {
      minPrice: null,
      maxPrice: null,
      categories: [],
      inStock: false,
      sortBy: 'nombre',
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const hasActiveFilters = filters.categories.length > 0 || filters.minPrice !== null || filters.maxPrice !== null || filters.inStock

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-3 bg-white rounded-xl shadow-soft border border-gray-100 hover:border-gray-200 transition-colors"
      >
        <span className="material-symbols-outlined text-text-main">tune</span>
        <span className="text-text-main font-bold text-sm">Filtros</span>
        {hasActiveFilters && (
          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-2xl shadow-soft border border-gray-100 p-4 sm:p-6 z-50 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg font-bold text-text-main">Filtros</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:text-primary/80 font-bold transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-text-main mb-3">Rango de Precio</label>
            <div className="flex items-center gap-3">
              <NumberInput
                placeholder="Mín"
                value={filters.minPrice ?? ''}
                onChange={(value) => handlePriceChange('minPrice', value)}
                className="w-full px-3 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-text-main text-sm"
              />
              <span className="text-text-secondary">-</span>
              <NumberInput
                placeholder="Máx"
                value={filters.maxPrice ?? ''}
                onChange={(value) => handlePriceChange('maxPrice', value)}
                className="w-full px-3 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-text-main text-sm"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-text-main mb-3">Categorías</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categorias.map((cat) => (
                <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat.id)}
                    onChange={() => handleCategoryToggle(cat.id)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-text-main text-sm">{cat.nombre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In Stock */}
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={handleInStockToggle}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-text-main text-sm font-bold">Solo productos disponibles</span>
            </label>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-text-main mb-3">Ordenar por</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as FilterState['sortBy'])}
              className="w-full px-3 py-2 bg-background-light rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-text-main text-sm"
            >
              <option value="nombre">Nombre</option>
              <option value="precio_asc">Precio: Menor a Mayor</option>
              <option value="precio_desc">Precio: Mayor a Menor</option>
              <option value="popularidad">Popularidad</option>
            </select>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Aplicar Filtros
          </button>
        </div>
      )}
    </div>
  )
}
