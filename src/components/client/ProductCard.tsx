'use client'

import { useCartStore, TipoVenta } from '@/store/cartStore'
import { useState } from 'react'
import { FavoriteButton } from './FavoriteButton'

interface ProductCardProps {
    id: string
    nombre: string
    descripcion: string
    precio: number
    imagen_url: string | null
    categoria_id: string
    esNuevo?: boolean
    descuento?: number
    listMode?: boolean
    tipo_venta?: TipoVenta
    precio_por_kg?: number | null
    ofertaDestacada?: boolean  // Nuevo: estilo especial para ofertas destacadas
}

export function ProductCard({
    id,
    nombre,
    descripcion,
    precio,
    imagen_url,
    categoria_id,
    esNuevo,
    descuento,
    listMode = false,
    tipo_venta = 'unidad',
    precio_por_kg,
    ofertaDestacada
}: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const items = useCartStore((state) => state.items)

    const [isAdding, setIsAdding] = useState(false)
    const [weightAmount, setWeightAmount] = useState(0.5)
    const [showWeightInput, setShowWeightInput] = useState(false)

    const cartItem = items.find((i) => i.id === id)
    const quantity = cartItem?.cantidad || 0

    const esBalanza = tipo_venta === 'peso'
    const precioDisplay = esBalanza ? (precio_por_kg || precio) : precio
    const precioLabel = esBalanza ? '/kg' : ''

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (esBalanza) {
            setIsAdding(true)
            addItem({
                id,
                nombre,
                precio: precioDisplay,
                cantidad: weightAmount,
                imagen_url: null,
                tipo_venta: 'peso'
            })
            setTimeout(() => setIsAdding(false), 300)
        } else {
            setIsAdding(true)
            addItem({ id, nombre, precio, cantidad: 1, imagen_url: null, tipo_venta: 'unidad' })
            setTimeout(() => setIsAdding(false), 300)
        }
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (quantity > 1) {
            updateQuantity(id, quantity - 1)
        } else {
            removeItem(id)
        }
    }

    // Modo lista
    if (listMode) {
        return (
            <div className={`flex items-center justify-between rounded-xl p-3 sm:p-4 transition-all min-w-0 ${ofertaDestacada ? 'bg-white/10 hover:bg-white/15' : 'bg-white hover:bg-gray-50'}`}>
                <div className="flex-1 min-w-0 pr-2 sm:pr-4">
                    <h3 className={`text-sm sm:text-base font-bold truncate ${ofertaDestacada ? 'text-white' : 'text-text-main'}`}>{nombre}</h3>
                    {descripcion && (
                        <p className={`text-xs truncate ${ofertaDestacada ? 'text-white/70' : 'text-text-secondary'}`}>{descripcion}</p>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="text-right">
                        <span className={`text-base sm:text-lg font-extrabold block ${ofertaDestacada ? 'text-white' : 'text-text-main'}`}>
                            ${precioDisplay.toLocaleString('es-AR')}{precioLabel}
                        </span>
                    </div>

                    <div className={`flex items-center rounded-lg overflow-hidden ${ofertaDestacada ? 'bg-white/20' : 'bg-gray-100/50'}`}>
                        {quantity > 0 ? (
                            <>
                                <button
                                    onClick={handleRemove}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-lg transition-colors ${ofertaDestacada ? 'bg-white/30 hover:bg-white/40 text-white' : 'bg-white hover:bg-gray-200 text-text-main'}`}
                                >
                                    -
                                </button>
                                <span className={`w-10 h-8 sm:h-10 flex items-center justify-center bg-transparent font-bold text-sm ${ofertaDestacada ? 'text-white' : 'text-text-main'}`}>
                                    {esBalanza ? `${(quantity * 1000).toFixed(0)}g` : quantity}
                                </span>
                                <button
                                    onClick={handleAdd}
                                    className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-primary hover:bg-red-700 text-white font-bold text-lg transition-colors"
                                >
                                    +
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleAdd}
                                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-primary hover:bg-red-700 text-white font-bold text-lg transition-colors"
                            >
                                +
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return null  // Ya no se usa modo con imagen
}
