'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GestionInventarioAdmin2Page() {
    const [searchTerm, setSearchTerm] = useState('')
    const [categoriaFiltro, setCategoriaFiltro] = useState('')

    const productos = [
        { id: 1, nombre: 'Camiseta Básica Negra', sku: 'CM-001-BLK', categoria: 'ropa', stock: 120, precio: 25, imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200', estado: 'normal' },
        { id: 2, nombre: 'Zapatillas Deportivas', sku: 'SH-230-RED', categoria: 'calzado', stock: 5, precio: 89.99, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200', estado: 'bajo' },
        { id: 3, nombre: 'Pantalón Jeans Slim', sku: 'JN-555-BLU', categoria: 'ropa', stock: 45, precio: 45.50, imagen: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=200', estado: 'normal' },
        { id: 4, nombre: 'Auriculares Bluetooth', sku: 'AU-900-WHT', categoria: 'electronica', stock: 2, precio: 120, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', estado: 'critico' },
        { id: 5, nombre: 'Reloj Inteligente V2', sku: 'SW-202-BLK', categoria: 'electronica', stock: 30, precio: 150, imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200', estado: 'normal' },
    ]

    const getStockBadge = (stock: number, estado: string) => {
        if (estado === 'critico') {
            return (
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    {stock} unidades (Crítico)
                </div>
            )
        } else if (estado === 'bajo') {
            return (
                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                    {stock} unidades (Bajo)
                </div>
            )
        }
        return (
            <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {stock} unidades
            </div>
        )
    }

    const getRowBackground = (estado: string) => {
        if (estado === 'critico' || estado === 'bajo') {
            return 'bg-red-50/30/10'
        }
        return ''
    }

    return (
        <div className="min-h-screen bg-background-light text-[#171212] font-display antialiased overflow-x-hidden">
            <div className="min-h-screen flex flex-col">
                {/* Top Navigation */}
                <header className="sticky top-0 z-50 w-full bg-white/90[#181b20]/90 backdrop-blur-md border-b border-[#f4f1f1]">
                    <div className="flex items-center justify-between px-6 py-4 max-w-[1440px] mx-auto w-full">
                        <div className="flex items-center gap-4">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-3xl">inventory_2</span>
                            </div>
                            <h2 className="text-[#171212] text-xl font-bold leading-tight tracking-tight">Gestión de Inventario</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            {/* Notifications */}
                            <button className="relative text-gray-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-0 right-0 size-2 bg-primary rounded-full border-2 border-white"></span>
                            </button>
                            {/* Profile */}
                            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-[#171212]">Admin Principal</p>
                                    <p className="text-xs text-gray-500">admin@empresa.com</p>
                                </div>
                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-gray-100 bg-gray-200"></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 w-full max-w-[1440px] mx-auto px-6 py-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[#171212] tracking-tight">Productos</h1>
                            <p className="text-gray-500 mt-1">Gestiona tu catálogo, stock y precios desde aquí.</p>
                        </div>
                        <Link 
                            href="/admin/productos/agregar"
                            className="flex items-center justify-center gap-2 bg-primary hover:bg-red-700 text-white font-bold h-12 px-6 rounded-lg transition-colors shadow-lg shadow-red-900/10"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>Agregar Nuevo Producto</span>
                        </Link>
                    </div>

                    {/* Toolbar / Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                        {/* Search */}
                        <div className="md:col-span-5 lg:col-span-4 relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined">search</span>
                            </span>
                            <input 
                                className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400" 
                                placeholder="Buscar por nombre, SKU o etiqueta..." 
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="md:col-span-3 lg:col-span-3 relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <span className="material-symbols-outlined">filter_list</span>
                            </span>
                            <select 
                                className="w-full h-12 pl-12 pr-10 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer text-gray-600"
                                value={categoriaFiltro}
                                onChange={(e) => setCategoriaFiltro(e.target.value)}
                            >
                                <option value="">Todas las Categorías</option>
                                <option value="ropa">Ropa</option>
                                <option value="calzado">Calzado</option>
                                <option value="electronica">Electrónica</option>
                                <option value="accesorios">Accesorios</option>
                            </select>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <span className="material-symbols-outlined text-sm">expand_more</span>
                            </span>
                        </div>

                        {/* Spacer */}
                        <div className="hidden md:block md:col-span-1 lg:col-span-2"></div>

                        {/* Export/More Actions */}
                        <div className="md:col-span-3 lg:col-span-3 flex justify-end gap-2">
                            <button className="h-12 px-4 border border-gray-200 bg-white rounded-lg text-gray-600 hover:bg-gray-50:bg-gray-700 font-medium text-sm flex items-center gap-2 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Exportar CSV
                            </button>
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50/50 border-b border-gray-200">
                                        <th className="p-4 pl-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-20">Imagen</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre del Producto</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock Actual</th>
                                        <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Precio Unitario</th>
                                        <th className="p-4 pr-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-32">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {productos.map((producto) => (
                                        <tr key={producto.id} className={`group hover:bg-gray-50:bg-gray-700/50 transition-colors ${getRowBackground(producto.estado)}`}>
                                            <td className="p-4 pl-6">
                                                <div className="size-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                    <img className="w-full h-full object-cover" src={producto.imagen} alt={producto.nombre}/>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-[#171212]">{producto.nombre}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">SKU: {producto.sku}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                    {producto.categoria.charAt(0).toUpperCase() + producto.categoria.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {getStockBadge(producto.stock, producto.estado)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="font-medium text-[#171212]">${producto.precio.toFixed(2)}</span>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all" title="Editar">
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    <button className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-all" title="Eliminar">
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/30 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-gray-500">Mostrando <span className="font-bold text-[#171212]">1-5</span> de <span className="font-bold text-[#171212]">58</span> resultados</p>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium">
                                    Anterior
                                </button>
                                <div className="flex items-center gap-1">
                                    <button className="size-9 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">1</button>
                                    <button className="size-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors">2</button>
                                    <button className="size-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors">3</button>
                                    <span className="text-gray-400 px-1">...</span>
                                    <button className="size-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-sm font-medium transition-colors">12</button>
                                </div>
                                <button className="px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors text-sm font-medium flex items-center gap-1">
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
