'use client'

import { useCartStore } from '@/store/cartStore'
import { CartItem } from '@/components/client/CartItem'
import { Navbar } from '@/components/layout/Navbar'
import { CheckoutSteps } from '@/components/client/CheckoutSteps'
import { DeliverySelector } from '@/components/client/DeliverySelector'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createPedidoAction } from '@/actions/orders'
import { generateWhatsAppUrl, WhatsAppOrderData } from '@/lib/whatsapp'

const COSTO_ENVIO = 500
const WHATSAPP_ADMIN = '5493814011673' // Número del admin configurable

const CUOTAS_RECARGOS = {
    1: 0,
    3: 0.10,
    6: 0.15,
    12: 0.20
}

const STEPS = ['Productos', 'Entrega', 'Pago', 'Confirmar']

export default function CarritoPage() {
    const { items, getTotal, clearCart } = useCartStore()
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(0)
    const router = useRouter()

    // Form states
    const [tipoEntrega, setTipoEntrega] = useState<'domicilio' | 'retiro'>('retiro')
    const [metodoPago, setMetodoPago] = useState('efectivo')
    const [cuotas, setCuotas] = useState(1)

    useEffect(() => {
        setMounted(true)
    }, [])

    const subtotal = useMemo(() => getTotal(), [getTotal])
    const costoEntrega = tipoEntrega === 'domicilio' ? COSTO_ENVIO : 0

    const recargo = useMemo(() => {
        if (metodoPago === 'tarjeta') {
            return subtotal * (CUOTAS_RECARGOS[cuotas as keyof typeof CUOTAS_RECARGOS] || 0)
        }
        return 0
    }, [subtotal, metodoPago, cuotas])

    const total = subtotal + costoEntrega + recargo

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background-light">
                <Navbar />
                <main className="max-w-[1600px] mx-auto px-4 py-12 sm:py-20 text-center">
                    <span className="material-symbols-outlined text-5xl sm:text-6xl text-gray-300 mb-4">shopping_cart</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-text-main mb-2">Tu carrito está vacío</h2>
                    <p className="text-sm sm:text-base text-text-secondary mb-8">¡Agregá algunos productos para empezar!</p>
                    <button onClick={() => router.push('/catalogo')} className="btn-primary">
                        Ver Catálogo
                    </button>
                </main>
            </div>
        )
    }

    const handleFinalizarCompra = async () => {
        setLoading(true)
        setError('')

        try {
            // Crear pedido en la base de datos
            const orderData = {
                cliente_id: 'cliente-web-' + Date.now(),
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
                datos_entrega: {
                    tipo_entrega: tipoEntrega,
                    costo_entrega: costoEntrega
                },
                comprobante_url: null
            }

            const result = await createPedidoAction(orderData)

            if (result.success) {
                // Generar mensaje de WhatsApp
                const whatsappData: WhatsAppOrderData = {
                    items: items.map(item => ({
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precio: item.precio,
                        subtotal: item.precio * item.cantidad
                    })),
                    tipoEntrega,
                    costoEntrega,
                    metodoPago,
                    subtotal,
                    total
                }

                const whatsappUrl = generateWhatsAppUrl(WHATSAPP_ADMIN, whatsappData)

                // Limpiar carrito
                clearCart()

                // Abrir WhatsApp (esto actúa como el botón de finalizar)
                window.open(whatsappUrl, '_blank')

                // Redirigir a página de confirmación o catálogo
                router.push('/catalogo?pedido=enviado')
            } else {
                setError(result.message || 'Error al procesar el pedido')
            }
        } catch {
            setError('Error al procesar el pedido. Intentá nuevamente.')
        }

        setLoading(false)
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length - 1))
    const prevStep = () => setStep(prev => Math.max(prev - 1, 0))

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />

            <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-32">
                <h1 className="text-2xl sm:text-3xl font-black text-text-main mb-6 sm:mb-8 tracking-tight text-center">
                    Finalizar Compra
                </h1>

                <CheckoutSteps currentStep={step} steps={STEPS} />

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                    {/* Paso 0: Productos */}
                    {step === 0 && (
                        <div className="p-4 sm:p-8">
                            <div className="flex items-center justify-between border-b pb-4 mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-text-main">Tus Productos</h2>
                                <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {items.length} {items.length === 1 ? 'ítem' : 'ítems'}
                                </span>
                            </div>

                            <div className="space-y-4 sm:space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>

                            {/* Resumen */}
                            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 mt-6 space-y-3">
                                <div className="flex justify-between text-sm text-text-secondary font-medium">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString('es-AR')}</span>
                                </div>
                                <div className="border-t border-dashed border-gray-200 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-bold text-text-main">Total parcial</span>
                                    <span className="text-2xl sm:text-3xl font-black text-primary">
                                        ${subtotal.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 1: Entrega */}
                    {step === 1 && (
                        <div className="p-4 sm:p-8">
                            <DeliverySelector
                                tipoEntrega={tipoEntrega}
                                onChangeTipoEntrega={setTipoEntrega}
                                costoEnvio={COSTO_ENVIO}
                            />

                            {/* Info adicional */}
                            <div className={`mt-6 p-4 rounded-xl border ${tipoEntrega === 'domicilio'
                                    ? 'bg-red-50/50 border-red-100'
                                    : 'bg-green-50/50 border-green-100'
                                }`}>
                                <div className="flex items-start gap-3">
                                    <span className={`material-symbols-outlined text-xl ${tipoEntrega === 'domicilio' ? 'text-primary' : 'text-green-600'
                                        }`}>
                                        info
                                    </span>
                                    <div className="text-sm">
                                        {tipoEntrega === 'domicilio' ? (
                                            <p className="text-text-main">
                                                <strong>Entrega a domicilio:</strong> Te llevaremos el pedido a la dirección registrada.
                                                Costo adicional: <strong className="text-primary">+${COSTO_ENVIO}</strong>
                                            </p>
                                        ) : (
                                            <p className="text-text-main">
                                                <strong>Retiro en local:</strong> Podés pasar a buscar tu pedido cuando esté listo.
                                                <strong className="text-green-600"> ¡Sin costo adicional!</strong>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Pago */}
                    {step === 2 && (
                        <div className="p-4 sm:p-8 space-y-6">
                            <h3 className="text-lg font-bold text-text-main">Método de Pago</h3>

                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {[
                                    { key: 'efectivo', icon: 'payments', label: 'Efectivo' },
                                    { key: 'tarjeta', icon: 'credit_card', label: 'Tarjeta' },
                                    { key: 'transferencia', icon: 'account_balance', label: 'Transfer.' }
                                ].map((m) => (
                                    <button
                                        key={m.key}
                                        type="button"
                                        onClick={() => setMetodoPago(m.key)}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all font-bold ${metodoPago === m.key
                                                ? 'border-primary bg-red-50 text-primary scale-105 shadow-md'
                                                : 'border-gray-50 bg-gray-50 hover:border-gray-100 text-text-secondary'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-xl sm:text-2xl">{m.icon}</span>
                                        <span className="text-[10px] sm:text-xs">{m.label}</span>
                                    </button>
                                ))}
                            </div>

                            {metodoPago === 'tarjeta' && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <label className="text-sm font-bold text-text-main uppercase tracking-wider">
                                        Cantidad de Cuotas
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1, 3, 6, 12].map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setCuotas(c)}
                                                className={`py-3 rounded-xl border-2 font-black transition-all text-sm ${cuotas === c
                                                        ? 'border-primary bg-primary text-white shadow-lg'
                                                        : 'border-gray-100 bg-white text-text-secondary hover:border-gray-200'
                                                    }`}
                                            >
                                                {c}x
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold text-center">
                                        {cuotas === 1 ? 'Sin recargo' : `Recargo del ${(CUOTAS_RECARGOS[cuotas as keyof typeof CUOTAS_RECARGOS] * 100).toFixed(0)}% incluido`}
                                    </p>
                                </div>
                            )}

                            {metodoPago === 'transferencia' && (
                                <div className="bg-blue-50/50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-100">
                                    <div className="flex items-start gap-3 sm:gap-4">
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
                                </div>
                            )}
                        </div>
                    )}

                    {/* Paso 3: Confirmar */}
                    {step === 3 && (
                        <div className="p-4 sm:p-8">
                            <h3 className="text-lg font-bold text-text-main mb-6">Resumen del Pedido</h3>

                            {/* Lista de productos resumida */}
                            <div className="space-y-2 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-text-secondary">
                                            {item.cantidad}x {item.nombre}
                                        </span>
                                        <span className="font-medium text-text-main">
                                            ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Detalles */}
                            <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Subtotal productos</span>
                                    <span className="font-medium">${subtotal.toLocaleString('es-AR')}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">
                                            {tipoEntrega === 'domicilio' ? 'local_shipping' : 'storefront'}
                                        </span>
                                        {tipoEntrega === 'domicilio' ? 'Envío a domicilio' : 'Retiro en local'}
                                    </span>
                                    <span className={`font-medium ${costoEntrega === 0 ? 'text-green-600' : ''}`}>
                                        {costoEntrega === 0 ? '¡Gratis!' : `+$${costoEntrega.toLocaleString('es-AR')}`}
                                    </span>
                                </div>

                                {recargo > 0 && (
                                    <div className="flex justify-between text-sm text-primary">
                                        <span>Recargo cuotas ({cuotas}x)</span>
                                        <span className="font-medium">+${recargo.toLocaleString('es-AR')}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">
                                            {metodoPago === 'efectivo' ? 'payments' : metodoPago === 'tarjeta' ? 'credit_card' : 'account_balance'}
                                        </span>
                                        Pago: {metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1)}
                                    </span>
                                </div>

                                <div className="border-t border-dashed border-gray-200 my-3"></div>

                                <div className="flex justify-between items-end">
                                    <span className="text-lg font-bold text-text-main">TOTAL</span>
                                    <span className="text-3xl sm:text-4xl font-black text-primary">
                                        ${total.toLocaleString('es-AR')}
                                    </span>
                                </div>
                            </div>

                            {/* Info WhatsApp */}
                            <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600 text-xl">chat</span>
                                    <p className="text-sm text-green-800">
                                        <strong>Al finalizar,</strong> se abrirá WhatsApp con tu pedido listo para enviar al negocio.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navegación */}
                    <div className="border-t border-gray-100 p-4 sm:p-6 flex justify-between gap-3">
                        {step > 0 ? (
                            <button
                                onClick={prevStep}
                                className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-text-secondary hover:bg-gray-50 transition-all text-sm sm:text-base"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                <span className="hidden sm:inline">Anterior</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => router.push('/catalogo')}
                                className="flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-bold text-text-secondary hover:bg-gray-50 transition-all text-sm sm:text-base"
                            >
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                <span className="hidden sm:inline">Catálogo</span>
                            </button>
                        )}

                        {step < STEPS.length - 1 ? (
                            <button
                                onClick={nextStep}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary hover:bg-[#a92b2b] text-white font-bold py-3 px-6 sm:px-8 rounded-xl transition-all shadow-lg text-sm sm:text-base"
                            >
                                <span>Siguiente</span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleFinalizarCompra}
                                disabled={loading}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 sm:px-8 rounded-xl transition-all shadow-lg disabled:opacity-50 text-sm sm:text-base"
                            >
                                {loading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">send</span>
                                        <span>Finalizar y Enviar</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
