import { getAllProductosForAdmin, getCategorias } from '@/actions/catalog'
import { ProductosTable } from '@/components/admin/ProductosTable'
import Link from 'next/link'

// Deshabilitar cache para siempre obtener datos frescos
export const revalidate = 0

export default async function AdminProductosPage() {
    const [productos, categorias] = await Promise.all([
        getAllProductosForAdmin(),
        getCategorias()
    ])

    // DEBUG: Log en servidor para ver qué datos llegan
    console.log('[DEBUG AdminProductosPage] productos.length:', productos.length)
    console.log('[DEBUG AdminProductosPage] categorias.length:', categorias.length)
    console.log('[DEBUG AdminProductosPage] Primeros 3 productos:', JSON.stringify(productos.slice(0, 3)))

    // Crear un mapa de categorías por ID
    const categoriasMap = new Map(categorias.map(cat => [cat.id, cat.nombre]))

    return (
        <div className="space-y-8">
            {/* DEBUG INFO */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm">
                <strong>DEBUG:</strong> Productos cargados: <span className="font-bold">{productos.length}</span> | Categorías: {categorias.length}
                {productos.length === 0 && <span className="text-red-600 ml-2">⚠️ No hay productos - revisa logs</span>}
            </div>

            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Gestión de Productos</h1>
                    <p className="text-text-secondary font-medium">Administra el inventario, precios y disponibilidad de tus productos.</p>
                </div>
                <Link href="/admin/productos/agregar" className="btn-primary flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Producto
                </Link>
            </div>

            {/* Instrucciones */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-600">info</span>
                <p className="text-blue-800 text-sm">
                    <strong>Tip:</strong> Hacé clic en el ícono de editar <span className="material-symbols-outlined text-sm align-middle">edit</span> para modificar el precio y stock de un producto.
                </p>
            </div>

            {/* Table */}
            <ProductosTable
                productos={productos}
                categoriasMap={categoriasMap}
            />
        </div>
    )
}
