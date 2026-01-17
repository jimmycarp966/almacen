'use client'

import { getPedido } from '@/actions/orders'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AdminPagoAprobarPage({ params }: PageProps) {
    const { id } = await params
    const pedido = await getPedido(id)

    if (!pedido) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-[#181111] flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e5dcdc] bg-white px-8 py-4 h-16 shrink-0 z-10 sticky top-0">
                <div className="flex items-center gap-4 text-[#181111]">
                    <Link href="/admin/pagos" className="size-6 text-primary">
                        <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </Link>
                    <h2 className="text-[#181111] text-lg font-bold leading-tight tracking-[-0.015em]">Admin Portal</h2>
                </div>
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-gray-600">notifications</span>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 ring-2 ring-gray-100 bg-neutral-200"></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 w-full">
                {/* Central Modal Container */}
                <div className="bg-white rounded-lg shadow-soft-xl w-full max-w-[1200px] flex flex-col lg:flex-row overflow-hidden border border-gray-100 min-h-[700px]">
                    {/* Left Column: Visual Evidence (Receipt) */}
                    <div className="w-full lg:w-[45%] bg-[#F2F2F2] border-r border-[#e5dcdc] relative flex flex-col group/preview">
                        {/* Toolbar overlay */}
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <button className="bg-white/90 backdrop-blur shadow-sm p-2 rounded hover:bg-white transition-colors text-gray-700" title="Zoom In">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                            </button>
                            <button className="bg-white/90 backdrop-blur shadow-sm p-2 rounded hover:bg-white transition-colors text-gray-700" title="Open in new tab">
                                <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                            </button>
                        </div>
                        {/* Image Container */}
                        <div className="flex-1 overflow-auto custom-scrollbar flex items-center justify-center p-8 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                            <div className="relative shadow-lg rotate-1 transition-transform duration-500 hover:rotate-0 bg-white p-2">
                                <div className="w-[400px] h-[600px] bg-white flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                                    <span className="material-symbols-outlined text-6xl text-gray-400">receipt_long</span>
                                    <p className="text-gray-400 mt-4 text-sm">Comprobante de Pago</p>
                                    <p className="text-gray-300 text-xs mt-2">#{pedido.numero}</p>
                                </div>
                            </div>
                        </div>
                        {/* Footer label */}
                        <div className="bg-white border-t border-[#e5dcdc] p-3 text-xs text-center text-gray-500 font-medium uppercase tracking-wider">
                            Archivo: comprobante_{pedido.numero}.jpg • 1.2 MB
                        </div>
                    </div>

                    {/* Right Column: Decision Panel */}
                    <div className="w-full lg:w-[55%] flex flex-col">
                        {/* Panel Header */}
                        <div className="px-8 pt-8 pb-4 border-b border-[#f4f0f0] flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-[11px] font-bold tracking-wide uppercase border border-yellow-200">Pendiente de Aprobación</span>
                                    <span className="text-xs text-gray-400 font-medium">Hace 2 horas</span>
                                </div>
                                <h1 className="text-[#181111] text-2xl font-bold leading-tight tracking-[-0.02em]">Validación de Transferencia #{pedido.numero}</h1>
                                <p className="text-gray-500 text-sm mt-1">Revisión manual requerida por alerta de monto.</p>
                            </div>
                            <button className="text-gray-400 hover:text-gray-900 transition-colors">
                                <span className="material-symbols-outlined">more_vert</span>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6">
                            {/* Details Grid */}
                            <div className="grid grid-cols-[30%_1fr] gap-y-6 text-sm mb-8">
                                <div className="text-[#886364] font-medium">Cliente</div>
                                <div className="text-[#181111] font-semibold flex items-center gap-2">
                                    {pedido.usuarios?.telefono || 'N/A'}
                                    <span className="material-symbols-outlined text-[16px] text-blue-500" title="Verified Customer">verified</span>
                                </div>
                                <div className="text-[#886364] font-medium">Método de Pago</div>
                                <div className="text-[#181111] capitalize">{pedido.metodo_pago}</div>
                                <div className="text-[#886364] font-medium">Fecha de Emisión</div>
                                <div className="text-[#181111]">{format(new Date(pedido.fecha_creacion), "d MMM, yyyy - HH:mm", { locale: es })}</div>
                                <div className="text-[#886364] font-medium">Nº Operación</div>
                                <div className="text-[#181111] font-mono bg-gray-50 px-2 py-1 rounded w-fit border border-gray-100">TR-{pedido.numero}</div>
                            </div>

                            {/* Highlighted Amount */}
                            <div className="bg-background-light rounded-lg p-6 mb-8 border border-[#e5dcdc] flex items-center justify-between">
                                <span className="text-[#886364] text-sm font-semibold uppercase tracking-wider">Monto Total</span>
                                <div className="text-right">
                                    <h2 className="text-3xl font-bold tracking-tight text-[#181111]">${Number(pedido.total).toLocaleString('es-AR')}</h2>
                                    <p className="text-xs text-gray-500 mt-1">Tipo de cambio aplicado: 1.00</p>
                                </div>
                            </div>

                            {/* Input Field */}
                            <div className="mb-2">
                                <label className="block text-[#181111] text-sm font-bold mb-2" htmlFor="internal-note">
                                    Nota interna / Motivo de rechazo
                                </label>
                                <div className="relative">
                                    <textarea 
                                        className="w-full rounded-lg border-gray-300 bg-white text-[#181111] placeholder:text-gray-400 focus:border-primary focus:ring-primary focus:ring-1 min-h-[120px] p-4 text-sm shadow-sm transition-all resize-none" 
                                        id="internal-note" 
                                        placeholder="Escribe una nota interna o explica el motivo si vas a rechazar el pago..."
                                    ></textarea>
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">Opcional</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="px-8 py-6 border-t border-[#f4f0f0] bg-white sticky bottom-0">
                            <div className="grid grid-cols-2 gap-4">
                                <Link 
                                    href={`/admin/pagos/rechazar/${id}`}
                                    className="flex items-center justify-center h-12 px-6 rounded-lg border-2 border-[#181111] text-[#181111] bg-white hover:bg-gray-50 font-bold transition-all focus:ring-2 focus:ring-gray-200 focus:outline-none group"
                                >
                                    <span className="material-symbols-outlined mr-2 text-[20px] group-hover:scale-110 transition-transform">close</span>
                                    Rechazar Pago
                                </Link>
                                <button className="flex items-center justify-center h-12 px-6 rounded-lg bg-primary text-white font-bold hover:bg-[#d42029] shadow-md shadow-red-100 transition-all focus:ring-2 focus:ring-red-200 focus:ring-offset-2 focus:outline-none group">
                                    <span className="material-symbols-outlined mr-2 text-[20px] group-hover:scale-110 transition-transform">check</span>
                                    Aprobar Pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Help Text */}
                <p className="mt-6 text-gray-400 text-xs text-center">
                    Presiona <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-500 font-sans mx-1">Enter</kbd> para aprobar o <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-500 font-sans mx-1">Esc</kbd> para cancelar.
                </p>
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d1d1;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b0b0b0;
                }
            `}</style>
        </div>
    )
}
