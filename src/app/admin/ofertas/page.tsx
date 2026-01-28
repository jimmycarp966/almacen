'use client'

import { useState, useEffect } from 'react'
import { getAdminProductosOferta, toggleOfertaProducto, updateDescuentoOferta } from '@/actions/offers.actions'

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
        // Optimistic update
        setProductos(prev => prev.map(p =>
            p.id === id ? { ...p, es_oferta: !currentStatus } : p
        ))

        const result = await toggleOfertaProducto(id, !currentStatus)
        if (!result.success) {
            // Revert on error
            loadData()
            alert('Error al actualizar oferta')
        }
    }

    async function handleUpdateDescuento(id: string, value: string) {
        const discount = parseFloat(value) || 0

        // Optimistic update
        setProductos(prev => prev.map(p =>
            p.id === id ? { ...p, descuento: discount, es_oferta: discount > 0 } : p
        ))

        const result = await updateDescuentoOferta(id, discount)
        if (!result.success) {
            loadData()
            alert('Error al actualizar descuento')
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProductos.map((p) => (
                        <div
                            key={p.id}
                            className={`bg-white rounded-[2rem] p-6 border transition-all duration-300 ${p.es_oferta
                                    ? 'border-primary ring-1 ring-primary/20 shadow-xl'
                                    : 'border-gray-100 hover:border-gray-200 shadow-sm'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                    {p.imagen_url ? (
                                        <img src={p.imagen_url} alt={p.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <span className="material-symbols-outlined text-3xl">image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-text-main truncate leading-tight">{p.nombre}</h3>
                                    <p className="text-primary font-black mt-1">
                                        ${p.precio.toLocaleString('es-AR')}
                                    </p>

                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${p.es_oferta ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {p.es_oferta ? 'En Oferta' : 'Normal'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-50 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-text-secondary">Mostrar en Ofertas</span>
                                    <button
                                        onClick={() => handleToggleOferta(p.id, p.es_oferta)}
                                        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${p.es_oferta ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${p.es_oferta ? 'left-7' : 'left-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-text-secondary">Descuento (%)</span>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className="w-20 text-right font-bold text-sm py-1 px-2 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
                                        value={p.descuento || 0}
                                        onChange={(e) => handleUpdateDescuento(p.id, e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
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
