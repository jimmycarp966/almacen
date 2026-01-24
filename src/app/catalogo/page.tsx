'use client'

import { Suspense } from 'react'
import { getCategorias, getProductos, getOfertasSemana } from '@/actions/catalog'
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
        minPrice: 0,
        maxPrice: 50000,
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
            const [cats, prods, ofertasSemana] = await Promise.all([
                getCategorias(),
                getProductos(categoriaId, searchQuery || undefined, filters),
                getOfertasSemana()
            ])
            setCategorias(cats)
            setProductos(prods)
            setOfertas(ofertasSemana)
        } catch (error) {
            console.error('Error cargando productos:', error)
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

            {/* Banner de confianza - Fijo debajo del navbar */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 px-4 shadow-sm">
                <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-xl">verified_user</span>
                    <p className="text-sm font-bold">
                        💚 Pagás cuando recibís y controlás tu pedido en tu domicilio
                    </p>
                    <span className="hidden sm:inline text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        ¡Compra segura!
                    </span>
                </div>
            </div>

            {/* Categories Tabs */}
            <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_2px_15px_-10px_rgba(0,0,0,0.05)]">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto hide-scrollbar py-4">
                        <Link
                            href="/catalogo"
                            className={`whitespace-nowrap pb-1 border-b-[3px] font-bold text-sm tracking-wide transition-colors ${categoriaId === 'todos' ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-main'
                                }`}
                        >
                            Todos los Productos
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

            {/* Main Content with Sidebar */}
            <div className="flex flex-col lg:flex-row flex-1 max-w-[1600px] w-full mx-auto">
                {/* Left Column: Product Grid */}
                <main className="flex-1 px-4 sm:px-6 lg:px-12 py-10 lg:pr-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-text-main mb-2">Catálogo 2026</h2>
                            <p className="text-text-secondary text-lg">Los mejores productos seleccionados para ti.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <SearchBar placeholder="Buscar productos..." />
                            <FilterPanel onFilterChange={handleFilterChange} initialFilters={filters} />
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            {/* 🔥 OFERTAS DE LA SEMANA - Solo en la vista principal */}
                            {showOfertas && ofertas.length > 0 && (
                                <section className="mb-16">
                                    {/* Header de ofertas con diseño premium */}
                                    <div className="bg-gradient-to-r from-primary via-red-500 to-orange-500 rounded-2xl p-6 mb-8 relative overflow-hidden">
                                        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E\")" }}></div>
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/20 rounded-full p-3">
                                                    <span className="material-symbols-outlined text-4xl text-white">local_fire_department</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                                                        🔥 Ofertas de la Semana
                                                    </h3>
                                                    <p className="text-white/80 text-sm font-medium">
                                                        ¡Aprovechá antes de que se terminen!
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="hidden sm:block bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                                                <p className="text-white text-xs font-bold uppercase">Solo esta semana</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid de ofertas - 5 columnas en desktop */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                        {ofertas.map((prod) => (
                                            <ProductCard
                                                key={prod.id}
                                                id={prod.id}
                                                nombre={prod.nombre}
                                                descripcion={prod.descripcion}
                                                precio={prod.precio}
                                                imagen_url={prod.imagen_url}
                                                categoria_id={prod.categoria_id}
                                                esNuevo={prod.esNuevo}
                                                descuento={prod.descuento}
                                                compact
                                            />
                                        ))}
                                    </div>

                                    {/* Separador */}
                                    <div className="border-t-2 border-dashed border-gray-200 mt-12 mb-8 relative">
                                        <span className="absolute left-1/2 -translate-x-1/2 -top-4 bg-background-light px-4 text-text-secondary font-bold text-sm uppercase tracking-wider">
                                            Todos los productos
                                        </span>
                                    </div>
                                </section>
                            )}

                            {/* Product Grid - 4 columnas con imágenes más pequeñas */}
                            {productos.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                                    {productos.map((prod) => (
                                        <ProductCard
                                            key={prod.id}
                                            id={prod.id}
                                            nombre={prod.nombre}
                                            descripcion={prod.descripcion}
                                            precio={prod.precio}
                                            imagen_url={prod.imagen_url}
                                            categoria_id={prod.categoria_id}
                                            esNuevo={prod.esNuevo}
                                            descuento={prod.descuento}
                                            compact
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                                    <h3 className="text-xl font-bold text-text-main">No hay productos encontrados</h3>
                                    <p className="text-text-secondary">Intenta con otros filtros o vuelve más tarde.</p>
                                    {(searchQuery || filters.categories.length > 0 || filters.minPrice > 0 || filters.maxPrice < 50000 || filters.inStock) && (
                                        <button
                                            onClick={() => {
                                                router.push('/catalogo')
                                                setFilters({
                                                    minPrice: 0,
                                                    maxPrice: 50000,
                                                    categories: [],
                                                    inStock: false,
                                                    sortBy: 'nombre',
                                                })
                                            }}
                                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                                        >
                                            Limpiar Filtros
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Meta Text */}
                            <div className="mt-20 flex justify-center pb-32 lg:pb-10">
                                <p className="text-text-secondary text-base font-medium">
                                    Mostrando {productos.length} productos exclusivos
                                </p>
                            </div>
                        </>
                    )}
                </main>

                {/* Right Column: Cart Sidebar - visible only on desktop */}
                <CartSidebar className="hidden lg:flex" />
            </div>

            {/* FAB visible only on mobile */}
            <CartFAB className="lg:hidden" />
        </div >
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
