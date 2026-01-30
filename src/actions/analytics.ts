'use server'

import { mockPedidos, mockProductos } from '@/lib/mockData'

export interface SalesMetrics {
  totalVentas: number
  totalPedidos: number
  promedioPedido: number
  crecimiento: number
}

export interface TopProduct {
  id: string
  nombre: string
  cantidad: number
  total: number
  imagen_url: string | null
}

export interface FrequentClient {
  id: string
  nombre: string
  telefono: string
  totalPedidos: number
  totalGastado: number
  ultimoPedido: string
}

export interface SalesByPeriod {
  periodo: string
  ventas: number
  pedidos: number
}

/**
 * Obtiene métricas de ventas para un período específico
 */
export async function getSalesMetrics(periodo: 'hoy' | 'semana' | 'mes' | 'anio' = 'hoy') {
  const now = new Date()
  let startDate: Date

  switch (periodo) {
    case 'hoy':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'semana':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case 'mes':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'anio':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
  }

  const pedidosPeriodo = mockPedidos.filter(p => new Date(p.fecha_creacion) >= startDate)
  const totalVentas = pedidosPeriodo.reduce((acc, p) => acc + p.total, 0)
  const totalPedidos = pedidosPeriodo.length
  const promedioPedido = totalPedidos > 0 ? totalVentas / totalPedidos : 0

  // Calcular crecimiento comparando con el período anterior
  const previousStartDate = new Date(startDate)
  const previousEndDate = new Date(startDate)
  previousStartDate.setDate(previousStartDate.getDate() - (periodo === 'hoy' ? 1 : periodo === 'semana' ? 7 : periodo === 'mes' ? 30 : 365))
  
  const pedidosAnteriores = mockPedidos.filter(p => {
    const fecha = new Date(p.fecha_creacion)
    return fecha >= previousStartDate && fecha < previousEndDate
  })
  const ventasAnteriores = pedidosAnteriores.reduce((acc, p) => acc + p.total, 0)
  const crecimiento = ventasAnteriores > 0 ? ((totalVentas - ventasAnteriores) / ventasAnteriores) * 100 : 0

  return {
    totalVentas,
    totalPedidos,
    promedioPedido,
    crecimiento,
  }
}

/**
 * Obtiene los productos más vendidos
 */
export async function getTopProducts(limit: number = 10, periodo: 'hoy' | 'semana' | 'mes' | 'anio' = 'mes') {
  const now = new Date()
  let startDate: Date

  switch (periodo) {
    case 'hoy':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      break
    case 'semana':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case 'mes':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      break
    case 'anio':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
  }

  const pedidosPeriodo = mockPedidos.filter(p => new Date(p.fecha_creacion) >= startDate)
  const ventasPorProducto = new Map<string, { cantidad: number; total: number }>()

  pedidosPeriodo.forEach(pedido => {
    pedido.pedido_items.forEach((item: any) => {
      const productoId = item.id
      const cantidad = item.cantidad
      const total = item.precio_unitario * cantidad

      if (ventasPorProducto.has(productoId)) {
        const actual = ventasPorProducto.get(productoId)!
        ventasPorProducto.set(productoId, {
          cantidad: actual.cantidad + cantidad,
          total: actual.total + total,
        })
      } else {
        ventasPorProducto.set(productoId, { cantidad, total })
      }
    })
  })

  const topProducts: TopProduct[] = Array.from(ventasPorProducto.entries())
    .map(([id, data]) => {
      const producto = mockProductos.find(p => p.id === id)
      return {
        id,
        nombre: producto?.nombre || 'Producto desconocido',
        cantidad: data.cantidad,
        total: data.total,
        imagen_url: producto?.imagen_url || null,
      }
    })
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, limit)

  return topProducts
}

/**
 * Obtiene los clientes más frecuentes
 */
export async function getFrequentClients(limit: number = 10) {
  const ventasPorCliente = new Map<string, { pedidos: number; total: number; ultimoPedido: Date; nombre: string; telefono: string }>()

  mockPedidos.forEach(pedido => {
    const clienteTelefono = pedido.usuarios?.telefono || 'unknown'
    const fecha = new Date(pedido.fecha_creacion)

    if (ventasPorCliente.has(clienteTelefono)) {
      const actual = ventasPorCliente.get(clienteTelefono)!
      ventasPorCliente.set(clienteTelefono, {
        pedidos: actual.pedidos + 1,
        total: actual.total + pedido.total,
        ultimoPedido: fecha > actual.ultimoPedido ? fecha : actual.ultimoPedido,
        nombre: actual.nombre,
        telefono: actual.telefono,
      })
    } else {
      ventasPorCliente.set(clienteTelefono, {
        pedidos: 1,
        total: pedido.total,
        ultimoPedido: fecha,
        nombre: pedido.usuarios?.nombre || 'Cliente desconocido',
        telefono: pedido.usuarios?.telefono || '',
      })
    }
  })

  const frequentClients: FrequentClient[] = Array.from(ventasPorCliente.entries())
    .map(([telefono, data]) => {
      return {
        id: telefono,
        nombre: data.nombre,
        telefono: data.telefono,
        totalPedidos: data.pedidos,
        totalGastado: data.total,
        ultimoPedido: data.ultimoPedido.toISOString(),
      }
    })
    .sort((a, b) => b.totalGastado - a.totalGastado)
    .slice(0, limit)

  return frequentClients
}

/**
 * Obtiene ventas por período para gráficos
 */
export async function getSalesByPeriod(periodo: 'diario' | 'semanal' | 'mensual' = 'diario', dias: number = 30) {
  const salesByPeriod: SalesByPeriod[] = []
  const now = new Date()

  for (let i = dias - 1; i >= 0; i--) {
    const fecha = new Date(now)
    fecha.setDate(fecha.getDate() - i)

    let startDate: Date
    let endDate: Date
    let label: string

    switch (periodo) {
      case 'diario':
        startDate = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
        endDate = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1)
        label = fecha.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
        break
      case 'semanal':
        const diaSemana = fecha.getDay()
        startDate = new Date(fecha)
        startDate.setDate(fecha.getDate() - diaSemana)
        endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + 7)
        label = `Sem ${Math.ceil(fecha.getDate() / 7)}`
        break
      case 'mensual':
        startDate = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
        endDate = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1)
        label = fecha.toLocaleDateString('es-AR', { month: 'short' })
        break
    }

    const pedidosPeriodo = mockPedidos.filter(p => {
      const fechaPedido = new Date(p.fecha_creacion)
      return fechaPedido >= startDate && fechaPedido < endDate
    })

    const ventas = pedidosPeriodo.reduce((acc, p) => acc + p.total, 0)
    const pedidos = pedidosPeriodo.length

    salesByPeriod.push({
      periodo: label,
      ventas,
      pedidos,
    })
  }

  return salesByPeriod
}

/**
 * Obtiene un reporte completo de ventas
 */
export async function getCompleteSalesReport(periodo: 'hoy' | 'semana' | 'mes' | 'anio' = 'mes') {
  const [metrics, topProducts, frequentClients, salesByPeriod] = await Promise.all([
    getSalesMetrics(periodo),
    getTopProducts(10, periodo),
    getFrequentClients(10),
    getSalesByPeriod('diario', 30),
  ])

  return {
    metrics,
    topProducts,
    frequentClients,
    salesByPeriod,
  }
}
