'use client'

import { useState } from 'react'
import { updateProducto } from '@/actions/catalog_admin'

interface Producto {
    id: string
    nombre: string
    descripcion: string
    precio: number
    stock: number
    activo: boolean
    imagen_url: string | null
    categoria_id: string
}

interface ProductosTableProps {
    productos: Producto[]
    categoriasMap: Map<string, string>
}

export function ProductosTable({ productos: initialProductos, categoriasMap }: ProductosTableProps) {
    const [productos, setProductos] = useState(initialProductos)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<{ precio: number; stock: number }>({ precio: 0, stock: 0 })
    const [saving, setSaving] = useState(false)

    const startEditing = (prod: Producto) => {
        setEditingId(prod.id)
        setEditValues({ precio: prod.precio, stock: prod.stock })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditValues({ precio: 0, stock: 0 })
    }

    const saveChanges = async (id: string) => {
        setSaving(true)
        try {
            const result = await updateProducto(id, {
                precio: editValues.precio,
                stock: editValues.stock
            })

            if (!result.error) {
                // Actualizar estado local
                setProductos(prev => prev.map(p =>
                    p.id === id ? { ...p, precio: editValues.precio, stock: editValues.stock } : p
                ))
                setEditingId(null)
            } else {
                alert('Error al guardar: ' + result.error.message)
            }
        } catch (error) {
            alert('Error al guardar los cambios')
        }
        setSaving(false)
    }

    const toggleActivo = async (prod: Producto) => {
        const result = await updateProducto(prod.id, { activo: !prod.activo })
        if (!result.error) {
            setProductos(prev => prev.map(p =>
                p.id === prod.id ? { ...p, activo: !p.activo } : p
            ))
        }
    }

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {productos.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-lg bg-gray-100 bg-cover bg-center shrink-0"
                                            style={{ backgroundImage: `url('${prod.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">{prod.nombre}</p>
                                            <p className="text-xs text-text-secondary truncate max-w-[150px]">{prod.descripcion || 'Sin descripción'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs font-bold rounded-full">
                                        {categoriasMap.get(prod.categoria_id) || 'General'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === prod.id ? (
                                        <input
                                            type="number"
                                            value={editValues.precio}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, precio: Number(e.target.value) }))}
                                            className="w-24 px-2 py-1 border border-primary rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    ) : (
                                        <p className="text-sm font-extrabold text-text-main">${Number(prod.precio).toLocaleString('es-AR')}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === prod.id ? (
                                        <input
                                            type="number"
                                            value={editValues.stock}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                            className="w-20 px-2 py-1 border border-primary rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <p className={`text-sm font-bold ${prod.stock < 10 ? 'text-red-500' : 'text-text-main'}`}>
                                                {prod.stock}
                                            </p>
                                            {prod.stock < 10 && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleActivo(prod)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${prod.activo
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                    >
                                        {prod.activo ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {editingId === prod.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveChanges(prod.id)}
                                                    disabled={saving}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => startEditing(prod)}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
                                                title="Editar precio y stock"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
