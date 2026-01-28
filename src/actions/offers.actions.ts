'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

/**
 * Obtiene todos los productos con su estado de oferta
 */
export async function getAdminProductosOferta() {
    try {
        const { data, error } = await supabase
            .from('productos')
            .select('id, nombre, precio, imagen_url, es_oferta, descuento, activo')
            .eq('activo', true)
            .order('nombre', { ascending: true })

        if (error) throw error
        return data || []
    } catch (error) {
        console.error('Error al obtener productos para ofertas:', error)
        return []
    }
}

/**
 * Alterna el estado de oferta de un producto
 */
export async function toggleOfertaProducto(productoId: string, esOferta: boolean) {
    try {
        const { error } = await supabase
            .from('productos')
            .update({ es_oferta: esOferta })
            .eq('id', productoId)

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
