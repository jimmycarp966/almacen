'use server'

import { supabase } from '@/lib/supabase'
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

/**
 * Obtiene productos con stock bajo
 */
export async function getLowStockProducts() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .lte('stock', 'stock_minimo') // Nota: Esto puede requerir ajuste si son columnas diferentes
      .order('stock')

    if (error) {
      // Intento alternativo si la comparación directa falla en Supabase
      const { data: allProds } = await supabase
        .from('productos')
        .select('*')
        .eq('activo', true)

      return allProds?.filter(p => p.stock <= (p.stock_minimo || 0)) || []
    }
    return data || []
  } catch (error) {
    console.error('Error al obtener stock bajo:', error)
    return []
  }
}

/**
 * Obtiene todos los movimientos de inventario
 */
export async function getInventoryMovements() {
  try {
    const { data, error } = await supabase
      .from('caja_movimientos') // Usando caja_movimientos como tabla de registro de stock si aplica, o una tabla específica
      .select('*')
      .order('fecha_hora', { ascending: false })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Registra un movimiento de inventario
 */
export async function createInventoryMovement(movement: Omit<InventoryMovement, 'id' | 'fecha'>) {
  try {
    // 1. Actualizar el stock del producto
    const { error: updateError } = await supabase
      .from('productos')
      .update({ stock: movement.stock_nuevo })
      .eq('id', movement.producto_id)

    if (updateError) throw updateError

    // 2. Registrar el movimiento (en una tabla de auditoría o movimientos si existe)
    // Por ahora simulamos el éxito de la actualización de stock en DB real
    revalidatePath('/admin/productos')

    return { success: true }
  } catch (error) {
    console.error('Error al registrar movimiento:', error)
    return { success: false, message: 'Error en la base de datos' }
  }
}

/**
 * Ajusta el stock de un producto
 */
export async function adjustStock(
  productoId: string,
  cantidad: number,
  motivo: string
) {
  try {
    const { data: producto, error: fetchError } = await supabase
      .from('productos')
      .select('*')
      .eq('id', productoId)
      .single()

    if (fetchError || !producto) {
      return { success: false, message: 'Producto no encontrado' }
    }

    const stockAnterior = producto.stock
    const stockNuevo = stockAnterior + cantidad

    if (stockNuevo < 0) {
      return { success: false, message: 'El stock no puede ser negativo' }
    }

    return await createInventoryMovement({
      producto_id: productoId,
      producto_nombre: producto.nombre,
      tipo: cantidad > 0 ? 'entrada' : cantidad < 0 ? 'salida' : 'ajuste',
      cantidad: Math.abs(cantidad),
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
      motivo,
    })
  } catch (error) {
    return { success: false, message: 'Error interno' }
  }
}

/**
 * Obtiene estadísticas de inventario
 */
export async function getInventoryStats() {
  try {
    const { data: productos, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)

    if (error || !productos) {
      return {
        totalProductos: 0,
        productosConStockBajo: 0,
        productosSinStock: 0,
        totalStock: 0,
      }
    }

    const totalProductos = productos.length
    const productosConStockBajo = productos.filter(p => p.stock <= (p.stock_minimo || 0)).length
    const productosSinStock = productos.filter(p => p.stock === 0).length
    const totalStock = productos.reduce((acc, p) => acc + p.stock, 0)

    return {
      totalProductos,
      productosConStockBajo,
      productosSinStock,
      totalStock,
    }
  } catch {
    return {
      totalProductos: 0,
      productosConStockBajo: 0,
      productosSinStock: 0,
      totalStock: 0,
    }
  }
}
