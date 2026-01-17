'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminCajaCerrarPage() {
    const [observaciones, setObservaciones] = useState('')
    const [confirmado, setConfirmado] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!confirmado) {
            alert('Debes confirmar que has contado el efectivo físico')
            return
        }
        console.log('Cerrando caja:', { observaciones })
        // Aquí iría la lógica para cerrar la caja
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 flex flex-col">
            {/* Top Navbar */}
            <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/caja" className="size-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">point_of_sale</span>
                        </Link>
                        <h2 className="text-lg font-bold tracking-tight">AdminPanel</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Dashboard</Link>
                        <Link href="/admin/pedidos" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Ventas</Link>
                        <Link href="/admin/caja" className="text-sm font-bold text-primary transition-colors relative after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-primary">Caja</Link>
                        <Link href="/admin/productos" className="text-sm font-medium text-gray-500 hover:text-primary transition-colors">Inventario</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 pr-4 border-r border-gray-100">
                            <span className="text-xs text-gray-500 text-right">
                                <span className="block font-bold text-gray-900">Admin</span>
                                <span className="block">Sucursal #01</span>
                            </span>
                            <div className="size-8 rounded-full bg-gray-100 overflow-hidden">
                                <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-gray-400">person</span>
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-primary">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center py-10 px-4 sm:px-6">
                <div className="w-full max-w-[800px] flex flex-col gap-8">
                    {/* Page Heading */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider mb-1">
                                <span className="material-symbols-outlined text-base">lock_clock</span>
                                Cierre Diario
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                                Confirmación Cierre de Caja
                            </h1>
                            <p className="text-gray-500 text-sm md:text-base mt-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">calendar_today</span>
                                {format(new Date(), "d MMMM yyyy", { locale: es })}
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="material-symbols-outlined text-base">badge</span>
                                Caja #04
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/admin/caja" className="text-gray-500 hover:text-gray-900:text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                                Cancelar
                            </Link>
                            {/* Small visual indicator of status */}
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Sistema Online
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Ingresos */}
                        <div className="bg-surface-light border border-gray-200 rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-6xl">trending_up</span>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Ingresos</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">$1,250.00</span>
                            </div>
                            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-auto">
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                                +12% vs ayer
                            </div>
                        </div>

                        {/* Egresos */}
                        <div className="bg-surface-light border border-gray-200 rounded-xl p-6 flex flex-col gap-3 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="material-symbols-outlined text-6xl">trending_down</span>
                            </div>
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Total Egresos</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">$430.00</span>
                            </div>
                            <div className="text-xs text-gray-400 font-medium mt-auto">
                                24 movimientos registrados
                            </div>
                        </div>

                        {/* Saldo Final */}
                        <div className="bg-white border-2 border-primary/10/20 rounded-xl p-6 flex flex-col gap-3 shadow-lg shadow-primary/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full -mr-4 -mt-4"></div>
                            <p className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                                Saldo Final
                            </p>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-4xl font-extrabold text-gray-900 tracking-tight">$820.00</span>
                            </div>
                            <div className="text-xs text-gray-500 font-medium mt-auto relative z-10">
                                Cierre automático a las 23:59
                            </div>
                        </div>
                    </div>

                    {/* Form Area */}
                    <form onSubmit={handleSubmit} className="bg-surface-light border border-gray-200 rounded-xl p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">edit_note</span>
                                Observaciones Finales
                            </h3>
                            <p className="text-sm text-gray-500">
                                Ingrese cualquier discrepancia, billetes dañados o notas importantes para el supervisor antes de cerrar.
                            </p>
                        </div>

                        <div className="relative group">
                            <textarea
                                className="peer w-full min-h-[160px] rounded-lg border-2 border-gray-200 bg-white p-4 text-base text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-0 focus:outline-none transition-all resize-none shadow-sm"
                                id="notes"
                                placeholder="Ej: Diferencia de -$0.50 en monedas, retiro de efectivo programado para mañana..."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                maxLength={500}
                            ></textarea>
                            <label className="absolute right-4 bottom-4 text-xs font-medium text-gray-400 peer-focus:text-primary transition-colors" htmlFor="notes">
                                Máximo 500 caracteres
                            </label>
                        </div>

                        {/* Critical Checkbox */}
                        <label className="flex items-start gap-3 p-4 bg-orange-50/10 rounded-lg border border-orange-100/20 cursor-pointer group">
                            <div className="relative flex items-center mt-0.5">
                                <input
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-orange-300 bg-white checked:border-orange-500 checked:bg-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    type="checkbox"
                                    checked={confirmado}
                                    onChange={(e) => setConfirmado(e.target.checked)}
                                />
                                <span className="material-symbols-outlined absolute pointer-events-none opacity-0 peer-checked:opacity-100 text-white text-sm left-[2px] top-[2px]">check</span>
                            </div>
                            <div className="flex flex-col text-sm">
                                <span className="font-bold text-gray-800">Confirmo que he contado el efectivo físico</span>
                                <span className="text-gray-500/60 text-xs">Esta acción generará el reporte Z y no podrá deshacerse.</span>
                            </div>
                        </label>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <div className="text-xs text-gray-400 text-center md:text-left order-2 md:order-1 max-w-[300px]">
                            Al confirmar, se enviará una notificación automática al gerente de sucursal.
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-auto order-1 md:order-2 group relative overflow-hidden rounded-lg bg-primary px-10 py-4 text-white font-bold text-base shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 active:shadow-md"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined group-hover:animate-pulse">lock</span>
                                Confirmar Cierre de Caja
                            </span>
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-white/20 transition-transform duration-500 ease-in-out skew-x-12 origin-left"></div>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer subtle branding */}
            <footer className="py-6 text-center text-xs text-gray-300">
                AdminPanel System v4.2 • Secure Connection
            </footer>
        </div>
    )
}
