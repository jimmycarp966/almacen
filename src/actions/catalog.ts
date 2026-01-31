'use server'

import { supabase } from '@/lib/supabase'
import { mockCategorias, mockProductos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'

export async function getCategorias() {
    console.log('--- getCategorias START ---')
    try {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .eq('activo', true)
            .order('nombre')

        if (error) {
            console.error('Error al obtener categorías de Supabase:', error)
            console.log('Usando mockCategorias como fallback')
            return mockCategorias.filter(c => c.activo)
        }

        console.log(`getCategorias exitoso: ${data?.length || 0} categorías encontradas`)
        return data || []
    } catch (error) {
        console.error('Error inesperado al obtener categorías:', error)
        console.log('Usando mockCategorias como fallback (catch)')
        return mockCategorias.filter(c => c.activo)
    } finally {
        console.log('--- getCategorias END ---')
    }
}

export async function getProductos(categoriaId?: string, searchQuery?: string, filters?: {
    minPrice?: number | null
    maxPrice?: number | null
    inStock?: boolean
    sortBy?: 'nombre' | 'precio_asc' | 'precio_desc' | 'popularidad'
}) {
    console.log('[DEBUG getProductos] START', { categoriaId, searchQuery, filters })
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

        // Aumentar límite para obtener todos los productos (Supabase default es 1000)
        query = query.limit(2000)

        const { data, error } = await query

        if (error) {
            console.error('[DEBUG getProductos] Error de Supabase:', error)
            console.log('[DEBUG getProductos] Usando mockProductos como fallback')
            return mockProductos.filter(p => p.activo)
        }

        console.log(`[DEBUG getProductos] Exitoso: ${data?.length || 0} productos encontrados`)
        console.log('[DEBUG getProductos] Primeros 3 productos:', JSON.stringify(data?.slice(0, 3)))
        return data || []
    } catch (error) {
        console.error('[DEBUG getProductos] Error inesperado:', error)
        console.log('[DEBUG getProductos] Usando mockProductos como fallback (catch)')
        return mockProductos.filter(p => p.activo)
    } finally {
        console.log('[DEBUG getProductos] END')
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
 * Obtiene los productos marcados como oferta (es_oferta = true)
 */
export async function getOfertasSemana() {
    console.log('--- getOfertasSemana START ---')
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('*')
            .eq('activo', true)
            .eq('es_oferta', true)

        if (error) {
            console.error('Error al obtener ofertas de Supabase:', error)
            return []
        }

        console.log(`getOfertasSemana exitoso: ${data?.length || 0} ofertas encontradas`)
        return data || []
    } catch (error) {
        console.error('Error inesperado al obtener ofertas:', error)
        return []
    } finally {
        console.log('--- getOfertasSemana END ---')
    }
}

