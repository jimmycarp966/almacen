'use server'

import { mockPagos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'

export async function getPagosPendientes() {
    // Usar datos mock - filtrar pagos pendientes
    return mockPagos.filter(p => p.estado === 'pendiente')
}

export async function aprobarPago(pedidoId: string) {
    // Usar datos mock - simular aprobación
    revalidatePath('/admin/pagos')
    revalidatePath('/admin/pedidos')

    return { error: null }
}

export async function rechazarPago(pedidoId: string, motivo: string) {
    // Usar datos mock - simular rechazo
    revalidatePath('/admin/pagos')

    return { error: null }
}
