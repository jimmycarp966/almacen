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

        // Aumentar límite para obtener todos los productos (Supabase default es 1000, max es 1000 por request)
        // Para más de 1000 necesitamos paginación, por ahora seteamos el máximo
        query = query.limit(1000)

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
 * Obtiene TODOS los productos (sin límite de 1000) para admin
 * Usa paginación interna para traer todos los resultados
 */
export async function getAllProductosForAdmin() {
    console.log('[DEBUG getAllProductosForAdmin] START')
    const PAGE_SIZE = 1000
    let allProductos: any[] = []
    let page = 0
    let hasMore = true

    try {
        while (hasMore) {
            const start = page * PAGE_SIZE
            const end = start + PAGE_SIZE - 1

            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('activo', true)
                .order('nombre', { ascending: true })
                .range(start, end)

            if (error) {
                console.error('[DEBUG getAllProductosForAdmin] Error:', error)
                break
            }

            if (data && data.length > 0) {
                allProductos = allProductos.concat(data)
                page++
                hasMore = data.length === PAGE_SIZE
            } else {
                hasMore = false
            }
        }

        console.log(`[DEBUG getAllProductosForAdmin] Total productos: ${allProductos.length}`)
        return allProductos
    } catch (error) {
        console.error('[DEBUG getAllProductosForAdmin] Error inesperado:', error)
        return []
    } finally {
        console.log('[DEBUG getAllProductosForAdmin] END')
    }
}

/**
 * Obtiene TODOS los productos con paginación para el catálogo de clientes
 * Incluye filtros de categoría, búsqueda y ordenamiento
 */
export async function getAllProductos(categoriaId?: string, searchQuery?: string, filters?: {
    minPrice?: number | null
    maxPrice?: number | null
    inStock?: boolean
    sortBy?: 'nombre' | 'precio_asc' | 'precio_desc' | 'popularidad'
}) {
    console.log('[DEBUG getAllProductos] START', { categoriaId, searchQuery, filters })
    const PAGE_SIZE = 1000
    let allProductos: any[] = []
    let page = 0
    let hasMore = true

    try {
        while (hasMore) {
            const start = page * PAGE_SIZE
            const end = start + PAGE_SIZE - 1

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

            // Aplicar rango para paginación
            query = query.range(start, end)

            const { data, error } = await query

            if (error) {
                console.error('[DEBUG getAllProductos] Error:', error)
                break
            }

            if (data && data.length > 0) {
                allProductos = allProductos.concat(data)
                page++
                hasMore = data.length === PAGE_SIZE
            } else {
                hasMore = false
            }
        }

        console.log(`[DEBUG getAllProductos] Total productos: ${allProductos.length}`)
        return allProductos
    } catch (error) {
        console.error('[DEBUG getAllProductos] Error inesperado:', error)
        return []
    } finally {
        console.log('[DEBUG getAllProductos] END')
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
    console.log('[DEBUG getOfertasSemana] START')
    const PAGE_SIZE = 1000
    let allOfertas: any[] = []
    let page = 0
    let hasMore = true

    try {
        while (hasMore) {
            const start = page * PAGE_SIZE
            const end = start + PAGE_SIZE - 1

            const { data, error } = await supabase
                .from('productos')
                .select('*')
                .eq('activo', true)
                .eq('es_oferta', true)
                .order('nombre', { ascending: true })
                .range(start, end)

            if (error) {
                console.error('[DEBUG getOfertasSemana] Error:', error)
                break
            }

            if (data && data.length > 0) {
                allOfertas = allOfertas.concat(data)
                page++
                hasMore = data.length === PAGE_SIZE
            } else {
                hasMore = false
            }
        }

        console.log(`[DEBUG getOfertasSemana] Total ofertas: ${allOfertas.length}`)
        return allOfertas
    } catch (error) {
        console.error('[DEBUG getOfertasSemana] Error inesperado:', error)
        return []
    } finally {
        console.log('[DEBUG getOfertasSemana] END')
    }
}

