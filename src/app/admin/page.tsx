import { getDashboardStats } from '@/actions/admin'
import { AdminNotifications } from '@/components/admin/AdminNotifications'
import { StockAlerts } from '@/components/admin/StockAlerts'
import { mockPedidos, mockReportes } from '@/lib/mockData'
import Link from 'next/link'

// Helper para formatear estado
function getEstadoBadge(estado: string) {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
        recibido: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Recibido' },
        preparacion: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En Preparación' },
        en_camino: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'En Camino' },
        entregado: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Entregado' },
        cancelado: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelado' },
    }
    return badges[estado] || { bg: 'bg-gray-100', text: 'text-gray-700', label: estado }
}

// Helper para formatear hora
function formatTime(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    const cards = [
        { label: 'Pedidos Hoy', value: stats.pedidosHoy, icon: 'shopping_bag', color: 'bg-blue-500' },
        { label: 'Pendientes', value: stats.pedidosPendientes, icon: 'pending_actions', color: 'bg-amber-500' },
        { label: 'Ventas de Hoy', value: `$${stats.totalVentasHoy.toLocaleString('es-AR')}`, icon: 'payments', color: 'bg-emerald-500' },
        { label: 'Productos', value: stats.totalProductos, icon: 'inventory_2', color: 'bg-purple-500' },
    ]

    // Obtener los pedidos recientes del mock
    const pedidosRecientes = mockPedidos.slice(0, 5)

    // Calcular productos más vendidos del mock
    const productosVendidos = [
        { nombre: 'Carne Vacuna 1kg', cantidad: 45, total: 540000 },
        { nombre: 'Yerba Mate Playadito', cantidad: 38, total: 133000 },
        { nombre: 'Coca-Cola 2.25L', cantidad: 32, total: 64000 },
        { nombre: 'Leche La Serenísima', cantidad: 28, total: 28000 },
        { nombre: 'Arroz Gallo Oro 1kg', cantidad: 25, total: 37500 },
    ]

    return (
        <div className="space-y-10">
            {/* Notificaciones en tiempo real */}
            <AdminNotifications />

            {/* Alertas de stock bajo */}
            <StockAlerts />

            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-text-main tracking-tight">Bienvenido, Admin</h1>
                <p className="text-text-secondary font-medium">Aquí tienes un resumen de lo que está pasando hoy en Super Aguilares.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center gap-4">
                            <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">{card.label}</p>
                                <p className="text-2xl font-black text-text-main mt-0.5">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-text-main">Pedidos Recientes</h3>
                        <Link href="/admin/pedidos" className="text-sm font-bold text-primary hover:underline">Ver todos</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pedidosRecientes.map((pedido) => {
                            const badge = getEstadoBadge(pedido.estado)
                            return (
                                <div key={pedido.id} className="p-5 hover:bg-gray-50/50 transition-colors flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-500">shopping_bag</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main">{pedido.numero}</p>
                                            <p className="text-sm text-text-secondary">{pedido.usuarios.nombre}</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:block text-right">
                                        <p className="text-xs text-text-secondary">{formatTime(pedido.fecha_creacion)}</p>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                                        {badge.label}
                                    </div>
                                    <p className="font-bold text-text-main whitespace-nowrap">
                                        ${pedido.total.toLocaleString('es-AR')}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Quick Actions + Top Products */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
                        <h3 className="text-lg font-bold text-text-main mb-4">Acciones Rápidas</h3>
                        <div className="space-y-2">
                            <Link href="/admin/productos/nuevo" className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all group font-bold text-text-main text-sm">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors text-xl">add_circle</span>
                                Nuevo Producto
                            </Link>
                            <Link href="/admin/caja" className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all group font-bold text-text-main text-sm">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors text-xl">account_balance_wallet</span>
                                Apertura de Caja
                            </Link>
                            <Link href="/admin/reportes" className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-primary hover:text-white transition-all group font-bold text-text-main text-sm">
                                <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors text-xl">print</span>
                                Reportes Diarios
                            </Link>
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6">
                        <h3 className="text-lg font-bold text-text-main mb-4">Más Vendidos</h3>
                        <div className="space-y-3">
                            {productosVendidos.slice(0, 4).map((prod, idx) => (
                                <div key={prod.nombre} className="flex items-center gap-3">
                                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-text-main text-sm truncate">{prod.nombre}</p>
                                        <p className="text-xs text-text-secondary">{prod.cantidad} vendidos</p>
                                    </div>
                                    <p className="text-sm font-bold text-emerald-600">${(prod.total / 1000).toFixed(0)}k</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sales Chart Placeholder */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-text-main">Ventas de la Semana</h3>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <span className="material-symbols-outlined text-emerald-500 text-lg">trending_up</span>
                        <span className="font-bold text-emerald-600">+12.5%</span>
                        <span>vs semana anterior</span>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-4 h-48">
                    {mockReportes.daily.map((day) => {
                        const height = (day.total / 220000) * 100
                        const dayName = new Date(day.date).toLocaleDateString('es-AR', { weekday: 'short' })
                        return (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '160px' }}>
                                    <div
                                        className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-red-400 rounded-t-lg transition-all hover:from-primary-dark hover:to-primary"
                                        style={{ height: `${height}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-text-secondary uppercase">{dayName}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
