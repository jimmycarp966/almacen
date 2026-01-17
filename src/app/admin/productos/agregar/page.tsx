'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminProductosAgregarPage() {
    const [nombre, setNombre] = useState('')
    const [categoria, setCategoria] = useState('')
    const [precio, setPrecio] = useState('')
    const [stock, setStock] = useState('')
    const [descripcion, setDescripcion] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Guardando producto:', { nombre, categoria, precio, stock, descripcion })
        // Aquí iría la lógica para guardar el producto
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-[#181111] flex flex-col antialiased selection:bg-primary/20 selection:text-primary">
            <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
                {/* Main Card Container */}
                <main className="w-full max-w-[1024px] bg-white[#202020] rounded-2xl shadow-xl border border-neutral-100 overflow-hidden flex flex-col md:flex-row">
                    {/* Visual Sidebar / Context */}
                    <div className="hidden md:flex md:w-16 bg-neutral-50[#252525] border-r border-neutral-100 flex-col items-center py-8 gap-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-lg">inventory_2</span>
                        </div>
                        <div className="flex-1 w-[1px] bg-gradient-to-b from-neutral-200 to-transparent"></div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 p-8 md:p-10 lg:p-12">
                        {/* Header */}
                        <header className="mb-10 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider">
                                <span className="material-symbols-outlined text-base">add_circle</span>
                                <span>Catálogo</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#181111]">
                                Agregar Nuevo Producto
                            </h1>
                            <p className="text-neutral-500 max-w-xl">
                                Complete la información a continuación para publicar un nuevo artículo en el catálogo de ventas.
                            </p>
                        </header>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            {/* Section 1: Top Layout with Image & Key Data */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Upload Zone */}
                                <div className="lg:col-span-5 order-last lg:order-first">
                                    <label className="block text-sm font-bold text-[#181111] mb-2">
                                        Imagen del Producto
                                    </label>
                                    <div className="relative group w-full h-full min-h-[240px] rounded-xl border-2 border-dashed border-primary bg-primary/[0.02] hover:bg-primary/[0.04] transition-all duration-300 flex flex-col items-center justify-center text-center p-6 cursor-pointer overflow-hidden">
                                        <div className="w-16 h-16 rounded-full bg-white[#303030] shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-neutral-100">
                                            <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                                        </div>
                                        <p className="text-[#181111] font-bold text-lg mb-1">Subir Imagen</p>
                                        <p className="text-sm text-neutral-500 mb-4 max-w-[200px]">
                                            Arrastra tu imagen aquí o haz clic para explorar
                                        </p>
                                        <span className="text-xs font-mono text-neutral-400 bg-white/20 px-2 py-1 rounded">
                                            JPG, PNG (Max 5MB)
                                        </span>
                                        <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" accept="image/*" />
                                    </div>
                                </div>

                                {/* Core Details */}
                                <div className="lg:col-span-7 flex flex-col gap-6">
                                    {/* Product Name */}
                                    <div className="group/input">
                                        <label className="block text-sm font-bold text-[#181111] mb-2">
                                            Nombre del producto
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="w-full h-14 pl-4 pr-4 rounded-lg border border-neutral-200 bg-white[#252525] text-[#181111] placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                                placeholder="Ej. Silla Ergonómica Pro"
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 group-focus-within/input:text-primary transition-colors">
                                                <span className="material-symbols-outlined">edit</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Select */}
                                    <div className="group/select">
                                        <label className="block text-sm font-bold text-[#181111] mb-2">
                                            Categoría
                                        </label>
                                        <div className="relative">
                                            <select
                                                className="w-full h-14 pl-4 pr-10 rounded-lg border border-neutral-200 bg-white[#252525] text-[#181111] appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 cursor-pointer"
                                                value={categoria}
                                                onChange={(e) => setCategoria(e.target.value)}
                                                required
                                            >
                                                <option disabled selected value="">Seleccionar categoría...</option>
                                                <option value="mob">Mobiliario de Oficina</option>
                                                <option value="elec">Electrónica y Gadgets</option>
                                                <option value="stat">Papelería Corporativa</option>
                                                <option value="acc">Accesorios de Escritorio</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-500 group-focus-within/select:text-primary transition-colors">
                                                <span className="material-symbols-outlined">expand_more</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price & Stock Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group/price">
                                            <label className="block text-sm font-bold text-[#181111] mb-2">
                                                Precio ($)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-500 font-bold">$</span>
                                                <input
                                                    className="w-full h-14 pl-8 pr-4 rounded-lg border border-neutral-200 bg-white[#252525] text-[#181111] placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                                    placeholder="0.00"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={precio}
                                                    onChange={(e) => setPrecio(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-[#181111] mb-2">
                                                Stock inicial
                                            </label>
                                            <input
                                                className="w-full h-14 px-4 rounded-lg border border-neutral-200 bg-white[#252525] text-[#181111] placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                                                placeholder="0"
                                                type="number"
                                                min="0"
                                                value={stock}
                                                onChange={(e) => setStock(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description Area */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <label className="block text-sm font-bold text-[#181111]">
                                        Descripción breve
                                    </label>
                                    <span className="text-xs text-neutral-400 font-medium">{descripcion.length}/300 caracteres</span>
                                </div>
                                <textarea
                                    className="w-full min-h-[120px] p-4 rounded-lg border border-neutral-200 bg-white[#252525] text-[#181111] placeholder:text-neutral-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 resize-y"
                                    placeholder="Describa las características clave del producto, materiales y beneficios..."
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    maxLength={300}
                                ></textarea>
                            </div>

                            {/* Divider */}
                            <div className="h-px w-full bg-neutral-100 my-2"></div>

                            {/* Footer Actions */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                                <Link
                                    href="/admin/productos"
                                    className="w-full sm:w-auto px-6 h-12 rounded-lg text-sm font-bold text-neutral-500 hover:text-[#181111]:text-white hover:bg-neutral-50:bg-neutral-800 transition-colors duration-200 flex items-center justify-center"
                                >
                                    Cancelar
                                </Link>
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="flex-1 sm:hidden"></div>
                                    <button
                                        type="submit"
                                        className="group relative w-full sm:w-auto px-8 h-12 rounded-lg bg-primary hover:bg-[#c01515] text-white text-sm font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                                        <span>Guardar Producto</span>
                                        <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Background Decorative Elements */}
                <div className="fixed top-0 left-0 w-full h-1 bg-primary z-50"></div>
                <div className="fixed bottom-0 right-0 p-8 pointer-events-none opacity-5 z-0">
                    <span className="material-symbols-outlined text-[200px] text-neutral-900 rotate-12">shopping_bag</span>
                </div>
            </div>
        </div>
    )
}
