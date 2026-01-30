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
import { TARJETAS_CREDITO, METODOS_SIN_RECARGO, calcularRecargo, getCuotasDisponibles, getNombreMetodo, getEtiquetaCuotas } from '@/lib/payment-methods'

const COSTO_ENVIO = 500
const WHATSAPP_ADMIN = '5493865572025' // Número del negocio

const STEPS = ['Productos', 'Entrega', 'Pago', 'Confirmar']

export default function CarritoPage() {
    console.log('[DEBUG CarritoPage] Render inicial')
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [step, setStep] = useState(0)
    const router = useRouter()
    console.log('[DEBUG CarritoPage] Después de useState/useRouter, mounted:', mounted)

    // Form states
    const [tipoEntrega, setTipoEntrega] = useState<'domicilio' | 'retiro'>('retiro')
    const [metodoPago, setMetodoPago] = useState('visa')
    const [cuotas, setCuotas] = useState(1)

    useEffect(() => {
        console.log('[DEBUG CarritoPage] useEffect montaje ejecutado')
        setMounted(true)
    }, [])

    // Resetear cuotas cuando cambia el método de pago
    useEffect(() => {
        const cuotasDisponibles = getCuotasDisponibles(metodoPago)
        if (!cuotasDisponibles.includes(cuotas)) {
            setCuotas(cuotasDisponibles[0] || 1)
        }
    }, [metodoPago, cuotas])

    // Mostrar loading mientras hidrata
    if (!mounted) {
        console.log('[DEBUG CarritoPage] Retornando loading (no mounted)')
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    console.log('[DEBUG CarritoPage] Retornando CarritoContent (mounted)')


    // Ahora es seguro usar el store
    return <CarritoContent
        loading={loading}
        setLoading={setLoading}
        error={error}
        setError={setError}
        step={step}
        setStep={setStep}
        tipoEntrega={tipoEntrega}
        setTipoEntrega={setTipoEntrega}
        metodoPago={metodoPago}
        setMetodoPago={setMetodoPago}
        cuotas={cuotas}
        setCuotas={setCuotas}
        router={router}
    />
}

function CarritoContent({
    loading, setLoading, error, setError, step, setStep,
    tipoEntrega, setTipoEntrega, metodoPago, setMetodoPago,
    cuotas, setCuotas, router
}: {
    loading: boolean
    setLoading: (v: boolean) => void
    error: string
    setError: (v: string) => void
    step: number
    setStep: (v: number | ((p: number) => number)) => void
    tipoEntrega: 'domicilio' | 'retiro'
    setTipoEntrega: (v: 'domicilio' | 'retiro') => void
    metodoPago: string
    setMetodoPago: (v: string) => void
    cuotas: number
    setCuotas: (v: number) => void
    router: ReturnType<typeof useRouter>
}) {
    const { items, getTotal, clearCart } = useCartStore()

    const subtotal = getTotal()
    const costoEntrega = tipoEntrega === 'domicilio' ? COSTO_ENVIO : 0
    const recargo = calcularRecargo(metodoPago, cuotas, subtotal)
    const total = subtotal + costoEntrega + recargo


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
                cuotas: cuotas,
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
                    metodoPago: getNombreMetodo(metodoPago),
                    cuotas,
                    recargo,
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

    const cuotasDisponibles = getCuotasDisponibles(metodoPago)

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />

            <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-32">
                <h1 className="text-2xl sm:text-3xl font-black text-text-main mb-6 sm:mb-8 tracking-tight text-center">
                    Finalizar Compra
                </h1>

                <CheckoutSteps currentStep={step} steps={STEPS} />

                {/* Banner de confianza */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-green-600 text-2xl">verified_user</span>
                    <div>
                        <p className="text-green-800 font-bold text-sm">💚 Pagás cuando recibís y controlás tu pedido</p>
                        <p className="text-green-700 text-xs">El pago se realiza en el momento de la entrega con posnet</p>
                    </div>
                </div>

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

                            {/* Mensaje de confianza */}
                            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                <p className="text-blue-800 text-xs text-center font-medium">
                                    🛡️ El repartidor llevará posnet para que pagues al recibir
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Paso 2: Pago */}
                    {step === 2 && (
                        <div className="p-4 sm:p-8 space-y-6">
                            <h3 className="text-lg font-bold text-text-main">Método de Pago</h3>

                            {/* Mensaje de confianza */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-green-600">security</span>
                                <p className="text-green-800 text-xs font-medium">
                                    💳 El pago se realiza al momento de la entrega - Pagás cuando recibís y controlás tu pedido
                                </p>
                            </div>

                            {/* Tarjetas con recargo */}
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-3">
                                    Tarjetas de Crédito (con recargo según cuotas)
                                </p>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {TARJETAS_CREDITO.map((tarjeta) => (
                                        <button
                                            key={tarjeta.id}
                                            type="button"
                                            onClick={() => setMetodoPago(tarjeta.id)}
                                            className={`flex flex-col items-center justify-center gap-1 p-2 sm:p-3 rounded-xl border-2 transition-all ${metodoPago === tarjeta.id
                                                ? 'border-primary bg-red-50 scale-105 shadow-md'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl text-gray-600">credit_card</span>
                                            <span className="text-[8px] sm:text-[10px] font-bold text-text-secondary text-center">
                                                {tarjeta.nombre}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sin recargo */}
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mb-3">
                                    Sin Recargo ✨
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {METODOS_SIN_RECARGO.map((metodo) => (
                                        <button
                                            key={metodo.id}
                                            type="button"
                                            onClick={() => setMetodoPago(metodo.id)}
                                            className={`flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all ${metodoPago === metodo.id
                                                ? 'border-green-500 bg-green-50 scale-105 shadow-md'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-2xl text-gray-600">payments</span>
                                            <span className="text-[10px] sm:text-xs font-bold text-text-secondary text-center">
                                                {metodo.nombre}
                                            </span>
                                            <span className="text-[8px] text-green-600 font-bold">SIN RECARGO</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Cuotas (solo si tiene más de 1 opción) */}
                            {cuotasDisponibles.length > 1 && (
                                <div className="space-y-4 animate-fade-in-up">
                                    <label className="text-sm font-bold text-text-main uppercase tracking-wider">
                                        Cantidad de Cuotas
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {cuotasDisponibles.map((c) => {
                                            const etiqueta = getEtiquetaCuotas(metodoPago, c)
                                            const esZeta = metodoPago === 'naranja' && c === 3
                                            return (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setCuotas(c)}
                                                    className={`py-3 px-2 rounded-xl border-2 font-black transition-all text-sm ${cuotas === c
                                                        ? esZeta ? 'border-purple-500 bg-purple-500 text-white shadow-lg' : 'border-primary bg-primary text-white shadow-lg'
                                                        : 'border-gray-100 bg-white text-text-secondary hover:border-gray-200'
                                                        }`}
                                                >
                                                    {esZeta ? (
                                                        <>
                                                            <div className="text-xs">Zeta</div>
                                                            <div className="text-[10px] font-medium opacity-80">+20% recargo</div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div>{c} {c === 1 ? 'pago' : 'pagos'}</div>
                                                            <div className="text-[10px] font-medium opacity-80">{etiqueta.includes('sin') ? 'sin recargo' : etiqueta.split('(')[1]?.replace(')', '') || ''}</div>
                                                        </>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Resumen de recargo */}
                            {recargo > 0 ? (
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                    <p className="text-amber-800 text-sm font-medium">
                                        💳 Recargo por pago en {cuotas} {cuotas === 1 ? 'cuota' : 'cuotas'}: <strong>+${recargo.toLocaleString('es-AR')}</strong>
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <p className="text-green-800 text-sm font-medium">
                                        ✨ ¡Este método de pago no tiene recargo!
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Paso 3: Confirmar */}
                    {step === 3 && (
                        <div className="p-4 sm:p-8">
                            <h3 className="text-lg font-bold text-text-main mb-6">Resumen del Pedido</h3>

                            {/* Banner destacado */}
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                                    <div>
                                        <p className="font-bold">¡Comprá con tranquilidad!</p>
                                        <p className="text-sm opacity-90">Pagás recién cuando recibís y controlás tu pedido</p>
                                    </div>
                                </div>
                            </div>

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
                                            payment
                                        </span>
                                        Pago: {getNombreMetodo(metodoPago)}
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
                                        <br />
                                        <span className="text-xs opacity-80">El pago lo realizás cuando recibís el pedido 🛡️</span>
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
