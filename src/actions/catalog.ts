'use server'

import { mockCategorias, mockProductos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'

export async function getCategorias() {
    // Usar datos mock en lugar de Supabase
    return mockCategorias
}

export async function getProductos(categoriaId?: string, searchQuery?: string, filters?: {
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    sortBy?: 'nombre' | 'precio_asc' | 'precio_desc' | 'popularidad'
}) {
    let productos = mockProductos

    // Filtrar por categoría
    if (categoriaId && categoriaId !== 'todos') {
        productos = productos.filter(p => p.categoria_id === categoriaId)
    }

    // Filtrar por búsqueda
    if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        productos = productos.filter(p => 
            p.nombre.toLowerCase().includes(query) ||
            p.descripcion?.toLowerCase().includes(query)
        )
    }

    // Filtrar por precio
    if (filters?.minPrice !== undefined && filters.minPrice !== null) {
        productos = productos.filter(p => Number(p.precio) >= filters.minPrice!)
    }
    if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
        productos = productos.filter(p => Number(p.precio) <= filters.maxPrice!)
    }

    // Filtrar por disponibilidad
    if (filters?.inStock) {
        productos = productos.filter(p => p.stock > 0)
    }

    // Ordenar productos
    if (filters?.sortBy) {
        productos = [...productos].sort((a, b) => {
            switch (filters.sortBy) {
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre)
                case 'precio_asc':
                    return Number(a.precio) - Number(b.precio)
                case 'precio_desc':
                    return Number(b.precio) - Number(a.precio)
                case 'popularidad':
                    return (b.stock || 0) - (a.stock || 0)
                default:
                    return 0
            }
        })
    }

    return productos
}

/**
 * Revalida el catálogo para actualizar datos en ISR
 */
export async function revalidateCatalog() {
    revalidatePath('/catalogo')
    revalidatePath('/catalogo/[categoria]')
    return { revalidated: true }
}
