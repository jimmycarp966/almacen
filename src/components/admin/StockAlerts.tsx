'use client'

import { getLowStockProducts } from '@/actions/inventory'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface LowStockProduct {
  id: string
  nombre: string
  stock: number
  stock_minimo: number
  imagen_url: string | null
}

export function StockAlerts() {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLowStockProducts()
  }, [])

  const loadLowStockProducts = async () => {
    setLoading(true)
    try {
      const products = await getLowStockProducts()
      setLowStockProducts(products)
    } catch (error) {
      console.error('Error cargando alertas de stock:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return null
  }

  if (lowStockProducts.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
        <div>
          <h3 className="text-lg font-bold text-text-main">Alertas de Stock Bajo</h3>
          <p className="text-sm text-text-secondary">{lowStockProducts.length} productos necesitan atención</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lowStockProducts.map((product) => (
          <div key={product.id} className="bg-background-light rounded-xl p-4 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 bg-gray-200 rounded-lg bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url('${product.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-text-main truncate">{product.nombre}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    Stock: {product.stock}
                  </span>
                  <span className="text-xs text-text-secondary">
                    Mín: {product.stock_minimo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Link
          href="/admin/inventario"
          className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1"
        >
          Ver inventario completo
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  )
}
