import { getCategorias, getProductos } from '@/actions/catalog'
import { Navbar } from '@/components/layout/Navbar'
import { ProductCard } from '@/components/client/ProductCard'
import { CartFAB } from '@/components/client/CartFAB'
import Link from 'next/link'

interface PageProps {
    searchParams: Promise<{ categoria?: string }>
}

export default async function CatalogPage({ searchParams }: PageProps) {
    const params = await searchParams
    const categoriaId = params.categoria || 'todos'

    const [categorias, productos] = await Promise.all([
        getCategorias(),
        getProductos(categoriaId)
    ])

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

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-text-main mb-2">Catálogo 2026</h2>
                        <p className="text-text-secondary text-lg">Los mejores productos seleccionados para ti.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-text-main">
                            <span className="material-symbols-outlined text-[20px]">tune</span>
                            Filtrar
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-text-main">
                            <span className="material-symbols-outlined text-[20px]">sort</span>
                            Ordenar
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {productos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                        {productos.map((prod) => (
                            <ProductCard
                                key={prod.id}
                                id={prod.id}
                                nombre={prod.nombre}
                                descripcion={prod.descripcion || ''}
                                precio={Number(prod.precio)}
                                imagen_url={prod.imagen_url}
                                esNuevo={false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
                        <h3 className="text-xl font-bold text-text-main">No hay productos en esta categoría</h3>
                        <p className="text-text-secondary">Prueba seleccionando otra categoría o vuelve más tarde.</p>
                    </div>
                )}

                {/* Meta Text */}
                <div className="mt-20 flex justify-center pb-32">
                    <p className="text-text-secondary text-base font-medium">
                        Mostrando {productos.length} productos exclusivos
                    </p>
                </div>
            </main>

            <CartFAB />
        </div>
    )
}
