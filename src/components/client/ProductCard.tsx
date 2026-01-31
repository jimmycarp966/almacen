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
    const [isEditingQty, setIsEditingQty] = useState(false)
    const [editQtyValue, setEditQtyValue] = useState('')

    const cartItem = items.find((i) => i.id === id)
    const quantity = cartItem?.cantidad || 0

    const esBalanza = tipo_venta === 'peso'
    const precioDisplay = esBalanza ? (precio_por_kg || precio) : precio
    const precioLabel = esBalanza ? '/kg' : ''

    // Acortar nombre si es muy largo
    const displayName = nombre.length > 45
        ? nombre.substring(0, 42) + '...'
        : nombre

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
        if (esBalanza) {
            // Para balanza, restar 100g (0.1kg), mínimo 0.1kg
            const nuevaCantidad = Math.max(0.1, quantity - 0.1)
            updateQuantity(id, parseFloat(nuevaCantidad.toFixed(3)))
        } else {
            if (quantity > 1) {
                updateQuantity(id, quantity - 1)
            } else {
                removeItem(id)
            }
        }
    }

    const handleStartEditQty = () => {
        setIsEditingQty(true)
        if (esBalanza) {
            // Mostrar en gramos para editar
            setEditQtyValue(Math.round(quantity * 1000).toString())
        } else {
            setEditQtyValue(quantity.toString())
        }
    }

    const handleSaveQty = () => {
        const newValue = parseFloat(editQtyValue)
        if (!isNaN(newValue) && newValue > 0) {
            if (esBalanza) {
                // Convertir gramos a kg
                const kgValue = Math.max(0.01, newValue / 1000)
                updateQuantity(id, parseFloat(kgValue.toFixed(3)))
            } else {
                updateQuantity(id, Math.max(1, Math.round(newValue)))
            }
        }
        setIsEditingQty(false)
    }

    const handleQtyKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveQty()
        } else if (e.key === 'Escape') {
            setIsEditingQty(false)
        }
    }

    // Modo lista
    if (listMode) {
        return (
            <div className={`flex items-center justify-between rounded-xl p-2.5 sm:p-3 transition-all ${ofertaDestacada ? 'bg-white/10 hover:bg-white/15' : 'bg-white hover:bg-gray-50'}`}>
                <div className="flex-1 min-w-0 pr-2 sm:pr-3">
                    <h3
                        className={`text-sm sm:text-base font-bold truncate leading-tight ${ofertaDestacada ? 'text-white' : 'text-text-main'}`}
                        title={nombre}
                    >
                        {displayName}
                    </h3>
                    {descripcion && descripcion.length > 0 && (
                        <p className={`text-xs truncate ${ofertaDestacada ? 'text-white/70' : 'text-text-secondary'}`} title={descripcion}>
                            {descripcion.length > 35 ? descripcion.substring(0, 32) + '...' : descripcion}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="text-right min-w-[60px] sm:min-w-[70px]">
                        <span className={`text-sm sm:text-base font-extrabold block ${ofertaDestacada ? 'text-white' : 'text-text-main'}`}>
                            ${precioDisplay.toLocaleString('es-AR')}{precioLabel}
                        </span>
                    </div>

                    <div className={`flex items-center rounded-lg overflow-hidden ${ofertaDestacada ? 'bg-white/20' : 'bg-gray-100/50'}`}>
                        {quantity > 0 ? (
                            <>
                                <button
                                    onClick={handleRemove}
                                    className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center font-bold text-base transition-colors ${ofertaDestacada ? 'bg-white/30 hover:bg-white/40 text-white' : 'bg-white hover:bg-gray-200 text-text-main'}`}
                                >
                                    -
                                </button>
                                {isEditingQty ? (
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={editQtyValue}
                                            onChange={(e) => setEditQtyValue(e.target.value)}
                                            onBlur={handleSaveQty}
                                            onKeyDown={handleQtyKeyPress}
                                            className="w-12 sm:w-14 h-full text-center text-xs font-bold border-0 focus:outline-none focus:ring-1 focus:ring-primary"
                                            autoFocus
                                            min={esBalanza ? 10 : 1}
                                            step={esBalanza ? 10 : 1}
                                        />
                                        <span className={`text-xs px-1 ${ofertaDestacada ? 'text-white/70' : 'text-gray-500'}`}>
                                            {esBalanza ? 'g' : 'u'}
                                        </span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleStartEditQty}
                                        className={`w-10 sm:w-12 h-7 sm:h-9 flex items-center justify-center bg-transparent font-bold text-xs hover:bg-white/20 transition-colors ${ofertaDestacada ? 'text-white' : 'text-text-main'}`}
                                    >
                                        {esBalanza ? `${(quantity * 1000).toFixed(0)}g` : quantity}
                                    </button>
                                )}
                                <button
                                    onClick={handleAdd}
                                    className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-primary hover:bg-red-700 text-white font-bold text-base transition-colors"
                                >
                                    +
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleAdd}
                                className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-primary hover:bg-red-700 text-white font-bold text-base transition-colors"
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
