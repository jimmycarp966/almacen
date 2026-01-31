'use client'

import { Suspense } from 'react'
import { getCategorias, getAllProductos, getOfertasSemana } from '@/actions/catalog'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/client/ProductCard'
import { CartFAB } from '@/components/client/CartFAB'
import { CartSidebar } from '@/components/client/CartSidebar'
import { SearchBar } from '@/components/catalog/SearchBar'
import { FilterPanel, FilterState } from '@/components/catalog/FilterPanel'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

function CatalogContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    const [filters, setFilters] = useState<FilterState>({
        minPrice: null,
        maxPrice: null,
        categories: [],
        inStock: false,
        sortBy: 'nombre',
    })

    const [categorias, setCategorias] = useState<any[]>([])
    const [productos, setProductos] = useState<any[]>([])
    const [ofertas, setOfertas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const categoriaId = searchParams.get('categoria') || 'todos'
    const searchQuery = searchParams.get('q') || ''

    useEffect(() => {
        setMounted(true)
        loadProducts()
    }, [categoriaId, searchQuery, filters])

    const loadProducts = async () => {
        setLoading(true)
        try {
            const cats = await getCategorias()
            const prods = await getAllProductos(categoriaId, searchQuery || undefined, filters)
            const ofertasSemana = await getOfertasSemana()

            setCategorias(cats)
            setProductos(prods)
            setOfertas(ofertasSemana)
        } catch (err) {
            console.error('Catalog: Error en la carga:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters)
    }

    if (!mounted) return null

    const showOfertas = categoriaId === 'todos' && !searchQuery

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />

            {/* Banner de confianza */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">verified_user</span>
                    <p className="text-sm font-bold">
                        💚 Pagás cuando recibís y controlás tu pedido en tu domicilio
                    </p>
                </div>
            </div>

            {/* Categorías */}
            <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto hide-scrollbar py-4">
                        <Link
                            href="/catalogo"
                            className={`whitespace-nowrap pb-1 border-b-[3px] font-bold text-sm tracking-wide transition-colors ${categoriaId === 'todos' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'
                                }`}
                        >
                            Todos
                        </Link>
                        {categorias.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/catalogo?categoria=${cat.id}`}
                                className={`whitespace-nowrap pb-1 border-b-[3px] font-bold text-sm tracking-wide transition-colors ${categoriaId === cat.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'
                                    }`}
                            >
                                {cat.nombre}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 max-w-[1600px] w-full mx-auto">
                <main className="flex-1 px-4 sm:px-6 lg:px-12 py-8 lg:pr-8 overflow-x-hidden">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6 gap-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-main text-center md:text-left">Catálogo 2026</h2>
                        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
                            <SearchBar placeholder="Buscar..." />
                            <FilterPanel onFilterChange={handleFilterChange} initialFilters={filters} categorias={categorias} />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* Ofertas - Banner rojo con lista dentro */}
                            {showOfertas && ofertas.length > 0 && (
                                <section className="mb-10 w-full max-w-full overflow-x-hidden">
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-rose-700 shadow-2xl shadow-red-500/50 border border-red-400/30">
                                        {/* Patrón de fondo animado */}
                                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNjBWMGg2MHY2MEgwVjB6IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20 animate-pulse"></div>
                                        {/* Badge con contador */}
                                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg z-10 whitespace-nowrap border border-white/30">
                                            {ofertas.length} OFERTAS
                                        </div>
                                        {/* Rayas brillantes superiores */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent opacity-60"></div>
                                        <div className="relative px-2 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-4 md:py-6 lg:py-8 overflow-x-hidden">
                                            <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 text-center">
                                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white drop-shadow-2xl break-words leading-tight">
                                                    OFERTAS
                                                </h2>
                                            </div>
                                            <div className="space-y-1 sm:space-y-2">
                                                {ofertas.map((prod) => (
                                                    <ProductCard
                                                        key={prod.id}
                                                        id={prod.id}
                                                        nombre={prod.nombre}
                                                        descripcion={prod.descripcion}
                                                        precio={prod.precio}
                                                        imagen_url={null}
                                                        categoria_id={prod.categoria_id}
                                                        tipo_venta={prod.tipo_venta}
                                                        precio_por_kg={prod.precio_por_kg}
                                                        listMode
                                                        ofertaDestacada
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Productos - Lista */}
                            {productos.length > 0 ? (
                                <>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-lg font-bold text-text-main">
                                            {showOfertas ? 'Productos' : 'Resultados'}
                                        </h3>
                                        <span className="text-sm text-text-secondary">{productos.length}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {productos.map((prod) => (
                                            <ProductCard
                                                key={prod.id}
                                                id={prod.id}
                                                nombre={prod.nombre}
                                                descripcion={prod.descripcion}
                                                precio={prod.precio}
                                                imagen_url={null}
                                                categoria_id={prod.categoria_id}
                                                tipo_venta={prod.tipo_venta}
                                                precio_por_kg={prod.precio_por_kg}
                                                listMode
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                                    <h3 className="text-xl font-bold text-text-main">No hay productos</h3>
                                    {(searchQuery || filters.categories.length > 0 || filters.minPrice !== null || filters.maxPrice !== null) && (
                                        <button
                                            onClick={() => {
                                                router.push('/catalogo')
                                                setFilters({ minPrice: null, maxPrice: null, categories: [], inStock: false, sortBy: 'nombre' })
                                            }}
                                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-red-700"
                                        >
                                            Limpiar filtros
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </main>

                <CartSidebar className="hidden lg:flex" />
            </div>

            <CartFAB className="lg:hidden" />
        </div>
    )
}

export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background-light">
                <Navbar />
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        }>
            <CatalogContent />
        </Suspense>
    )
}
