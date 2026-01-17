'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { getPedidosCliente } from '@/actions/orders'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import {
    Package2,
    ChevronLeft,
    ChevronRight,
    Calendar,
    CheckCircle2,
    Truck,
    XCircle,
    Clock
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

export default function HistorialPage() {
    const { user } = useSessionStore()
interface PedidoItem {
    id: string
    productos: {
        nombre: string
        imagen_url?: string
    }
    cantidad: number
    precio_unitario: number
    subtotal: number
}

interface Pedido {
    id: string
    numero: string
    fecha_creacion: string
    total: number
    estado: string
    metodo_pago: string
    pedido_items: PedidoItem[]
}

    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user?.id) {
            getPedidosCliente(user.id).then(data => {
                setPedidos(data)
                setLoading(false)
            })
        }
    }, [user])

    const getStatusStyles = (estado: string) => {
        switch (estado) {
            case 'entregado':
                return {
                    bg: 'bg-green-50/10',
                    text: 'text-green-700',
                    icon: <CheckCircle2 className="w-4 h-4" />
                }
            case 'en_camino':
                return {
                    bg: 'bg-blue-50/10',
                    text: 'text-blue-700',
                    icon: <Truck className="w-4 h-4" />
                }
            case 'cancelado':
                return {
                    bg: 'bg-red-50/10',
                    text: 'text-red-700',
                    icon: <XCircle className="w-4 h-4" />
                }
            default:
                return {
                    bg: 'bg-orange-50/10',
                    text: 'text-orange-700',
                    icon: <Clock className="w-4 h-4" />
                }
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Debes iniciar sesión para ver tu historial</h1>
                <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-lg font-bold">
                    Ir al Login
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white[#1c1e22] min-h-screen flex flex-col font-sans antialiased">
            <Navbar />

            <main className="flex-1 flex flex-col items-center py-8 px-4 lg:px-40">
                <div className="w-full max-w-[960px] flex flex-col gap-8">

                    {/* Header */}
                    <div className="flex flex-col gap-6">
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors group">
                                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Volver al Catálogo
                            </Link>
                        </div>
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl font-black tracking-tight text-[#181010] mb-2">Historial de Pedidos</h1>
                                <p className="text-gray-500">Consulta el estado y detalle de tus compras recientes.</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                        <div className="flex flex-wrap gap-2">
                            <button className="px-4 py-2 rounded-full bg-black text-white text-sm font-bold shadow-md">Todos</button>
                            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-300">En camino</button>
                            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-gray-300">Entregados</button>
                        </div>
                        <div className="relative flex items-center">
                            <button className="flex items-center gap-2 text-sm font-bold text-[#181010] hover:text-primary transition-colors">
                                <Calendar className="w-5 h-5" />
                                Últimos 30 días
                            </button>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="flex flex-col gap-5">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : pedidos.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <Package2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-medium">Aún no has realizado ningún pedido.</p>
                                <Link href="/" className="text-primary font-bold mt-2 inline-block">¡Empieza a comprar ahora!</Link>
                            </div>
                        ) : (
                            pedidos.map((pedido) => {
                                const styles = getStatusStyles(pedido.estado)
                                return (
                                    <div key={pedido.id} className="group relative flex flex-col gap-4 rounded-xl border border-gray-100 bg-white[#25282c] p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
                                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                                    <Package2 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#181010]">Pedido #{pedido.numero}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {pedido.pedido_items.length} {pedido.pedido_items.length === 1 ? 'artículo' : 'artículos'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                {format(new Date(pedido.fecha_creacion), "d MMM, yyyy", { locale: es })}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Pagado</span>
                                                <span className="text-2xl font-extrabold text-[#181010]">${pedido.total.toLocaleString()}</span>
                                                <span className="text-sm text-gray-500 capitalize">{pedido.metodo_pago}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4">
                                                <div className={`flex items-center gap-1.5 rounded-full ${styles.bg} ${styles.text} px-3 py-1.5 text-xs font-bold uppercase tracking-wide`}>
                                                    {styles.icon}
                                                    {pedido.estado.replace('_', ' ')}
                                                </div>
                                                <Link
                                                    href={`/seguimiento/${pedido.id}`}
                                                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-red-200 transition-all hover:bg-red-700 hover:shadow-lg active:scale-95"
                                                >
                                                    Ver Detalle
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {pedidos.length > 5 && (
                        <div className="flex items-center justify-center pt-8 pb-12">
                            <div className="flex items-center gap-1">
                                <button className="flex size-10 items-center justify-center rounded-full text-[#181010] hover:bg-gray-100 transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button className="flex size-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-lg">1</button>
                                <button className="flex size-10 items-center justify-center rounded-full text-sm font-medium text-[#181010] hover:bg-gray-100 transition-colors">2</button>
                                <button className="flex size-10 items-center justify-center rounded-full text-[#181010] hover:bg-gray-100 transition-colors">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="border-t border-gray-100 bg-white[#1c1e22] py-8">
                <div className="px-4 lg:px-40 flex justify-center">
                    <div className="flex w-full max-w-[960px] flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
                        <p>© 2024 Super Aguilares. Todos los derechos reservados.</p>
                        <div className="flex gap-6">
                            <Link href="#" className="hover:text-primary transition-colors">Ayuda</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
