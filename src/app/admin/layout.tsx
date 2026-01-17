'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Footer } from '@/components/layout/Footer'

const MENU_ITEMS = [
    { label: 'Dashboard', icon: 'dashboard', href: '/admin' },
    { label: 'Pedidos', icon: 'shopping_bag', href: '/admin/pedidos' },
    { label: 'Productos', icon: 'inventory_2', href: '/admin/productos' },
    { label: 'Caja Diaria', icon: 'account_balance_wallet', href: '/admin/caja' },
    { label: 'Reportes', icon: 'analytics', href: '/admin/reportes' },
    { label: 'Configuración', icon: 'settings', href: '/admin/configuracion' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const user = useSessionStore((state) => state.user)
    const clearSession = useSessionStore((state) => state.clearSession)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = () => {
        clearSession()
        router.push('/')
    }

    if (!mounted) return null

    // Protección básica de ruta admin (en un caso real usaríamos middleware y JWT verificado)
    if (!user || user.rol !== 'admin') {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-50">
                <div className="p-8 border-b border-gray-50 mb-4">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl">
                            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-text-main">ADMIN PANEL</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group font-bold tracking-tight ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-main'
                                    }`}
                            >
                                <span className={`material-symbols-outlined transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 border-t border-gray-50 mt-auto">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {user.nombre.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-main truncate">{user.nombre}</p>
                            <p className="text-xs text-text-secondary truncate capitalize">{user.rol}</p>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pl-72">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-10 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-main">
                        {MENU_ITEMS.find(i => i.href === pathname)?.label || 'Admin'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        <p className="text-sm font-bold text-text-main">{new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </header>

                <div className="p-10">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}
