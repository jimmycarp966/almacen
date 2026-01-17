'use server'

import { supabase } from '@/lib/supabase'

export async function getDashboardStats() {
    const { count: pedidosHoy, error: err1 } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_creacion', new Date().toISOString().split('T')[0])

    const { count: pedidosPendientes, error: err2 } = await supabase
        .from('pedidos')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'recibido')

    const { count: totalProductos, error: err3 } = await supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })

    // Obtener ventas del día
    const { data: ventasHoy, error: err4 } = await supabase
        .from('pedidos')
        .select('total')
        .gte('fecha_creacion', new Date().toISOString().split('T')[0])
        .in('estado', ['recibido', 'preparacion', 'en_camino', 'entregado'])

    const totalVentasHoy = ventasHoy?.reduce((acc, current) => acc + Number(current.total), 0) || 0

    return {
        pedidosHoy: pedidosHoy || 0,
        pedidosPendientes: pedidosPendientes || 0,
        totalProductos: totalProductos || 0,
        totalVentasHoy
    }
}
