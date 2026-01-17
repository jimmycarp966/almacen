'use server'

import { mockPedidos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'

export async function getPedidosAdmin() {
    // Usar datos mock
    return mockPedidos
}

export async function updateEstadoPedido(pedidoId: string, nuevoEstado: string) {
    // Usar datos mock - simular actualización
    const pedido = mockPedidos.find(p => p.id === pedidoId)
    if (!pedido) return { success: false, message: 'Pedido no encontrado' }

    revalidatePath('/admin/pedidos')
    revalidatePath('/admin/caja')

    return { success: true }
}

// Caja
export async function getCajaActual() {
    // Usar datos mock - simular caja abierta
    return {
        id: '1',
        monto_apertura: 1000,
        saldo_actual: 2500,
        estado: 'abierta',
        fecha_apertura: new Date().toISOString(),
    }
}

export async function abrirCaja(montoInicial: number, usuarioId: string) {
    // Usar datos mock - simular apertura de caja
    return {
        data: {
            id: '1',
            monto_apertura: montoInicial,
            saldo_actual: montoInicial,
            estado: 'abierta',
            fecha_apertura: new Date().toISOString(),
        },
        error: null
    }
}
