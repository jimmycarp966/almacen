import { getDashboardStats } from '@/actions/admin'

export default async function AdminDashboard() {
    const stats = await getDashboardStats()

    const cards = [
        { label: 'Pedidos Hoy', value: stats.pedidosHoy, icon: 'shopping_bag', color: 'bg-blue-500' },
        { label: 'Pendientes', value: stats.pedidosPendientes, icon: 'pending_actions', color: 'bg-amber-500' },
        { label: 'Ventas de Hoy', value: `$${stats.totalVentasHoy.toLocaleString('es-AR')}`, icon: 'payments', color: 'bg-emerald-500' },
        { label: 'Productos', value: stats.totalProductos, icon: 'inventory_2', color: 'bg-purple-500' },
    ]

    return (
        <div className="space-y-10">
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
                {/* Recent Orders (Placeholder for now) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-text-main">Pedidos Recientes</h3>
                        <button className="text-sm font-bold text-primary hover:underline">Ver todos</button>
                    </div>
                    <div className="p-8 text-center py-20">
                        <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">history</span>
                        <p className="text-text-secondary font-medium">No hay pedidos recientes para mostrar aún.</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-8 space-y-6">
                    <h3 className="text-xl font-bold text-text-main">Acciones Rápidas</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-primary hover:text-white transition-all group group font-bold text-text-main">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">add_circle</span>
                            Nuevo Producto
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-primary hover:text-white transition-all group group font-bold text-text-main">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">account_balance_wallet</span>
                            Apertura de Caja
                        </button>
                        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-primary hover:text-white transition-all group group font-bold text-text-main">
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">print</span>
                            Reportes Diarios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
