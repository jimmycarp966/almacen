'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PedidoConfirmacionPage() {
    const [orderId, setOrderId] = useState<string>('')

    useEffect(() => {
        // Obtener el ID del pedido de la URL o del localStorage
        const urlParams = new URLSearchParams(window.location.search)
        const pedidoId = urlParams.get('id') || localStorage.getItem('ultimoPedidoId')
        if (pedidoId) {
            setOrderId(pedidoId)
        }
    }, [])

    return (
        <div className="min-h-screen bg-background-light text-[#181010] font-display flex flex-col overflow-x-hidden transition-colors duration-300">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f0f0] px-6 lg:px-40 py-4 bg-white/80[#18181b]/90 backdrop-blur-md">
                <Link href="/" className="flex items-center gap-3 text-[#181010] group cursor-pointer">
                    <div className="size-8 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                        <span className="material-symbols-outlined text-3xl">local_mall</span>
                    </div>
                    <h2 className="text-[#181010] text-xl font-bold leading-tight tracking-tight">Catálogo</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-8">
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-[#181010] hover:text-primary:text-primary transition-colors text-sm font-semibold leading-normal">Inicio</Link>
                        <Link href="/" className="text-[#181010] hover:text-primary:text-primary transition-colors text-sm font-semibold leading-normal">Catálogo</Link>
                        <Link href="/historial" className="text-[#181010] hover:text-primary:text-primary transition-colors text-sm font-semibold leading-normal">Mis Pedidos</Link>
                    </nav>
                    <Link href="/carrito" className="relative flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#f5f0f0] text-[#181010] hover:bg-gray-200:bg-zinc-700 transition-colors group">
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-y-1">shopping_cart</span>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></div>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-10 lg:py-16">
                <div className="w-full max-w-[520px] mx-auto flex flex-col items-center text-center">
                    {/* Success Animation / Icon */}
                    <div className="relative mb-8 group">
                        {/* Decorative blurred glow behind icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-500/10/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative w-28 h-28 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-red-500/20/30 animate-scale-in">
                            <span className="material-symbols-outlined text-white text-[64px]" style={{ fontVariationSettings: 'wght 700' }}>check</span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6 animate-fade-up w-full">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black text-[#181010] tracking-tight leading-[1.1]">
                                ¡Pedido Realizado con Éxito!
                            </h1>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                Orden #{orderId || '2024-893'}
                            </p>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-sm mx-auto">
                            El negocio ha recibido tu pedido y comenzará a prepararlo. Te notificaremos cuando salga.
                        </p>

                        {/* Delivery Estimate Widget */}
                        <div className="inline-flex items-center gap-3 px-5 py-3 bg-zinc-50/50 rounded-xl border border-zinc-100 mx-auto transform hover:scale-[1.02] transition-transform duration-300 cursor-default shadow-sm">
                            <div className="p-1.5 bg-white rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-primary text-xl block">schedule</span>
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider leading-none mb-0.5">Tiempo Estimado</p>
                                <p className="text-sm font-bold text-[#181010] leading-none">30 - 45 min</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col w-full gap-4 pt-10 sm:w-80 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                        <Link 
                            href={`/seguimiento/${orderId || ''}`}
                            className="group w-full h-14 px-6 rounded-xl bg-primary hover:bg-primary-hover active:scale-[0.98] text-white text-[15px] font-bold tracking-wide shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <span>Ver Seguimiento de mi Pedido</span>
                            <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </Link>
                        <Link 
                            href="/"
                            className="w-full h-14 px-6 rounded-xl bg-transparent border-2 border-primary/20 hover:border-primary active:scale-[0.98] text-[#181010] hover:bg-red-50:bg-primary/10 transition-all text-[15px] font-bold tracking-wide flex items-center justify-center"
                        >
                            Volver al Catálogo
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-6 px-5 py-8 text-center border-t border-dashed border-gray-100 mt-auto">
                <p className="text-[#8d5e5e] text-sm font-medium">© 2024 Catálogo. Todos los derechos reservados.</p>
            </footer>

            <style jsx>{`
                @keyframes scaleIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-up {
                    animation: fadeIn 0.8s ease-out forwards;
                    animation-delay: 0.2s;
                    opacity: 0;
                }
            `}</style>
        </div>
    )
}
