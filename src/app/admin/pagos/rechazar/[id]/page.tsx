'use client'

import { getPedido } from '@/actions/orders'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AdminPagoRechazarPage({ params }: PageProps) {
    const { id } = await params
    const pedido = await getPedido(id)

    if (!pedido) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background-light font-display antialiased overflow-hidden h-screen w-full flex text-slate-800">
            {/* Modal Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>

                {/* Modal Card */}
                <div className="relative w-full max-w-[560px] transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all border-t-8 border-primary flex flex-col">
                    {/* Close Button (Top Right) */}
                    <Link 
                        href={`/admin/pagos/aprobar/${id}`}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600:text-slate-300 transition-colors rounded-full hover:bg-gray-100:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        <span className="material-symbols-outlined text-[24px]">close</span>
                    </Link>

                    {/* Modal Content Wrapper */}
                    <div className="px-8 pt-10 pb-8 flex flex-col gap-6">
                        {/* Header Section */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50/20 text-primary">
                                    <span className="material-symbols-outlined text-[24px]">payments</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Rechazar Pago</h3>
                            </div>

                            {/* Context Pill */}
                            <div className="flex items-center gap-2 mt-1 ml-1">
                                <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                    Pedido #{pedido.numero}
                                </span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs font-medium text-slate-500">{pedido.usuarios?.telefono || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Body Text */}
                        <div className="bg-red-50/10 border-l-4 border-red-200 p-4 rounded-r-md">
                            <p className="text-slate-700 text-sm leading-relaxed">
                                Por favor, indica el motivo del rechazo. Este mensaje será <span className="font-semibold text-slate-900">enviado automáticamente</span> al cliente vía email y notificación push.
                            </p>
                        </div>

                        {/* Form Section */}
                        <div className="flex flex-col gap-2">
                            <label className="flex justify-between items-end" htmlFor="reason">
                                <span className="text-slate-900 text-sm font-semibold">Motivo del Rechazo</span>
                                <span className="text-slate-400 text-xs font-medium">Requerido</span>
                            </label>
                            <div className="relative group">
                                <textarea 
                                    className="block w-full rounded-xl border-0 py-4 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary:ring-primary sm:text-base sm:leading-relaxed resize-none transition-all ease-in-out duration-200" 
                                    id="reason" 
                                    name="reason" 
                                    placeholder="Ej: El comprobante adjunto es ilegible o no corresponde al monto total del pedido. Por favor, sube nuevamente el comprobante correcto..." 
                                    rows={5}
                                ></textarea>
                                {/* Focus decoration */}
                                <div className="absolute inset-0 rounded-xl pointer-events-none ring-0 group-focus-within:ring-2 ring-primary/10"></div>
                            </div>

                            {/* Helper Suggestions */}
                            <div className="flex gap-2 mt-1 flex-wrap">
                                <button className="text-xs bg-gray-50 hover:bg-gray-100:bg-slate-700 text-slate-500 px-3 py-1.5 rounded-full border border-gray-200 transition-colors">
                                    Comprobante Ilegible
                                </button>
                                <button className="text-xs bg-gray-50 hover:bg-gray-100:bg-slate-700 text-slate-500 px-3 py-1.5 rounded-full border border-gray-200 transition-colors">
                                    Monto Incorrecto
                                </button>
                                <button className="text-xs bg-gray-50 hover:bg-gray-100:bg-slate-700 text-slate-500 px-3 py-1.5 rounded-full border border-gray-200 transition-colors">
                                    Comprobante Vencido
                                </button>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4 pt-6 border-t border-slate-100/50">
                            <Link 
                                href="/admin/pagos/aprobar/[id]"
                                className="group flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900:text-white hover:bg-slate-50:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                <span className="mr-2 hidden group-hover:inline-block transition-all transform scale-0 group-hover:scale-100 duration-200">
                                    <span className="material-symbols-outlined text-[18px] align-middle">arrow_back</span>
                                </span>
                                Volver
                            </Link>
                            <button className="relative overflow-hidden flex flex-1 sm:flex-none sm:min-w-[240px] items-center justify-center rounded-lg bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/20 hover:bg-primary-dark hover:shadow-red-900/30 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary:ring-offset-surface-dark">
                                <span className="material-symbols-outlined text-[20px] mr-2">send</span>
                                <span>Confirmar Rechazo y Notificar</span>
                            </button>
                        </div>
                    </div>

                    {/* Bottom decorative line */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-100/30 to-transparent opacity-50"></div>
                </div>
            </div>
        </div>
    )
}
