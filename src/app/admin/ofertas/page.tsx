'use client'

import { useState, useEffect } from 'react'
import { getAdminProductosOferta, toggleOfertaProducto } from '@/actions/offers.actions'

export default function OfertasAdminPage() {
    const [productos, setProductos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        setLoading(true)
        const data = await getAdminProductosOferta()
        setProductos(data)
        setLoading(false)
    }

    const filteredProductos = productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
    )

    async function handleToggleOferta(id: string, currentStatus: boolean) {
        console.log('[OFERTAS CLIENT] Toggle clicked:', { id, currentStatus })

        const newStatus = !currentStatus

        // Optimistic update
        setProductos(prev => prev.map(p =>
            p.id === id ? { ...p, es_oferta: newStatus } : p
        ))

        const result = await toggleOfertaProducto(id, newStatus)
        console.log('[OFERTAS CLIENT] Result:', result)

        if (!result.success) {
            // Revert on error
            console.error('[OFERTAS CLIENT] Error:', result.error)
            loadData()
            alert('Error al actualizar oferta: ' + JSON.stringify(result.error))
        } else {
            // Recargar para confirmar el cambio en la DB
            console.log('[OFERTAS CLIENT] Recargando datos...')
            loadData()
        }
    }


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-text-main">Gestión de Ofertas</h1>
                    <p className="text-text-secondary mt-1">Selecciona los productos que aparecerán destacados para los clientes.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden -mx-4 lg:mx-0">
                    <div className="max-h-[70vh] overflow-y-auto overflow-x-auto px-4 lg:px-0">
                        <table className="w-full">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="text-left py-4 px-6 font-bold text-text-secondary text-sm">Producto</th>
                                    <th className="text-center py-4 px-6 font-bold text-text-secondary text-sm">Precio</th>
                                    <th className="text-center py-4 px-6 font-bold text-text-secondary text-sm">En Ofertas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProductos.map((p) => (
                                    <tr
                                        key={p.id}
                                        className={`hover:bg-gray-50 transition-colors ${p.es_oferta ? 'bg-red-50/50' : ''}`}
                                    >
                                        <td className="py-4 px-6">
                                            <span className="font-medium text-text-main">{p.nombre}</span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="font-bold text-text-main">${p.precio.toLocaleString('es-AR')}</span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <input
                                                type="checkbox"
                                                checked={p.es_oferta || false}
                                                onChange={() => handleToggleOferta(p.id, p.es_oferta)}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && filteredProductos.length === 0 && (
                <div className="py-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-200">sentiment_dissatisfied</span>
                    <p className="text-text-secondary mt-4 font-bold">No se encontraron productos.</p>
                </div>
            )}
        </div>
    )
}
