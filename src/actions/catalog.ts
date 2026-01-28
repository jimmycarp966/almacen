'use server'

import { supabase } from '@/lib/supabase'
import { mockCategorias, mockProductos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'

export async function getCategorias() {
    try {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('activo', true)
            .order('nombre')

        if (error) {
            console.error('Error al obtener categorías:', error)
            return []
        }
        return data || []
    } catch (error) {
        console.error('Error inesperado al obtener categorías:', error)
        return []
    }
}

export async function getProductos(categoriaId?: string, searchQuery?: string, filters?: {
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    sortBy?: 'nombre' | 'precio_asc' | 'precio_desc' | 'popularidad'
}) {
    try {
        let query = supabase
            .from('productos')
            .select('*')
            .eq('activo', true)

        // Filtrar por categoría
        if (categoriaId && categoriaId !== 'todos') {
            query = query.eq('categoria_id', categoriaId)
        }

        // Filtrar por búsqueda
        if (searchQuery && searchQuery.trim()) {
            const queryWords = searchQuery.toLowerCase().trim().split(/\s+/).filter(word => word.length > 0)
            const searchPattern = `%${queryWords.join('%')}%`
            query = query.or(`nombre.ilike.${searchPattern},descripcion.ilike.${searchPattern}`)
        }

        // Filtrar por precio
        if (filters?.minPrice !== undefined && filters.minPrice !== null) {
            query = query.gte('precio', filters.minPrice)
        }
        if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
            query = query.lte('precio', filters.maxPrice)
        }

        // Filtrar por disponibilidad
        if (filters?.inStock) {
            query = query.gt('stock', 0)
        }

        // Ordenar productos
        switch (filters?.sortBy) {
            case 'nombre':
                query = query.order('nombre', { ascending: true })
                break
            case 'precio_asc':
                query = query.order('precio', { ascending: true })
                break
            case 'precio_desc':
                query = query.order('precio', { ascending: false })
                break
            case 'popularidad':
                query = query.order('stock', { ascending: false })
                break
            default:
                query = query.order('nombre', { ascending: true })
        }

        const { data, error } = await query

        if (error) {
            console.error('Error al obtener productos:', error)
            return []
        }
        return data || []
    } catch (error) {
        console.error('Error inesperado al obtener productos:', error)
        return []
    }
}

/**
 * Revalida el catálogo para actualizar datos en ISR
 */
export async function revalidateCatalog() {
    revalidatePath('/catalogo')
    revalidatePath('/catalogo/[categoria]')
    return { revalidated: true }
}

/**
 * Obtiene las ofertas de la semana (productos con descuento o marcados como oferta)
 * Límite de 10 productos
 */
export async function getOfertasSemana() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('activo', true)
            .gt('descuento', 0)
            .limit(10)
            .order('descuento', { ascending: false })

        if (error) {
            console.error('Error al obtener ofertas:', error)
            return []
        }
        return data || []
    } catch (error) {
        console.error('Error inesperado al obtener ofertas:', error)
        return []
    }
}

