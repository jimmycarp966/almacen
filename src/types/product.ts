/**
 * Tipos de productos para Super Aguilares
 */

export type TipoVenta = 'unidad' | 'peso'

export interface Product {
  id: string
  codigo: string
  nombre: string
  descripcion: string | null
  precio: number
  stock: number
  stock_minimo: number
  categoria_id: string
  imagen_url: string | null
  activo: boolean
  descuento?: number
  es_oferta?: boolean
  // Campos para balanza (venta por peso)
  tipo_venta: TipoVenta      // 'unidad' | 'peso'
  precio_por_kg: number | null   // solo para tipo_venta='peso'
}

export interface Categoria {
  id: string
  nombre: string
  descripcion: string | null
  activo: boolean
}

/**
 * Helper para verificar si un producto se vende por peso
 */
export function esProductoBalanza(producto: Product): boolean {
  return producto.tipo_venta === 'peso'
}

/**
 * Helper para obtener el precio de display de un producto
 * - Productos por unidad: muestra el precio unitario
 * - Productos por peso: muestra el precio por kg
 */
export function getPrecioDisplay(producto: Product): { precio: number; etiqueta: string } {
  if (esProductoBalanza(producto)) {
    return {
      precio: producto.precio_por_kg || producto.precio,
      etiqueta: '/kg'
    }
  }
  return {
    precio: producto.precio,
    etiqueta: ''
  }
}

/**
 * Helper para calcular el subtotal de un item en el carrito
 * - Productos por unidad: precio * cantidad
 * - Productos por peso: precio_por_kg * cantidad (en kg)
 */
export function calcularSubtotal(producto: Product, cantidad: number): number {
  if (esProductoBalanza(producto)) {
    return (producto.precio_por_kg || producto.precio) * cantidad
  }
  return producto.precio * cantidad
}
