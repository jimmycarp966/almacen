'use client'

import { useCartStore, CartItem } from '@/store/cartStore'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CartSidebarProps {
    className?: string
}

function CartItemRow({ item }: { item: CartItem }) {
    const { updateQuantity, removeItem } = useCartStore()

    return (
        <div className="flex gap-4">
            {/* Thumbnail */}
            <div className="size-20 min-w-20 bg-white rounded-lg border border-gray-100 overflow-hidden">
                {item.imagen_url ? (
                    <div
                        className="w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: `url("${item.imagen_url}")` }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                        <span className="material-symbols-outlined text-gray-300 text-2xl">inventory_2</span>
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-col flex-1 justify-between py-1">
                <div>
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-text-main leading-tight">{item.nombre}</h4>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-200 rounded-md bg-white h-8">
                        <button
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-l-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xs">remove</span>
                        </button>
                        <span className="text-xs font-bold px-2 min-w-[20px] text-center">{item.cantidad}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-r-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xs">add</span>
                        </button>
                    </div>

                    {/* Price */}
                    <span className="font-bold text-sm">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function CartSidebar({ className = '' }: CartSidebarProps) {
    const { items, getTotal } = useCartStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <aside className={`w-full lg:w-[400px] lg:min-w-[400px] bg-surface border-l border-gray-100 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-hidden flex flex-col shadow-2xl shadow-gray-200/50 z-40 ${className}`}>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </aside>
        )
    }

    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)
    const subtotal = getTotal()
    const impuestos = Math.round(subtotal * 0.16)
    const total = subtotal + impuestos

    return (
        <aside className={`w-full lg:w-[400px] lg:min-w-[400px] bg-surface border-l border-gray-100 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-hidden flex flex-col shadow-2xl shadow-gray-200/50 z-40 ${className}`}>
            {/* Sidebar Header */}
            <div className="p-6 pb-4 border-b border-gray-200/60">
                <div className="flex items-center justify-between mb-1">
                    <h2 className="text-2xl font-black text-text-main tracking-tight">Mi Pedido</h2>
                    <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                        {totalItems} ítems
                    </span>
                </div>
            </div>

            {/* Cart Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart</span>
                        <h3 className="text-lg font-bold text-text-main mb-2">Tu carrito está vacío</h3>
                        <p className="text-sm text-text-secondary max-w-[200px]">
                            ¡Aún no tienes productos! Explora el catálogo y agrega artículos para comenzar tu pedido.
                        </p>
                    </div>
                ) : (
                    items.map((item) => (
                        <CartItemRow key={item.id} item={item} />
                    ))
                )}
            </div>

            {/* Footer / Totals */}
            <div className="bg-white border-t border-gray-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm text-text-secondary">
                        <span>Subtotal</span>
                        <span className="font-medium text-text-main">${subtotal.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-text-secondary">
                        <span>Impuestos (16%)</span>
                        <span className="font-medium text-text-main">${impuestos.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 my-2"></div>
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold text-text-main">Total a Pagar</span>
                        <span className="text-2xl font-black text-text-main tracking-tight">
                            ${total.toLocaleString('es-AR')}
                        </span>
                    </div>
                </div>

                <Link
                    href="/carrito"
                    className={`w-full font-bold text-base py-4 px-6 rounded-xl shadow-lg transition-all flex justify-between items-center group ${items.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                            : 'bg-primary hover:bg-primary-dark text-white shadow-primary/30 hover:translate-y-[-2px] active:translate-y-[0px]'
                        }`}
                    onClick={(e) => items.length === 0 && e.preventDefault()}
                >
                    <span>Confirmar Pedido</span>
                    <span className={`p-1 rounded-md transition-colors ${items.length === 0 ? 'bg-gray-400/20' : 'bg-white/20 group-hover:bg-white/30'
                        }`}>
                        <span className="material-symbols-outlined block text-sm">arrow_forward</span>
                    </span>
                </Link>

                {items.length === 0 && (
                    <p className="text-xs text-center text-text-secondary mt-3">
                        Agrega al menos un producto para continuar
                    </p>
                )}
            </div>
        </aside>
    )
}
