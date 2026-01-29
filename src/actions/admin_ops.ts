'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getPedidosAdmin() {
    const { data, error } = await supabase
        .from('pedidos')
        .select(`
            *,
            usuarios!inner (
                nombre,
                telefono
            )
        `)
        .order('fecha_creacion', { ascending: false })

    if (error) {
        console.error('Error al obtener pedidos:', error)
        return []
    }

    // Obtener items de cada pedido
    const pedidosConItems = await Promise.all(
        (data || []).map(async (pedido) => {
            const { data: items } = await supabase
                .from('pedido_items')
                .select(`
                    *,
                    productos (
                        nombre,
                        imagen_url
                    )
                `)
                .eq('pedido_id', pedido.id)

            return {
                ...pedido,
                pedido_items: items || []
            }
        })
    )

    return pedidosConItems
}

export async function updateEstadoPedido(pedidoId: string, nuevoEstado: string) {
    const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', pedidoId)

    if (error) {
        console.error('Error al actualizar estado del pedido:', error)
        return { success: false, message: error.message }
    }

    revalidatePath('/admin/pedidos')
    return { success: true }
}
