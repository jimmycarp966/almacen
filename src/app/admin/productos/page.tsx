import { getProductos, getCategorias } from '@/actions/catalog'

export default async function AdminProductosPage() {
    const [productos, categorias] = await Promise.all([
        getProductos(),
        getCategorias()
    ])

    // Crear un mapa de categorías por ID
    const categoriasMap = new Map(categorias.map(cat => [cat.id, cat.nombre]))

    return (
        <div className="space-y-10">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Gestión de Productos</h1>
                    <p className="text-text-secondary font-medium">Administra el inventario, precios y disponibilidad de tus productos.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <span className="material-symbols-outlined">add</span>
                    Nuevo Producto
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Producto</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Categoría</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Precio</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Stock</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Estado</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {productos.map((prod) => (
                                <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${prod.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}></div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{prod.nombre}</p>
                                                <p className="text-xs text-text-secondary truncate max-w-[200px]">{prod.descripcion || 'Sin descripción'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-gray-100 text-text-secondary text-xs font-bold rounded-full">
                                            {categoriasMap.get(prod.categoria_id) || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-extrabold text-text-main">${Number(prod.precio).toLocaleString('es-AR')}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-bold ${prod.stock < 10 ? 'text-red-500' : 'text-text-main'}`}>
                                                {prod.stock}
                                            </p>
                                            {prod.stock < 10 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${prod.activo ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {prod.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
