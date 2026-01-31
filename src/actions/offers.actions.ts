'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

/**
 * Obtiene todos los productos con su estado de oferta (con paginación)
 */
export async function getAdminProductosOferta() {
    console.log('[DEBUG getAdminProductosOferta] START')
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
                .select('id, nombre, precio, imagen_url, es_oferta, descuento, activo')
                .eq('activo', true)
                .order('nombre', { ascending: true })
                .range(start, end)

            if (error) {
                console.error('[DEBUG getAdminProductosOferta] Error:', error)
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

        console.log(`[DEBUG getAdminProductosOferta] Total productos: ${allProductos.length}`)
        return allProductos
    } catch (error) {
        console.error('[DEBUG getAdminProductosOferta] Error inesperado:', error)
        return []
    } finally {
        console.log('[DEBUG getAdminProductosOferta] END')
    }
}

/**
 * Alterna el estado de oferta de un producto
 */
export async function toggleOfertaProducto(productoId: string, esOferta: boolean) {
    try {
        console.log('toggleOfertaProducto:', { productoId, esOferta })

        const { data, error } = await supabase
            .from('productos')
            .update({ es_oferta: esOferta })
            .eq('id', productoId)
            .select()

        console.log('Resultado update:', { data, error })

        if (error) throw error

        revalidatePath('/admin/ofertas')
        revalidatePath('/catalogo')

        return { success: true }
    } catch (error) {
        console.error('Error al actualizar estado de oferta:', error)
        return { success: false, error }
    }
}

/**
 * Actualiza el descuento de un producto y su estado de oferta
 */
export async function updateDescuentoOferta(productoId: string, descuento: number) {
    try {
        const { error } = await supabase
            .from('productos')
            .update({
                descuento: descuento,
                es_oferta: descuento > 0
            })
            .eq('id', productoId)

        if (error) throw error

        revalidatePath('/admin/ofertas')
        revalidatePath('/catalogo')

        return { success: true }
    } catch (error) {
        console.error('Error al actualizar descuento de oferta:', error)
        return { success: false, error }
    }
}
