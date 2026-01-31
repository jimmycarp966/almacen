'use client'

import { useState, useEffect } from 'react'
import { updateProducto, deleteProducto } from '@/actions/catalog_admin'
import { NumberInput } from '@/components/ui/NumberInput'

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

    // DEBUG: Log en cliente
    useEffect(() => {
        console.log('[DEBUG ProductosTable] initialProductos.length:', initialProductos.length)
        console.log('[DEBUG ProductosTable] productos.length:', productos.length)
        console.log('[DEBUG ProductosTable] Primeros 3 productos:', initialProductos.slice(0, 3).map(p => ({ id: p.id, nombre: p.nombre })))
        setProductos(initialProductos)
    }, [initialProductos])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValues, setEditValues] = useState<{ precio: number | null }>({
        precio: null,
    })
    const [saving, setSaving] = useState(false)

    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    const startEditing = (prod: Producto) => {
        setEditingId(prod.id)
        setEditValues({
            precio: prod.precio,
        })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditValues({ precio: null })
    }

    const saveChanges = async (id: string) => {
        setSaving(true)

        const currentProduct = productos.find(p => p.id === id)
        if (!currentProduct) {
            setSaving(false)
            return
        }

        try {
            const result = await updateProducto(id, {
                precio: editValues.precio ?? currentProduct.precio,
            })

            if (!result.error) {
                const newPrecio = editValues.precio ?? currentProduct.precio

                setProductos(prev => prev.map(p =>
                    p.id === id ? { ...p, precio: newPrecio } : p
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

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return

        const result = await deleteProducto(id)
        if (!result.error) {
            setProductos(prev => prev.filter(p => p.id !== id))
            setDeleteConfirm(null)
        } else {
            alert('Error al eliminar: ' + result.error?.message || 'Error desconocido')
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden -mx-4 lg:mx-0">
            {/* DEBUG INFO */}
            <div className="bg-gray-100 px-4 py-2 text-xs font-mono">
                Mostrando {productos.length} productos
            </div>
            <div className="overflow-x-auto px-2 sm:px-4 lg:px-0">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Producto</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-text-secondary uppercase tracking-wider hidden sm:table-cell">Categoría</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Precio</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-center">Estado</th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {productos.map((prod) => (
                            <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                    <p className="text-sm font-bold text-text-main truncate max-w-[150px] sm:max-w-none">{prod.nombre}</p>
                                    <p className="text-xs text-text-secondary sm:hidden">
                                        {categoriasMap.get(prod.categoria_id) || 'General'}
                                    </p>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                    <span className="px-2 py-1 bg-gray-100 text-text-secondary text-xs font-bold rounded-full">
                                        {categoriasMap.get(prod.categoria_id) || 'General'}
                                    </span>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                    {editingId === prod.id ? (
                                        <NumberInput
                                            value={editValues.precio ?? 0}
                                            onChange={(value) => setEditValues(prev => ({ ...prev, precio: value ?? 0 }))}
                                            className="w-20 sm:w-24 px-2 py-1 border border-primary rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary text-right"
                                            min={0}
                                            step="0.01"
                                        />
                                    ) : (
                                        <p className="text-sm font-extrabold text-text-main">
                                            ${Number(prod.precio).toLocaleString('es-AR')}
                                        </p>
                                    )}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                    <button
                                        onClick={() => toggleActivo(prod)}
                                        className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${prod.activo
                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                    >
                                        {prod.activo ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        {editingId === prod.id ? (
                                            <>
                                                <button
                                                    onClick={() => saveChanges(prod.id)}
                                                    disabled={saving}
                                                    className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">check</span>
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
                                                </button>
                                            </>
                                        ) : deleteConfirm === prod.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleDelete(prod.id)}
                                                    className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Confirmar eliminar"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">check</span>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(null)}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Cancelar"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => startEditing(prod)}
                                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Editar precio"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(prod.id)}
                                                    className="p-1.5 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar producto"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">delete</span>
                                                </button>
                                            </>
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
