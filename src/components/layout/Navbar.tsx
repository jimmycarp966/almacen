'use client'

import { useSessionStore } from '@/store/sessionStore'
import Link from 'next/link'

export function Navbar() {
    console.log('[DEBUG Navbar] Render inicial, llamando useSessionStore')
    const user = useSessionStore((state) => state.user)
    console.log('[DEBUG Navbar] user obtenido:', user)

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg group-hover:bg-primary transition-colors duration-300">
                            <span className="material-symbols-outlined text-2xl">local_mall</span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text-main">SUPER AGUILARES</h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/">Inicio</Link>
                        {user && <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/historial">Mis Pedidos</Link>}
                        <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/catalogo">Catálogo</Link>
                        {user && <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/favoritos">Favoritos</Link>}
                        {user && <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/listas">Listas</Link>}
                    </div>
                </div>
            </div>
        </nav>
    )
}
