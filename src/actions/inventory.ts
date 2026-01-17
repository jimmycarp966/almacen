'use server'

import { mockProductos } from '@/lib/mockData'
import { revalidatePath } from 'next/cache'

export interface InventoryMovement {
  id: string
  producto_id: string
  producto_nombre: string
  tipo: 'entrada' | 'salida' | 'ajuste'
  cantidad: number
  stock_anterior: number
  stock_nuevo: number
  motivo: string
  fecha: string
}

// Mock data para movimientos de inventario
const mockMovimientosInventario: InventoryMovement[] = [
  {
    id: '1',
    producto_id: '1',
    producto_nombre: 'Arroz Gallo Oro 1kg',
    tipo: 'entrada',
    cantidad: 20,
    stock_anterior: 30,
    stock_nuevo: 50,
    motivo: 'Reposición de stock',
    fecha: '2026-01-15T09:00:00',
  },
  {
    id: '2',
    producto_id: '5',
    producto_nombre: 'Carne Vacuna 1kg',
    tipo: 'salida',
    cantidad: 5,
    stock_anterior: 35,
    stock_nuevo: 30,
    motivo: 'Venta PED-2026-001',
    fecha: '2026-01-15T10:30:00',
  },
  {
    id: '3',
    producto_id: '3',
    producto_nombre: 'Yerba Mate Playadito 500g',
    tipo: 'salida',
    cantidad: 2,
    stock_anterior: 62,
    stock_nuevo: 60,
    motivo: 'Venta PED-2026-001',
    fecha: '2026-01-15T10:30:00',
  },
  {
    id: '4',
    producto_id: '1',
    producto_nombre: 'Arroz Gallo Oro 1kg',
    tipo: 'ajuste',
    cantidad: -5,
    stock_anterior: 55,
    stock_nuevo: 50,
    motivo: 'Ajuste de inventario',
    fecha: '2026-01-14T16:00:00',
  },
  {
    id: '5',
    producto_id: '6',
    producto_nombre: 'Coca-Cola 2.25L',
    tipo: 'entrada',
    cantidad: 30,
    stock_anterior: 60,
    stock_nuevo: 90,
    motivo: 'Reposición de stock',
    fecha: '2026-01-14T14:00:00',
  },
]

/**
 * Obtiene productos con stock bajo
 */
export async function getLowStockProducts() {
  return mockProductos.filter(p => p.stock <= (p.stock_minimo || 0))
}

/**
 * Obtiene todos los movimientos de inventario
 */
export async function getInventoryMovements() {
  return mockMovimientosInventario.sort((a, b) => 
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  )
}

/**
 * Registra un movimiento de inventario
 */
export async function createInventoryMovement(movement: Omit<InventoryMovement, 'id' | 'fecha'>) {
  const producto = mockProductos.find(p => p.id === movement.producto_id)
  if (!producto) {
    return { success: false, message: 'Producto no encontrado' }
  }

  const nuevoMovimiento: InventoryMovement = {
    ...movement,
    id: `${Date.now()}`,
    fecha: new Date().toISOString(),
  }

  mockMovimientosInventario.push(nuevoMovimiento)

  // Actualizar stock del producto
  producto.stock = movement.stock_nuevo

  return { success: true, movement: nuevoMovimiento }
}

/**
 * Ajusta el stock de un producto
 */
export async function adjustStock(
  productoId: string,
  cantidad: number,
  motivo: string
) {
  const producto = mockProductos.find(p => p.id === productoId)
  if (!producto) {
    return { success: false, message: 'Producto no encontrado' }
  }

  const stockAnterior = producto.stock
  const stockNuevo = stockAnterior + cantidad

  if (stockNuevo < 0) {
    return { success: false, message: 'El stock no puede ser negativo' }
  }

  const tipo: 'entrada' | 'salida' | 'ajuste' = cantidad > 0 ? 'entrada' : cantidad < 0 ? 'salida' : 'ajuste'

  const movimiento = await createInventoryMovement({
    producto_id: productoId,
    producto_nombre: producto.nombre,
    tipo,
    cantidad: Math.abs(cantidad),
    stock_anterior: stockAnterior,
    stock_nuevo: stockNuevo,
    motivo,
  })

  return movimiento
}

/**
 * Obtiene estadísticas de inventario
 */
export async function getInventoryStats() {
  const totalProductos = mockProductos.length
  const productosConStockBajo = mockProductos.filter(p => p.stock <= (p.stock_minimo || 0)).length
  const productosSinStock = mockProductos.filter(p => p.stock === 0).length
  const totalStock = mockProductos.reduce((acc, p) => acc + p.stock, 0)

  return {
    totalProductos,
    productosConStockBajo,
    productosSinStock,
    totalStock,
  }
}
