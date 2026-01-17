'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ComprobantePagoDigital1Page() {
    const [loading, setLoading] = useState(false)

    const productos = [
        { nombre: 'Camisa Oxford Slim Fit', detalles: 'Talla M • Azul Marino', precio: 45 },
        { nombre: 'Pantalón Chino Beige', detalles: 'Talla 32 • Beige', precio: 55 },
    ]

    const subtotal = productos.reduce((sum, p) => sum + p.precio, 0)
    const envio = 5
    const impuestos = 16
    const total = subtotal + envio + impuestos

    const handleDownloadPDF = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert('PDF descargado exitosamente')
        }, 1000)
    }

    const handleSendWhatsApp = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            alert('Comprobante enviado por WhatsApp')
        }, 1000)
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-slate-900 flex flex-col antialiased selection:bg-primary/20 selection:text-primary transition-colors duration-300">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full bg-card-light/80/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                            <div className="bg-slate-900 text-white p-1.5 rounded-lg group-hover:bg-primary transition-colors duration-300">
                                <span className="material-symbols-outlined text-[20px] leading-none">storefront</span>
                            </div>
                            <span className="font-bold text-lg tracking-tight">Super Aguilares</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Inicio</Link>
                            <Link href="/historial" className="text-sm font-medium hover:text-primary transition-colors">Mis Pedidos</Link>
                            <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Ayuda</Link>
                            <div className="h-8 w-8 rounded-full bg-slate-200 bg-cover bg-center ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer bg-gray-300"></div>
                        </div>
                        <div className="md:hidden">
                            <span className="material-symbols-outlined cursor-pointer">menu</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow flex flex-col items-center justify-start py-8 px-4 sm:px-6">
                <div className="w-full max-w-[600px] mb-6 flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/historial" className="hover:text-primary transition-colors">Mis Pedidos</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="font-medium text-slate-900">Validación #TRX-8932</span>
                </div>

                <div className="relative w-full max-w-[520px] bg-card-light rounded-t-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)][0_20px_50px_-12px_rgba(0,0,0,0.3)] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="p-8 sm:p-10 flex flex-col gap-8 relative z-10">
                        {/* Header */}
                        <div className="flex flex-col items-center text-center gap-3 border-b border-dashed border-slate-200 pb-8">
                            <div className="w-full bg-orange-50/20 border border-orange-100 rounded-lg p-3 mb-2">
                                <p className="text-orange-700 font-semibold flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                                    Estamos validando tu pago
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center mb-1 shadow-lg shadow-slate-900/20">
                                <span className="material-symbols-outlined text-[28px]">receipt_long</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight">Comprobante de Solicitud</h1>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Transacción ID</span>
                                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-sm">#TRX-8932-QA</span>
                            </div>
                        </div>

                        {/* Purchase Summary */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-1">Resumen de Compra</h3>
                            <div className="space-y-3">
                                {productos.map((producto, index) => (
                                    <div key={index} className="flex justify-between items-start group">
                                        <div className="flex flex-col">
                                            <span className="text-slate-700 text-sm font-medium group-hover:text-primary transition-colors">{producto.nombre}</span>
                                            <span className="text-xs text-slate-400">{producto.detalles}</span>
                                        </div>
                                        <span className="text-slate-900 font-medium text-sm">${producto.precio.toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center text-slate-500 text-sm pt-2">
                                    <span>Envío Express</span>
                                    <span>${envio.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 text-sm">
                                    <span>Impuestos (IVA 16%)</span>
                                    <span>${impuestos.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-slate-50/50 rounded-lg p-4 flex items-center justify-between border border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white rounded shadow-sm border border-slate-100">
                                    <span className="material-symbols-outlined text-primary text-[20px]">qr_code_scanner</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-400 font-medium uppercase">Método de Pago</span>
                                    <span className="text-sm font-semibold text-slate-800">Transferencia QR</span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-orange-500 text-[20px]" title="En espera">schedule</span>
                        </div>

                        {/* Total */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-slate-200">
                            <div className="flex justify-between items-end">
                                <span className="text-slate-500 text-sm font-medium pb-2">Total Pagado</span>
                                <span className="text-4xl font-extrabold text-slate-900 tracking-tight">${total.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-slate-500 italic mt-2 text-center bg-yellow-50/10 p-2 rounded border border-yellow-100/20">
                                Tu comprobante oficial estará disponible una vez que confirmemos la acreditación de tu transferencia. Te notificaremos por WhatsApp.
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="flex flex-row items-center justify-between pt-4 mt-2 border-t border-slate-100">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-400">Fecha y Hora</span>
                                <span className="text-sm font-medium text-slate-700">24 Oct 2023, 14:30 hs</span>
                            </div>
                            <div className="bg-white p-1 rounded border border-slate-200">
                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-gray-400">qr_code</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                            <button 
                                onClick={handleDownloadPDF}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg border border-primary text-slate-900 font-semibold text-sm hover:bg-primary/5 transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                                {loading ? 'Descargando...' : 'Descargar PDF'}
                            </button>
                            <button 
                                onClick={handleSendWhatsApp}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary text-white font-semibold text-sm shadow-md hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                {loading ? 'Enviando...' : 'Enviar por WhatsApp'}
                            </button>
                        </div>

                        <div className="text-center pt-2">
                            <Link href="#" className="text-xs text-slate-400 hover:text-primary transition-colors border-b border-transparent hover:border-primary/50">
                                ¿Necesitas ayuda con este pago?
                            </Link>
                        </div>
                    </div>

                    {/* Receipt Tear Effect */}
                    <div className="receipt-tear"></div>
                </div>

                <p className="text-xs text-slate-400 text-center max-w-sm">
                    Este es un comprobante digital válido. Gracias por su compra en Super Aguilares.
                </p>
            </main>

            <style jsx>{`
                .receipt-tear {
                    background-image: linear-gradient(135deg, transparent 50%, #ffffff 50%), linear-gradient(45deg, #ffffff 50%, transparent 50%);
                    background-position: top;
                    background-size: 20px 20px;
                    background-repeat: repeat-x;
                    height: 20px;
                    width: 100%;
                    position: absolute;
                    bottom: -20px;
                    left: 0;
                    filter: drop-shadow(0px 4px 2px rgba(0,0,0,0.05));
                }
                .dark .receipt-tear {
                    background-image: linear-gradient(135deg, transparent 50%, #27272a 50%), linear-gradient(45deg, #27272a 50%, transparent 50%);
                }
            `}</style>
        </div>
    )
}
