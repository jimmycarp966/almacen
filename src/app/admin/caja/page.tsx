'use client'

import { getCajaActual, getMovimientosCaja, abrirCaja, registrarEgreso, cerrarCaja } from '@/actions/cash'
import { useSessionStore } from '@/store/sessionStore'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminCajaPage() {
    const user = useSessionStore((state) => state.user)
    const [caja, setCaja] = useState<any>(null)
    const [movimientos, setMovimientos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [montoInicial, setMontoInicial] = useState('')

    const fetchCaja = async () => {
        setLoading(true)
        const data = await getCajaActual()
        setCaja(data)
        if (data) {
            const ms = await getMovimientosCaja(data.fecha)
            setMovimientos(ms)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchCaja()
    }, [])

    const handleAbrir = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        const monto = parseFloat(montoInicial)
        if (isNaN(monto)) return

        await abrirCaja(monto, user.id)
        fetchCaja()
    }

    const handleEgreso = async () => {
        const monto = prompt('Monto del egreso:')
        const concepto = prompt('Concepto:')
        if (!monto || !concepto) return

        await registrarEgreso(parseFloat(monto), concepto)
        fetchCaja()
    }

    const handleCerrar = async () => {
        if (!confirm('¿Estás seguro de cerrar la caja?')) return
        await cerrarCaja(caja.id)
        fetchCaja()
    }

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

    if (!caja) {
        return (
            <div className="max-w-md mx-auto py-20 space-y-8 animate-fade-in-up">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="material-symbols-outlined text-4xl">lock_open</span>
                    </div>
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Caja Cerrada</h1>
                    <p className="text-text-secondary font-medium">Debes realizar la apertura de caja para comenzar a registrar movimientos hoy.</p>
                </div>

                <form onSubmit={handleAbrir} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-text-secondary uppercase tracking-widest ml-1">Monto Inicial (Saldo en Efectivo)</label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-text-secondary">$</span>
                            <input
                                type="number"
                                required
                                value={montoInicial}
                                onChange={(e) => setMontoInicial(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-10 pr-5 text-text-main font-bold focus:ring-2 focus:ring-primary focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full btn-primary !py-4 shadow-lg shadow-primary/20">
                        Abrir Caja Diaria
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Caja Diaria</h1>
                    <p className="text-text-secondary font-medium uppercase text-xs tracking-widest font-black flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Abierta el {format(new Date(caja.hora_apertura), "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleEgreso} className="px-6 py-3 bg-white border-2 border-red-100 text-red-500 rounded-2xl font-black text-sm hover:bg-red-50 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined">remove_circle_outline</span>
                        Registrar Egreso
                    </button>
                    <button onClick={handleCerrar} className="px-6 py-3 bg-black text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined">lock</span>
                        Cerrar Caja
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Resumen de Caja */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-8 space-y-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-text-main mb-6">Resumen Actual</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Saldo Inicial</span>
                                <span className="text-base font-black text-text-main">${Number(caja.saldo_inicial).toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Ingresos</span>
                                <span className="text-base font-black text-emerald-700">+${movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + Number(m.monto), 0).toLocaleString('es-AR')}</span>
                            </div>
                            <div className="flex justify-between items-center bg-red-50 p-4 rounded-2xl border border-red-100">
                                <span className="text-xs font-bold text-red-700 uppercase tracking-widest">Egresos</span>
                                <span className="text-base font-black text-red-700">-${movimientos.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + Number(m.monto), 0).toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-dashed border-gray-200 mt-6">
                        <p className="text-xs font-black text-text-secondary uppercase tracking-widest mb-1">Efectivo Aproximado en Caja</p>
                        <p className="text-4xl font-black text-primary tracking-tighter">${Number(caja.saldo_actual).toLocaleString('es-AR')}</p>
                    </div>
                </div>

                {/* Listado de Movimientos */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                    <div className="p-8 border-b border-gray-50">
                        <h3 className="text-xl font-bold text-text-main">Movimientos del Día</h3>
                    </div>
                    <div className="overflow-y-auto max-h-[500px]">
                        <table className="w-full text-left border-collapse">
                            <tbody className="divide-y divide-gray-50">
                                {movimientos.length > 0 ? movimientos.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.tipo === 'ingreso' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                                    <span className="material-symbols-outlined text-[20px]">{m.tipo === 'ingreso' ? 'arrow_downward' : 'arrow_upward'}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">{m.concepto}</p>
                                                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{format(new Date(m.fecha_hora), "HH:mm")}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">{m.metodo_pago}</p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <p className={`text-base font-black ${m.tipo === 'ingreso' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {m.tipo === 'ingreso' ? '+' : '-'}${Number(m.monto).toLocaleString('es-AR')}
                                            </p>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center">
                                            <p className="text-text-secondary font-medium">No hay movimientos registrados aún.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
