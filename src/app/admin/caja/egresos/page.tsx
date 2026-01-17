'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminCajaEgresosPage() {
    const [concepto, setConcepto] = useState('')
    const [monto, setMonto] = useState('')
    const [categoria, setCategoria] = useState('')
    const [metodo, setMetodo] = useState('efectivo')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Registrando egreso:', { concepto, monto, categoria, metodo })
        // Aquí iría la lógica para guardar el egreso
    }

    return (
        <div className="min-h-screen bg-gray-100 font-display flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <div className="fixed inset-0 bg-[#242628]/70 backdrop-blur-[2px] z-40 transition-opacity"></div>

            {/* Modal Container */}
            <div className="relative z-50 w-full max-w-[580px] flex flex-col bg-background-light rounded-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                {/* Header Section */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-[#171212] text-[28px] font-extrabold leading-tight tracking-tight">
                            Registrar Egreso
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                            Detalla la salida de dinero de la caja
                        </p>
                    </div>
                    {/* Decorative Icon */}
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary rotate-12">
                        <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="px-8 py-4 flex flex-col gap-6">
                    {/* Field: Concepto / Descripción */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#171212] text-sm font-bold uppercase tracking-wider" htmlFor="concepto">
                            Concepto / Descripción
                        </label>
                        <div className="relative">
                            <input
                                className="w-full h-14 bg-gray-50 border border-gray-200 rounded-lg px-4 text-base text-[#171212] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black:ring-white focus:border-transparent transition-all"
                                id="concepto"
                                placeholder="Ej. Pago a proveedores"
                                type="text"
                                value={concepto}
                                onChange={(e) => setConcepto(e.target.value)}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                            </div>
                        </div>
                    </div>

                    {/* Field: Monto (Highlighted with Red) */}
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-between text-[#171212] text-sm font-bold uppercase tracking-wider" htmlFor="monto">
                            <span>Monto del Retiro</span>
                            <span className="text-primary text-[10px] bg-primary/10 px-2 py-0.5 rounded-full font-bold">REQUERIDO</span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center pointer-events-none">
                                <span className="text-primary font-bold text-xl">$</span>
                            </div>
                            <input
                                className="w-full h-16 pl-12 pr-4 bg-white border-2 border-primary rounded-lg text-2xl font-bold text-[#171212] placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-glow"
                                id="monto"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                min="0"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Row: Two Columns for Selects */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Field: Categoría */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#171212] text-sm font-bold uppercase tracking-wider" htmlFor="categoria">
                                Categoría
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full h-14 appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 text-base text-[#171212] focus:outline-none focus:ring-2 focus:ring-black:ring-white focus:border-transparent transition-all cursor-pointer"
                                    id="categoria"
                                    value={categoria}
                                    onChange={(e) => setCategoria(e.target.value)}
                                    required
                                >
                                    <option disabled selected value="">Seleccionar...</option>
                                    <option value="servicios">Servicios</option>
                                    <option value="proveedores">Proveedores</option>
                                    <option value="nomina">Nómina</option>
                                    <option value="varios">Varios</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center">
                                    <span className="material-symbols-outlined">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* Field: Método de Pago */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#171212] text-sm font-bold uppercase tracking-wider" htmlFor="metodo">
                                Método de Pago
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full h-14 appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-4 pr-10 text-base text-[#171212] focus:outline-none focus:ring-2 focus:ring-black:ring-white focus:border-transparent transition-all cursor-pointer"
                                    id="metodo"
                                    value={metodo}
                                    onChange={(e) => setMetodo(e.target.value)}
                                >
                                    <option value="efectivo">Efectivo</option>
                                    <option value="tarjeta">Tarjeta</option>
                                    <option value="transferencia">Transferencia</option>
                                    <option value="cheque">Cheque</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none flex items-center">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Action Footer */}
                <div className="p-8 pt-4 mt-2 flex flex-col-reverse sm:flex-row gap-4 sm:items-center sm:justify-end">
                    {/* Secondary Button: Cancelar (Red Border, Black Text) */}
                    <Link
                        href="/admin/caja"
                        className="flex-1 sm:flex-none h-14 px-8 rounded-lg border-2 border-primary bg-transparent text-[#171212] font-bold text-base hover:bg-red-50:bg-red-900/20 active:scale-95 transition-transform duration-150 flex items-center justify-center"
                    >
                        Cancelar
                    </Link>
                    {/* Primary Button: Registrar (Solid Red) */}
                    <button
                        type="submit"
                        className="flex-1 sm:flex-none h-14 px-10 rounded-lg bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 hover:bg-red-700 active:scale-95 transition-all duration-150 flex items-center justify-center gap-2"
                    >
                        <span>Registrar Gasto</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>

                {/* Decorative subtle footer bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-primary via-red-500 to-black"></div>
            </div>
        </div>
    )
}
