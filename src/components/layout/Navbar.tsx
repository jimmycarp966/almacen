'use client'

import { useSessionStore } from '@/store/sessionStore'
import Link from 'next/link'
import { useState } from 'react'

export function Navbar() {
    const user = useSessionStore((state) => state.user)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const clearSession = useSessionStore((state) => state.clearSession)

    const handleLogout = () => {
        clearSession()
        setShowUserMenu(false)
        window.location.href = '/'
    }

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg group-hover:bg-primary transition-colors duration-300">
                            <span className="material-symbols-outlined text-2xl">local_mall</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-text-main">SUPER AGUILARES</h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/">Inicio</Link>
                        {user && <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/historial">Mis Pedidos</Link>}
                        <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/catalogo">Catálogo</Link>
                        {user && <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/favoritos">Favoritos</Link>}
                        {user && <Link className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors" href="/listas">Listas</Link>}
                    </div>

                    {/* Utilities */}
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-text-main">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => user && setShowUserMenu(!showUserMenu)}
                                className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-text-main flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">person</span>
                                {user && <span className="hidden sm:inline text-sm font-bold">{user.nombre.split(' ')[0]}</span>}
                            </button>
                            {showUserMenu && user && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                                            {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
                                        </p>
                                        <p className="text-sm text-text-main font-medium">{user.nombre}</p>
                                        <p className="text-xs text-text-secondary">{user.telefono}</p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-3 flex items-center gap-3 text-text-main hover:bg-red-50 hover:text-red-700 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                        <span className="text-sm font-bold">Cerrar Sesión</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
