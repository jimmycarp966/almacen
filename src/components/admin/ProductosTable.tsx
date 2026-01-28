'use client'

import { useState } from 'react'
import { updateProducto } from '@/actions/catalog_admin'

interface Producto {
    id: string
    nombre: string
    descripcion: string
    precio: number
    descuento: number
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
    const [editValues, setEditValues] = useState<{ precio: number; stock: number; descuento: number; imagen_url: string }>({
        precio: 0,
        stock: 0,
        descuento: 0,
        imagen_url: ''
    })
    const [saving, setSaving] = useState(false)

    const startEditing = (prod: Producto) => {
        setEditingId(prod.id)
        setEditValues({
            precio: prod.precio,
            stock: prod.stock,
            descuento: prod.descuento || 0,
            imagen_url: prod.imagen_url || ''
        })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditValues({ precio: 0, stock: 0, descuento: 0, imagen_url: '' })
    }

    const saveChanges = async (id: string) => {
        setSaving(true)
        try {
            const result = await updateProducto(id, {
                precio: editValues.precio,
                stock: editValues.stock,
                descuento: editValues.descuento,
                imagen_url: editValues.imagen_url
            })

            if (!result.error) {
                // Actualizar estado local
                setProductos(prev => prev.map(p =>
                    p.id === id ? {
                        ...p,
                        precio: editValues.precio,
                        stock: editValues.stock,
                        descuento: editValues.descuento,
                        imagen_url: editValues.imagen_url
                    } : p
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
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Precio</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Dcto (%)</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {productos.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <div className="relative group/img">
                                                <div
                                                    className="w-16 h-16 rounded-2xl bg-gray-100 bg-cover bg-center border border-gray-100 shadow-sm group-hover/img:shadow-md transition-all duration-300"
                                                    style={{ backgroundImage: `url('${(editingId === prod.id ? editValues.imagen_url : prod.imagen_url) || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}
                                                />
                                                {prod.imagen_url && (
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-2xl flex items-center justify-center cursor-pointer">
                                                        <span className="material-symbols-outlined text-white text-[20px]">zoom_in</span>
                                                    </div>
                                                )}
                                            </div>
                                            {editingId === prod.id && (
                                                <div className="flex flex-col gap-1 w-48">
                                                    <label className="text-[10px] font-black uppercase text-text-secondary tracking-tighter">URL Imagen</label>
                                                    <input
                                                        type="text"
                                                        value={editValues.imagen_url}
                                                        onChange={(e) => setEditValues(prev => ({ ...prev, imagen_url: e.target.value }))}
                                                        placeholder="Pegar URL aquí..."
                                                        className="w-full px-2 py-1.5 border border-primary/30 rounded-lg text-[11px] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm font-extrabold text-text-main group-hover:text-primary transition-colors leading-tight mb-1">{prod.nombre}</p>
                                            <p className="text-[11px] text-text-secondary line-clamp-2 max-w-[200px] font-medium leading-relaxed italic">
                                                {prod.descripcion || 'Sin descripción...'}
                                            </p>
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
                                        <div className="flex flex-col">
                                            <p className="text-sm font-extrabold text-text-main">${Number(prod.precio).toLocaleString('es-AR')}</p>
                                            {prod.descuento > 0 && (
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase">Oferta activa</p>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {editingId === prod.id ? (
                                        <input
                                            type="number"
                                            value={editValues.descuento}
                                            onChange={(e) => setEditValues(prev => ({ ...prev, descuento: Number(e.target.value) }))}
                                            className="w-16 px-2 py-1 border border-primary rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                                            min="0"
                                            max="100"
                                        />
                                    ) : (
                                        <p className={`text-sm font-bold ${prod.descuento > 0 ? 'text-emerald-600' : 'text-text-secondary opacity-50'}`}>
                                            {prod.descuento > 0 ? `${prod.descuento}%` : '-'}
                                        </p>
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
