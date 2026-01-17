'use client'

import { getPagosPendientes, aprobarPago, rechazarPago } from '@/actions/payments'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Usuario {
    nombre: string
    email: string
    telefono?: string
}

interface Pago {
    id: string
    pedido_id: string
    numero: string
    monto: number
    metodo: string
    fecha: string
    fecha_creacion: string
    estado: string
    total: number
    comprobante_url?: string
    usuarios: Usuario
}

export default function AdminPagosPage() {
    const [pagos, setPagos] = useState<Pago[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)

    const fetchPagos = async () => {
        setLoading(true)
        const data = await getPagosPendientes()
        setPagos(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPagos()
    }, [])

    const handleAprobar = async (id: string) => {
        setProcessing(id)
        await aprobarPago(id)
        await fetchPagos()
        setProcessing(null)
    }

    const handleRechazar = async (id: string) => {
        const motivo = prompt('Ingrese el motivo del rechazo:')
        if (!motivo) return

        setProcessing(id)
        await rechazarPago(id, motivo)
        await fetchPagos()
        setProcessing(null)
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-text-main tracking-tight">Validación de Pagos</h1>
                <p className="text-text-secondary font-medium">Revisa las transferencias bancarias y aprueba los pedidos para producción.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : pagos.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-soft py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">check_circle</span>
                    <p className="text-text-secondary font-medium">No hay pagos pendientes de validación.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pagos.map((p) => (
                        <div key={p.id} className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden animate-fade-in">
                            <div className="p-8 flex flex-col lg:flex-row gap-8">
                                {/* Comprobante Preview */}
                                <div className="lg:w-1/3 aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden relative group">
                                    {p.comprobante_url ? (
                                        <img src={p.comprobante_url} alt="Comprobante" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                            <span className="material-symbols-outlined text-4xl">no_photography</span>
                                            <span className="text-xs font-bold uppercase tracking-widest">Sin comprobante adjunto</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button className="bg-white text-black font-bold px-4 py-2 rounded-full text-sm">Ver Pantalla Completa</button>
                                    </div>
                                </div>

                                {/* Pedido Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Pedido #{p.numero}</p>
                                                <h3 className="text-2xl font-black text-text-main">{p.usuarios?.nombre}</h3>
                                                <p className="text-text-secondary font-medium">{p.usuarios?.telefono}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-text-secondary uppercase mb-1">Fecha de Pedido</p>
                                                <p className="text-sm font-bold text-text-main">{format(new Date(p.fecha_creacion), "dd 'de' MMMM, HH:mm", { locale: es })}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Monto a Validar</p>
                                                <p className="text-xl font-black text-text-main">${Number(p.total).toLocaleString('es-AR')}</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-2xl">
                                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Método</p>
                                                <p className="text-xl font-black text-text-main uppercase">Transferencia</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-8">
                                        <button
                                            onClick={() => handleAprobar(p.id)}
                                            disabled={processing === p.id}
                                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">check_circle</span>
                                            {processing === p.id ? 'Procesando...' : 'Aprobar Pago'}
                                        </button>
                                        <button
                                            onClick={() => handleRechazar(p.id)}
                                            disabled={processing === p.id}
                                            className="flex-1 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">cancel</span>
                                            Rechazar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
