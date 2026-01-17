import { getInventoryMovements, getInventoryStats } from '@/actions/inventory'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function InventoryHistoryPage() {
    const [movements, stats] = await Promise.all([
        getInventoryMovements(),
        getInventoryStats()
    ])

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Link href="/admin" className="text-gray-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </Link>
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Historial de Inventario</h1>
                </div>
                <p className="text-text-secondary font-medium">Registro de todos los movimientos de stock</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-blue-600 text-2xl">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Total Productos</p>
                            <p className="text-2xl font-black text-text-main">{stats.totalProductos}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-amber-600 text-2xl">warning</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Stock Bajo</p>
                            <p className="text-2xl font-black text-amber-600">{stats.productosConStockBajo}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-red-600 text-2xl">block</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Sin Stock</p>
                            <p className="text-2xl font-black text-red-600">{stats.productosSinStock}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-green-600 text-2xl">sum</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-text-secondary uppercase tracking-wider">Stock Total</p>
                            <p className="text-2xl font-black text-green-600">{stats.totalStock}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movements Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-text-main">Movimientos Recientes</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Fecha</th>
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Producto</th>
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Tipo</th>
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Cantidad</th>
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Stock Anterior</th>
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Stock Nuevo</th>
                                <th className="px-8 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">Motivo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {movements.map((movement) => (
                                <tr key={movement.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-medium text-text-main">
                                            {format(new Date(movement.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                                        </p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-text-main">{movement.producto_nombre}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                            movement.tipo === 'entrada'
                                                ? 'bg-green-100 text-green-700'
                                                : movement.tipo === 'salida'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            <span className="material-symbols-outlined text-[16px]">
                                                {movement.tipo === 'entrada' ? 'add' : movement.tipo === 'salida' ? 'remove' : 'edit'}
                                            </span>
                                            {movement.tipo.charAt(0).toUpperCase() + movement.tipo.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm font-bold text-text-main">{movement.cantidad}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm text-gray-600">{movement.stock_anterior}</p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className={`text-sm font-bold ${
                                            movement.stock_nuevo > movement.stock_anterior
                                                ? 'text-green-600'
                                                : movement.stock_nuevo < movement.stock_anterior
                                                ? 'text-red-600'
                                                : 'text-gray-600'
                                        }`}>
                                            {movement.stock_nuevo}
                                        </p>
                                    </td>
                                    <td className="px-8 py-4">
                                        <p className="text-sm text-gray-600">{movement.motivo}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {movements.length === 0 && (
                    <div className="p-12 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">history</span>
                        <p className="text-text-secondary font-medium">No hay movimientos registrados</p>
                    </div>
                )}
            </div>
        </div>
    )
}
