'use client'

import { useCartStore } from '@/store/cartStore'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CartFABProps {
    className?: string
}

export function CartFAB({ className = '' }: CartFABProps) {
    const { items, getTotal } = useCartStore()
    const [mounted, setMounted] = useState(false)

    // Prevenir hidratación incorrecta
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || items.length === 0) return null

    const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

    return (
        <div className={`fixed bottom-10 right-10 z-50 group ${className}`}>
            <Link href="/carrito" className="relative w-[72px] h-[72px] bg-primary text-white rounded-full shadow-[0_8px_30px_rgb(230,0,0,0.3)] flex items-center justify-center hover:scale-110 hover:shadow-[0_8px_35px_rgb(230,0,0,0.4)] transition-all duration-300 cursor-pointer outline-none ring-0">
                <span className="material-symbols-outlined text-[32px]">shopping_cart</span>
                <span className="absolute top-0 right-0 -mt-1 -mr-1 h-7 w-7 bg-white text-primary text-sm font-extrabold flex items-center justify-center rounded-full border-2 border-primary shadow-sm">
                    {totalItems}
                </span>
            </Link>

            {/* Tooltip */}
            <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 w-max px-4 py-2 bg-black text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none shadow-lg">
                Ver Carrito (${getTotal().toLocaleString('es-AR')})
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
            </div>
        </div>
    )
}
