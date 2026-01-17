'use server'

import { mockPedidos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const orderSchema = z.object({
    cliente_id: z.string(),
    items: z.array(z.object({
        producto_id: z.string(),
        cantidad: z.number().positive(),
        precio_unitario: z.number().positive()
    })),
    subtotal: z.number(),
    recargo: z.number(),
    total: z.number(),
    metodo_pago: z.string(),
    cuotas: z.number().int().optional(),
    datos_entrega: z.object({
        direccion: z.string().min(5)
    }),
    comprobante_url: z.string().nullable().optional()
})

interface OrderData extends z.infer<typeof orderSchema> { }

export async function createPedidoAction(data: OrderData) {
    try {
        const validatedData = orderSchema.parse(data)

        // Usar datos mock - simular creación de pedido
        const newOrderId = 'PED-2026-' + String(mockPedidos.length + 1).padStart(3, '0')

        revalidatePath('/admin/pedidos')

        return {
            success: true,
            orderId: newOrderId,
            numeroPedido: newOrderId
        }
    } catch (err) {
        console.error('Error inesperado en createPedidoAction:', err)
        return { success: false, message: 'Ocurrió un error inesperado al procesar tu solicitud' }
    }
}

export async function getPedido(id: string) {
    // Usar datos mock - si no encuentra el ID, devuelve el primer pedido para demo
    const pedido = mockPedidos.find(p => p.id === id)
    if (pedido) return pedido

    // Para demo, devolver el primer pedido mock si no se encuentra
    return mockPedidos[0] || null
}

export async function getPedidosCliente(clienteId: string) {
    // Usar datos mock - para demo devolvemos todos los pedidos
    return mockPedidos
}
