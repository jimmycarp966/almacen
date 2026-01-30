'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const MENU_ITEMS = [
    { label: 'Pedidos', icon: 'shopping_bag', href: '/admin/pedidos' },
    { label: 'Productos', icon: 'inventory_2', href: '/admin/productos' },
    { label: 'Ofertas', icon: 'local_offer', href: '/admin/ofertas' },
]

// Componente interno que maneja la sesión de forma segura
function AdminContent({ children }: { children: React.ReactNode }) {
    console.log('[DEBUG AdminContent] Render start')
    const pathname = usePathname()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [dateDisplay, setDateDisplay] = useState('')
    const [sessionData, setSessionData] = useState<{ nombre: string; rol: string } | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

    // Efecto de montaje para evitar problemas de hidratación
    useEffect(() => {
        console.log('[DEBUG AdminContent] isMounted effect')
        setIsMounted(true)
    }, [])

    useEffect(() => {
        console.log('[DEBUG AdminContent] useEffect triggered')
        // Cargar fecha solo en cliente
        setDateDisplay(new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }))

        // Cargar sesión desde localStorage de forma segura
        try {
            const stored = localStorage.getItem('super-aguilares-session')
            console.log('[DEBUG AdminContent] stored session exists:', !!stored)
            if (stored) {
                const parsed = JSON.parse(stored)
                if (parsed?.state?.user?.rol === 'admin') {
                    setSessionData({
                        nombre: parsed.state.user.nombre || 'Admin',
                        rol: parsed.state.user.rol || 'admin'
                    })
                } else {
                    console.log('[DEBUG AdminContent] No admin role, redirecting')
                    router.replace('/login')
                    return
                }
            } else {
                console.log('[DEBUG AdminContent] No session, redirecting')
                router.replace('/login')
                return
            }
        } catch {
            router.replace('/login')
            return
        }

        // Redirigir /admin a /admin/productos
        if (pathname === '/admin') {
            router.push('/admin/productos')
        }

        console.log('[DEBUG AdminContent] Setting isLoading false')
        setIsLoading(false)
    }, [pathname, router])

    const handleLogout = () => {
        localStorage.removeItem('super-aguilares-session')
        router.push('/catalogo')
    }

    console.log('[DEBUG AdminContent] Rendering layout (isLoading:', isLoading, ')')

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Mobile Overlay */}
            {isMounted && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 flex flex-col z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-6 lg:p-8 border-b border-gray-50 mb-4 flex items-center justify-between">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-xl">
                            <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-text-main">ADMIN</span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-primary"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto pt-4">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
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

                <div className="p-4 lg:p-6 border-t border-gray-50 mt-auto">
                    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {sessionData?.nombre?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-main truncate">{sessionData?.nombre || 'Admin'}</p>
                            <p className="text-xs text-text-secondary truncate capitalize">{sessionData?.rol || 'Administrador'}</p>
                        </div>
                        <button onClick={handleLogout} className="text-gray-400 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-lg">logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-72 min-w-0">
                <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-4 lg:px-10 flex items-center justify-between">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-600 hover:text-primary"
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>

                    <h2 className="text-lg lg:text-xl font-bold text-text-main">
                        {MENU_ITEMS.find(i => pathname.startsWith(i.href))?.label || 'Panel de Control'}
                    </h2>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
                        </button>
                        <div className="hidden lg:block w-px h-6 bg-gray-200 mx-2"></div>
                        <p className="hidden lg:block text-sm font-bold text-text-main">
                            {dateDisplay}
                        </p>
                    </div>
                </header>

                <div className="p-4 lg:p-10" suppressHydrationWarning>
                    <ErrorBoundary>
                        {/* Loader encima cuando carga */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        )}
                        {/* Children SIEMPRE se renderizan para mantener hooks consistentes */}
                        <div style={{ display: isLoading ? 'none' : 'block' }}>
                            {children}
                        </div>
                    </ErrorBoundary>
                </div>
            </main>
        </div>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminContent>{children}</AdminContent>
}
