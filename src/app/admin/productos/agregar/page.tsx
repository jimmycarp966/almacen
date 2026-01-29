'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCategorias } from '@/actions/catalog'
import { createProducto } from '@/actions/catalog_admin'

export default function AdminProductosAgregarPage() {
    const router = useRouter()
    const [nombre, setNombre] = useState('')
    const [categoria, setCategoria] = useState('')
    const [precio, setPrecio] = useState('')
    const [categorias, setCategorias] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingCats, setLoadingCats] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadCats = async () => {
            const data = await getCategorias()
            setCategorias(data)
            setLoadingCats(false)
        }
        loadCats()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!nombre.trim()) {
            setError('El nombre es requerido')
            setLoading(false)
            return
        }
        if (!categoria) {
            setError('La categoría es requerida')
            setLoading(false)
            return
        }
        if (!precio || Number(precio) <= 0) {
            setError('El precio es requerido')
            setLoading(false)
            return
        }

        try {
            const result = await createProducto({
                nombre: nombre.trim(),
                categoria_id: categoria,
                precio: Number(precio),
                activo: true
            })

            if (!result.error) {
                router.push('/admin/productos')
            } else {
                setError('Error al guardar: ' + result.error.message)
            }
        } catch (err) {
            setError('Error inesperado')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-[#181111] flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
                <main className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b border-neutral-100">
                        <h1 className="text-2xl font-extrabold text-[#181111]">
                            Nuevo Producto
                        </h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            Ingresa los datos del producto
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-bold text-[#181111] mb-2">
                                Nombre del producto <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="w-full h-12 px-4 rounded-lg border border-neutral-200 bg-white text-[#181111] placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                placeholder="Ej: Coca Cola 500ml"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-bold text-[#181111] mb-2">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full h-12 px-4 rounded-lg border border-neutral-200 bg-white text-[#181111] appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer disabled:opacity-50"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                                disabled={loadingCats}
                            >
                                <option disabled value="">Seleccionar categoría...</option>
                                {categorias.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                                ))}
                            </select>
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-sm font-bold text-[#181111] mb-2">
                                Precio de venta ($)<span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none text-neutral-500 font-bold">$</span>
                                <input
                                    className="w-full h-12 pl-12 pr-4 rounded-lg border border-neutral-200 bg-white text-[#181111] placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="0.00"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={precio}
                                    onChange={(e) => setPrecio(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex gap-3 pt-2">
                            <Link
                                href="/admin/productos"
                                className="flex-1 h-12 rounded-lg text-neutral-500 hover:text-[#181111] hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-center font-bold"
                            >
                                Cancelar
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-12 rounded-lg bg-primary hover:bg-[#c01515] text-white font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Guardar'}
                                <span className="material-symbols-outlined text-[20px]">save</span>
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    )
}
