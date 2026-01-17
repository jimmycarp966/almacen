'use client'

import { Suspense } from 'react'
import { getCategorias, getProductos } from '@/actions/catalog'
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
            const [cats, prods] = await Promise.all([
                getCategorias(),
                getProductos(categoriaId, searchQuery || undefined, filters)
            ])
            setCategorias(cats)
            setProductos(prods)
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

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />

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
                            {/* Product Grid - 3 columns to make room for sidebar */}
                            {productos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
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
