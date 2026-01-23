'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
    const router = useRouter()

    useEffect(() => {
        // Redirigir automáticamente al catálogo
        // Los clientes ya no necesitan autenticarse
        router.replace('/catalogo')
    }, [router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full animate-pulse">
                    <span className="material-symbols-outlined text-white text-3xl">shopping_cart</span>
                </div>
                <p className="text-text-secondary font-medium">Cargando catálogo...</p>
            </div>
        </div>
    )
}
