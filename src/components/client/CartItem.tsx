'use client'

import { useCartStore, CartItem as CartItemType, TipoVenta } from '@/store/cartStore'
import { useState } from 'react'

interface CartItemProps {
    item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore()
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState('')

    const esBalanza = item.tipo_venta === 'peso'

    // Función para formatear cantidad
    const formatCantidad = (cantidad: number, tipo?: TipoVenta): string => {
        if (tipo === 'peso') {
            // Para productos de balanza, mostrar en kg o gramos
            if (cantidad < 1) {
                const grams = Math.round(cantidad * 1000)
                return `${grams}g`
            }
            return `${cantidad.toFixed(2).replace(/\.?0+$/, '')}kg`
        }
        // Para productos por unidad, mostrar entero
        return cantidad.toString()
    }

    const handleDecrease = () => {
        if (esBalanza) {
            // Para balanza, restar 100g (0.1kg)
            const nuevaCantidad = Math.max(0.1, item.cantidad - 0.1)
            updateQuantity(item.id, parseFloat(nuevaCantidad.toFixed(3)))
        } else {
            updateQuantity(item.id, item.cantidad - 1)
        }
    }

    const handleIncrease = () => {
        if (esBalanza) {
            // Para balanza, sumar 100g (0.1kg)
            const nuevaCantidad = item.cantidad + 0.1
            updateQuantity(item.id, parseFloat(nuevaCantidad.toFixed(3)))
        } else {
            updateQuantity(item.id, item.cantidad + 1)
        }
    }

    const handleStartEdit = () => {
        setIsEditing(true)
        if (esBalanza) {
            // Mostrar en gramos para editar
            setEditValue(Math.round(item.cantidad * 1000).toString())
        } else {
            setEditValue(item.cantidad.toString())
        }
    }

    const handleSaveEdit = () => {
        const newValue = parseFloat(editValue)
        if (!isNaN(newValue) && newValue > 0) {
            if (esBalanza) {
                // Convertir gramos a kg
                const kgValue = Math.max(0.01, newValue / 1000)
                updateQuantity(item.id, parseFloat(kgValue.toFixed(3)))
            } else {
                updateQuantity(item.id, Math.max(1, Math.round(newValue)))
            }
        }
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveEdit()
        } else if (e.key === 'Escape') {
            handleCancelEdit()
        }
    }

    // Acortar nombre si es muy largo
    const displayName = item.nombre.length > 35
        ? item.nombre.substring(0, 32) + '...'
        : item.nombre

    return (
        <div className="flex gap-4 group animate-fade-in-up">
            <div className="flex flex-col flex-1 justify-between py-1">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <h4
                                className="font-bold text-sm text-text-main leading-tight group-hover:text-primary transition-colors"
                                title={item.nombre}
                            >
                                {displayName}
                            </h4>
                            {esBalanza && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full flex-shrink-0">
                                    Balanza
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-primary transition-colors flex-shrink-0"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                        Precio unitario: ${item.precio.toLocaleString('es-AR')}{esBalanza ? '/kg' : ''}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white h-9">
                        <button
                            onClick={handleDecrease}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-l-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        {isEditing ? (
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={handleSaveEdit}
                                    onKeyDown={handleKeyPress}
                                    className="w-16 h-full text-center text-xs font-bold border-0 focus:outline-none focus:ring-1 focus:ring-primary"
                                    autoFocus
                                    min={esBalanza ? 10 : 1}
                                    step={esBalanza ? 10 : 1}
                                />
                                <span className="text-xs text-gray-500 pr-2">
                                    {esBalanza ? 'g' : 'u'}
                                </span>
                            </div>
                        ) : (
                            <button
                                onClick={handleStartEdit}
                                className="px-2 h-full text-xs font-bold text-center min-w-[50px] hover:bg-gray-50 transition-colors cursor-text"
                            >
                                {formatCantidad(item.cantidad, item.tipo_venta)}
                            </button>
                        )}
                        <button
                            onClick={handleIncrease}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-r-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                    </div>
                    <span className="font-bold text-sm text-text-main flex-shrink-0">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                </div>
            </div>
        </div>
    )
}
