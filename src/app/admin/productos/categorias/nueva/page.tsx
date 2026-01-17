'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminProductosCategoriasNuevaPage() {
    const [nombre, setNombre] = useState('')
    const [icono, setIcono] = useState('sell')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Creando categoría:', { nombre, icono })
        // Aquí iría la lógica para crear la categoría
    }

    const iconos = [
        { value: 'sell', label: 'Etiqueta', icon: 'sell' },
        { value: 'devices', label: 'Dispositivos', icon: 'devices' },
        { value: 'checkroom', label: 'Ropa', icon: 'checkroom' },
        { value: 'chair', label: 'Hogar', icon: 'chair' },
        { value: 'build', label: 'Herramientas', icon: 'build' },
        { value: 'grocery', label: 'Alimentos', icon: 'grocery' },
        { value: 'sports_soccer', label: 'Deportes', icon: 'sports_soccer' },
        { value: 'inventory_2', label: 'Otros', icon: 'inventory_2' },
    ]

    return (
        <div className="min-h-screen bg-background-light font-display min-h-screen flex items-center justify-center relative overflow-hidden text-[#171212]">
            {/* Decorative background elements */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-100 to-transparent"></div>
                <div className="container mx-auto px-10 pt-32 hidden md:block">
                    <div className="h-12 w-full bg-gray-200/50/50 rounded-lg mb-4"></div>
                    <div className="h-12 w-3/4 bg-gray-100/50/30 rounded-lg mb-4"></div>
                    <div className="h-12 w-5/6 bg-gray-100/50/30 rounded-lg mb-4"></div>
                    <div className="h-12 w-full bg-gray-100/50/30 rounded-lg mb-4"></div>
                </div>
            </div>

            {/* Backdrop Overlay */}
            <div className="fixed inset-0 bg-white/60/60 backdrop-blur-sm z-10 transition-opacity"></div>

            {/* Modal Container */}
            <div className="relative z-20 w-full max-w-[440px] m-4">
                <div className="bg-surface-light rounded-2xl shadow-modal border border-gray-100 flex flex-col overflow-hidden transform transition-all">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-2">
                        <h2 className="text-2xl font-bold tracking-tight text-[#171212]">Nueva Categoría</h2>
                        <p className="text-sm text-gray-500 mt-1">Define los detalles para organizar tus productos.</p>
                    </div>

                    {/* Form Content */}
                    <form onSubmit={handleSubmit} className="px-8 py-4 flex flex-col gap-6">
                        {/* Category Name Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-[#171212]" htmlFor="category-name">
                                Nombre de la Categoría
                            </label>
                            <input
                                autoFocus
                                className="w-full h-12 px-4 rounded-lg bg-white border border-gray-200 text-[#171212] placeholder:text-gray-400 focus:outline-none focus:border-black:border-white focus:ring-0 transition-colors shadow-sm"
                                id="category-name"
                                placeholder="Ej. Electrónica, Ropa, Hogar..."
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        {/* Icon Picker */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-[#171212]">Icono Representativo</p>
                            <div className="grid grid-cols-4 gap-3">
                                {iconos.map((item) => (
                                    <label key={item.value} className="cursor-pointer relative">
                                        <input
                                            className="peer sr-only"
                                            name="category_icon"
                                            type="radio"
                                            value={item.value}
                                            checked={icono === item.value}
                                            onChange={() => setIcono(item.value)}
                                        />
                                        <div className="h-12 w-full flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50:bg-gray-700 transition-all peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary">
                                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </form>

                    {/* Footer Buttons */}
                    <div className="px-8 pb-8 pt-6 flex flex-col-reverse sm:flex-row gap-3">
                        <Link
                            href="/admin/productos"
                            className="flex-1 h-12 items-center justify-center rounded-lg bg-[#17191c] text-white text-base font-bold hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-500 focus:outline-none flex"
                        >
                            Cerrar
                        </Link>
                        <button
                            type="submit"
                            className="flex-1 h-12 items-center justify-center rounded-lg bg-primary text-white text-base font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/25 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none flex"
                        >
                            Crear Categoría
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
