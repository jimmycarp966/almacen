'use client'

import { useCartStore } from '@/store/cartStore'
import { useSessionStore } from '@/store/sessionStore'
import { CartItem } from '@/components/client/CartItem'
import { Navbar } from '@/components/layout/Navbar'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createPedidoAction } from '@/actions/orders'

const CUOTAS_RECARGOS = {
    1: 0,
    3: 0.10,
    6: 0.15,
    12: 0.20
}

export default function CarritoPage() {
    const { items, getTotal, clearCart } = useCartStore()
    const user = useSessionStore((state) => state.user)
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    // Form states
    const [direccion, setDireccion] = useState('')
    const [metodoPago, setMetodoPago] = useState('efectivo')
    const [cuotas, setCuotas] = useState(1)
    const [comprobanteUrl, setComprobanteUrl] = useState('') // Mock URL for now

    useEffect(() => {
        setMounted(true)
    }, [])

    const subtotal = useMemo(() => getTotal(), [getTotal])

    const recargo = useMemo(() => {
        if (metodoPago === 'tarjeta') {
            return subtotal * (CUOTAS_RECARGOS[cuotas as keyof typeof CUOTAS_RECARGOS] || 0)
        }
        return 0
    }, [subtotal, metodoPago, cuotas])

    const total = subtotal + recargo

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background-light">
                <Navbar />
                <main className="max-w-[1600px] mx-auto px-4 py-20 text-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">shopping_cart</span>
                    <h2 className="text-2xl font-bold text-text-main mb-2">Tu carrito está vacío</h2>
                    <p className="text-text-secondary mb-8">¡Agrega algunos productos para empezar!</p>
                    <button onClick={() => router.push('/')} className="btn-primary">Volver al Catálogo</button>
                </main>
            </div>
        )
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            router.push(`/login?returnUrl=/carrito`)
            return
        }

        if (!direccion) {
            setError('Por favor, ingresa tu dirección de entrega')
            return
        }

        setLoading(true)
        setError('')

        const orderData = {
            cliente_id: user.id,
            items: items.map(item => ({
                producto_id: item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio
            })),
            subtotal,
            recargo,
            total,
            metodo_pago: metodoPago,
            cuotas: metodoPago === 'tarjeta' ? cuotas : 0,
            datos_entrega: { direccion },
            comprobante_url: metodoPago === 'transferencia' ? comprobanteUrl : null
        }

        const result = await createPedidoAction(orderData)

        if (result.success) {
            clearCart()
            router.push(`/seguimiento/${result.orderId}`)
        } else {
            setError(result.message || 'Error al procesar el pedido')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />

            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
                <h1 className="text-3xl font-black text-text-main mb-10 tracking-tight">Finalizar Compra</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Listado de Productos */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between border-b pb-4">
                            <h2 className="text-xl font-bold text-text-main">Tus Productos</h2>
                            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                                {items.length} ítems
                            </span>
                        </div>

                        <div className="space-y-6">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        <div className="bg-gray-50 rounded-3xl p-8 space-y-4">
                            <div className="flex justify-between text-sm text-text-secondary font-medium">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString('es-AR')}</span>
                            </div>
                            {recargo > 0 && (
                                <div className="flex justify-between text-sm text-primary font-bold">
                                    <span>Recargo por Cuotas ({cuotas}x)</span>
                                    <span>+${recargo.toLocaleString('es-AR')}</span>
                                </div>
                            )}
                            <div className="border-t border-dashed border-gray-200 my-4"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-text-main">Total a Pagar</span>
                                <span className="text-3xl font-black text-primary tracking-tight">
                                    ${total.toLocaleString('es-AR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Pago y Entrega */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-8 h-fit lg:sticky lg:top-32">
                        <h2 className="text-xl font-bold text-text-main mb-8">Detalles de Entrega y Pago</h2>

                        <form onSubmit={handleCheckout} className="space-y-8">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider" htmlFor="direccion">
                                    Dirección de Entrega
                                </label>
                                <textarea
                                    id="direccion"
                                    required
                                    rows={2}
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Calle, número, departamento y localidad"
                                    className="block w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-4 text-text-main focus:border-primary focus:ring-primary focus:bg-white transition-all duration-200 shadow-sm font-medium"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider">
                                    Método de Pago
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['efectivo', 'tarjeta', 'transferencia'].map((m) => (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => setMetodoPago(m)}
                                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold capitalize ${metodoPago === m
                                                    ? 'border-primary bg-red-50 text-primary scale-105 shadow-md'
                                                    : 'border-gray-50 bg-gray-50 hover:border-gray-100 text-text-secondary'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl">
                                                {m === 'efectivo' ? 'payments' : m === 'tarjeta' ? 'credit_card' : 'account_balance'}
                                            </span>
                                            <span className="text-xs">{m}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {metodoPago === 'tarjeta' && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <label className="text-sm font-bold text-text-main ml-1 uppercase tracking-wider">
                                        Cantidad de Cuotas
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 3, 6, 12].map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setCuotas(c)}
                                                className={`py-3 rounded-xl border-2 font-black transition-all ${cuotas === c
                                                        ? 'border-primary bg-primary text-white shadow-lg'
                                                        : 'border-gray-100 bg-white text-text-secondary hover:border-gray-200'
                                                    }`}
                                            >
                                                {c}x
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold text-center">
                                        {cuotas === 1 ? 'Sin recargo' : `Recargo del ${(CUOTAS_RECARGOS[cuotas as keyof typeof CUOTAS_RECARGOS] * 100).toFixed(0)}% incluido en el total`}
                                    </p>
                                </div>
                            )}

                            {metodoPago === 'transferencia' && (
                                <div className="space-y-4 animate-fade-in-up bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">info</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-blue-900 text-sm">Datos de Transferencia</h4>
                                            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                                                CBU: 12345678901234567890<br />
                                                ALIAS: super.aguilares.ok<br />
                                                BANCO: Banco Nación
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <label className="text-xs font-black text-blue-900 uppercase tracking-widest">
                                            Subir Comprobante (Opcional)
                                        </label>
                                        <input
                                            type="file"
                                            className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-all cursor-pointer"
                                            onChange={(e) => {
                                                // Mocking URL for now
                                                if (e.target.files?.[0]) setComprobanteUrl('https://example.com/mock-receipt.jpg')
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {!user && (
                                <p className="text-sm text-amber-600 font-bold bg-amber-50 p-5 rounded-2xl flex gap-3 border border-amber-100">
                                    <span className="material-symbols-outlined text-[20px]">info</span>
                                    Te pediremos tu número de teléfono para identificar el pedido.
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-[#a92b2b] text-white font-black text-xl py-6 px-8 rounded-2xl shadow-xl shadow-primary/30 transition-all hover:translate-y-[-4px] active:translate-y-[0px] flex justify-between items-center group disabled:opacity-70"
                            >
                                <span>{loading ? 'Procesando...' : 'Confirmar Pedido'}</span>
                                <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
                                    <span className="material-symbols-outlined block">arrow_forward</span>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}
