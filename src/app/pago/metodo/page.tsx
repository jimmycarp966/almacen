'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function PagoMetodoPage() {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('card')
    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [expiry, setExpiry] = useState('')
    const [cvv, setCvv] = useState('')
    const [saveCard, setSaveCard] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Aquí iría la lógica para procesar el pago
        console.log('Procesando pago con método:', paymentMethod)
        if (paymentMethod === 'card') {
            console.log('Datos de tarjeta:', { cardNumber, cardName, expiry, cvv, saveCard })
        }
    }

    return (
        <div className="min-h-screen bg-background-light flex flex-col font-display text-text-main">
            {/* TopNavBar */}
            <header className="bg-white border-b border-[#f4f0f0] sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 text-text-main">
                        <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">storefront</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Catálogo Online</h2>
                    </Link>
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-9">
                            <Link href="/" className="text-text-main text-sm font-medium hover:text-primary transition-colors">Inicio</Link>
                            <Link href="/" className="text-text-main text-sm font-medium hover:text-primary transition-colors">Catálogo</Link>
                            <Link href="/carrito" className="text-text-main text-sm font-medium hover:text-primary transition-colors">Carrito</Link>
                            <Link href="/historial" className="text-text-main text-sm font-medium hover:text-primary transition-colors">Mis Pedidos</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-white shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBASWCAgILIgmK5nxqVcTGrsTSDNXh0lvzkvQ5w0SizhOABV86W246ot0Zt91Z3lvNjYO-jwkMaBHP-U8s5Smq4mUx0IaqZ5u4VdhkCI3CLcAUlIvhO69-ESZOPWmFLkcCVWE7uXokmnT1lrLSsx0EVAE4JZk-m_-nchU9aUHkb7Av0TFV64APOUxlHTr1MAC5kadHZPEVhUfDq8dvVC3m1p1CeBDMnQsyqqoOim58befWqfYIF48kA3jAxrATtoGEag-xBx-sVAXw")' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    {/* Left Column: Order Summary */}
                    <aside className="lg:col-span-5 order-2 lg:order-1">
                        <div className="sticky top-28 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-text-muted">shopping_bag</span>
                                <h3 className="text-2xl font-bold tracking-tight">Resumen del Pedido</h3>
                            </div>
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                {/* Product 1 */}
                                <div className="flex items-start gap-4 py-4 border-b border-gray-100">
                                    <div className="bg-gray-50 bg-center bg-no-repeat bg-cover rounded-lg size-20 shrink-0 border border-gray-100" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAsMiEJVkE0TYfOW7zMdC6b322lQQUNqIqn2mFglmXcEF9pYDK2pWaPJMkLPwBuWP1zek5NW3krhjv4Mg_0TMKSpaerrQSgTu42bfiDd_lB-51_CPKil66f-KEgQSElNErK9Hggi79Ho7JK8Nek_TcLavxEEC54XXXsFSZ44SBbvz70KhhwoGPVJFFXRheBfIVPDdNFUxLhiYNPJXFr6UkDzpTCLYj-y3AIU_UxC_-98Na4g1ujSpF0gQgEm8bbaw7-lGdZ08y1A2o")' }}></div>
                                    <div className="flex flex-col flex-grow h-full justify-between">
                                        <div>
                                            <p className="text-text-main font-bold leading-tight mb-1">Zapatillas Deportivas Rojas</p>
                                            <p className="text-text-muted text-sm font-medium">Talla: 42</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-text-muted text-sm">Cant: 1</p>
                                            <p className="text-text-main font-bold">$1,200.00</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Product 2 */}
                                <div className="flex items-start gap-4 py-4 border-b border-gray-100">
                                    <div className="bg-gray-50 bg-center bg-no-repeat bg-cover rounded-lg size-20 shrink-0 border border-gray-100" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA07IytHLu4pFJNyVWKrML1E49K6g2zFmkF9tFiOEZEoiPJFs3G3xxo6bTVdDq_vxZAF0FcYzQEb6UHYoDhT2H3iQ8FJ_RM0y60bGCsk7g83OpTdAa6fJGfZQ8ExobofABRMRAEPzQ_YN1J2uGqP7_1vtvw2m9erYCOM5GWMEyezTYgfaa4ih4K7YlATmViTOCZiOp7U2Fd48n8p9ljidPLNGwj6_vlHbSwVS6ySlbx8m_KfIdFQN0fwQyrj3i5P4mGFNx00RjEd0M")' }}></div>
                                    <div className="flex flex-col flex-grow h-full justify-between">
                                        <div>
                                            <p className="text-text-main font-bold leading-tight mb-1">Camiseta Básica Negra</p>
                                            <p className="text-text-muted text-sm font-medium">Talla: M</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <p className="text-text-muted text-sm">Cant: 2</p>
                                            <p className="text-text-main font-bold">$600.00</p>
                                        </div>
                                    </div>
                                </div>
                                {/* Totals */}
                                <div className="pt-6 space-y-3">
                                    <div className="flex justify-between text-sm text-text-muted">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-text-main">$1,800.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-text-muted">
                                        <span>Envío Estimado</span>
                                        <span className="font-medium text-green-600">Gratis</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-text-muted pb-4 border-b border-dashed border-gray-200">
                                        <span>Impuestos (16%)</span>
                                        <span className="font-medium text-text-main">$288.00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-lg font-bold">Total a Pagar</span>
                                        <span className="text-2xl font-black text-primary tracking-tight">$2,088.00</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-primary/5 rounded-lg p-4 flex gap-3 items-start border border-primary/10">
                                <span className="material-symbols-outlined text-primary shrink-0">verified_user</span>
                                <p className="text-sm text-text-muted leading-relaxed">Tu transacción está protegida con encriptación SSL de 256 bits. No almacenamos tus datos bancarios sensibles.</p>
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: Payment Selection */}
                    <section className="lg:col-span-7 order-1 lg:order-2">
                        <div className="max-w-[640px]">
                            <div className="mb-8">
                                <p className="text-text-muted text-sm uppercase tracking-wider font-bold mb-2">Paso 3 de 3</p>
                                <h1 className="text-4xl md:text-5xl font-black tracking-[-0.033em] text-text-main">Finalizar Compra</h1>
                                <p className="text-text-muted mt-2 text-lg">Selecciona cómo deseas realizar tu pago.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Option 1: Cash */}
                                <label className={`group relative flex cursor-pointer rounded-lg border p-5 shadow-sm transition-all duration-200 ${paymentMethod === 'cash' ? 'border-2 border-primary bg-white shadow-md ring-1 ring-primary/20' : 'border border-gray-200 bg-white hover:border-primary/50'}`}>
                                    <input 
                                        type="radio"
                                        name="payment-method"
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                        className="sr-only"
                                    />
                                    <span className="flex flex-1">
                                        <span className="flex flex-col">
                                            <span className="flex items-center gap-3">
                                                <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'cash' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-50 text-text-muted group-hover:text-primary group-hover:bg-primary/5'}`}>
                                                    <span className="material-symbols-outlined">payments</span>
                                                </div>
                                                <span className="block text-lg font-bold text-text-main">Efectivo</span>
                                            </span>
                                            <span className="mt-1 flex items-center text-sm text-text-muted ml-[52px]">Paga al recibir tu pedido (Contraentrega).</span>
                                        </span>
                                    </span>
                                    <span className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${paymentMethod === 'cash' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                        <span className={`h-2 w-2 rounded-full ${paymentMethod === 'cash' ? 'bg-white' : 'bg-transparent'}`}></span>
                                    </span>
                                </label>

                                {/* Option 2: Card */}
                                <div className={`relative rounded-lg p-5 shadow-md transition-all duration-200 ${paymentMethod === 'card' ? 'border-2 border-primary bg-white ring-1 ring-primary/20' : 'border border-gray-200 bg-white'}`}>
                                    <label className="flex cursor-pointer mb-6">
                                        <input 
                                            type="radio"
                                            name="payment-method"
                                            checked={paymentMethod === 'card'}
                                            onChange={() => setPaymentMethod('card')}
                                            className="sr-only"
                                        />
                                        <span className="flex flex-1">
                                            <span className="flex flex-col">
                                                <span className="flex items-center gap-3">
                                                    <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-50 text-text-muted group-hover:text-primary group-hover:bg-primary/5'}`}>
                                                        <span className="material-symbols-outlined icon-filled">credit_card</span>
                                                    </div>
                                                    <span className="block text-lg font-bold text-text-main">Tarjeta de Débito / Crédito</span>
                                                </span>
                                                <span className="mt-1 flex items-center text-sm text-text-muted ml-[52px]">Procesamiento inmediato y seguro.</span>
                                            </span>
                                        </span>
                                        <span className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${paymentMethod === 'card' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                            <span className={`h-2 w-2 rounded-full ${paymentMethod === 'card' ? 'bg-white' : 'bg-transparent'}`}></span>
                                        </span>
                                    </label>

                                    {/* Card Input Form */}
                                    {paymentMethod === 'card' && (
                                        <div className="ml-0 md:ml-[52px] grid gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted pl-3">Número de Tarjeta</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text"
                                                        value={cardNumber}
                                                        onChange={(e) => setCardNumber(e.target.value)}
                                                        placeholder="0000 0000 0000 0000"
                                                        className="w-full rounded-full border-gray-200 bg-background-light py-3 px-5 text-text-main placeholder-gray-400 focus:border-primary focus:ring-primary font-medium"
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                                        <span className="material-symbols-outlined text-gray-400">card_travel</span>
                                                        <span className="material-symbols-outlined text-gray-400">add_card</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase tracking-wider text-text-muted pl-3">Nombre en la Tarjeta</label>
                                                <input 
                                                    type="text"
                                                    value={cardName}
                                                    onChange={(e) => setCardName(e.target.value)}
                                                    placeholder="Como aparece en el plástico"
                                                    className="w-full rounded-full border-gray-200 bg-background-light py-3 px-5 text-text-main placeholder-gray-400 focus:border-primary focus:ring-primary font-medium"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-5">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted pl-3">Vencimiento</label>
                                                    <input 
                                                        type="text"
                                                        value={expiry}
                                                        onChange={(e) => setExpiry(e.target.value)}
                                                        placeholder="MM/AA"
                                                        className="w-full rounded-full border-gray-200 bg-background-light py-3 px-5 text-text-main placeholder-gray-400 focus:border-primary focus:ring-primary font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase tracking-wider text-text-muted pl-3">CVV</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="text"
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value)}
                                                            placeholder="123"
                                                            className="w-full rounded-full border-gray-200 bg-background-light py-3 px-5 text-text-main placeholder-gray-400 focus:border-primary focus:ring-primary font-medium"
                                                        />
                                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg cursor-help" title="Código de 3 dígitos al reverso">help</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <input 
                                                    type="checkbox"
                                                    id="save-card"
                                                    checked={saveCard}
                                                    onChange={(e) => setSaveCard(e.target.checked)}
                                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <label className="text-sm text-text-muted font-medium cursor-pointer" htmlFor="save-card">Guardar tarjeta para futuras compras</label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Option 3: Transfer / QR */}
                                <label className={`group relative flex cursor-pointer rounded-lg border p-5 shadow-sm transition-all duration-200 ${paymentMethod === 'transfer' ? 'border-2 border-primary bg-white shadow-md ring-1 ring-primary/20' : 'border border-gray-200 bg-white hover:border-primary/50'}`}>
                                    <input 
                                        type="radio"
                                        name="payment-method"
                                        checked={paymentMethod === 'transfer'}
                                        onChange={() => setPaymentMethod('transfer')}
                                        className="sr-only"
                                    />
                                    <span className="flex flex-1">
                                        <span className="flex flex-col">
                                            <span className="flex items-center gap-3">
                                                <div className={`size-10 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'transfer' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-50 text-text-muted group-hover:text-primary group-hover:bg-primary/5'}`}>
                                                    <span className="material-symbols-outlined">qr_code_scanner</span>
                                                </div>
                                                <span className="block text-lg font-bold text-text-main">Transferencia / QR</span>
                                            </span>
                                            <span className="mt-1 flex items-center text-sm text-text-muted ml-[52px]">Escanea y paga desde tu app bancaria.</span>
                                        </span>
                                    </span>
                                    <span className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${paymentMethod === 'transfer' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                                        <span className={`h-2 w-2 rounded-full ${paymentMethod === 'transfer' ? 'bg-white' : 'bg-transparent'}`}></span>
                                    </span>
                                </label>

                                <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <Link href="/carrito" className="text-sm font-bold text-text-muted hover:text-text-main flex items-center gap-2 transition-colors">
                                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                                        Volver al carrito
                                    </Link>
                                    <button 
                                        type="submit"
                                        className="w-full md:w-auto bg-primary hover:bg-red-700 text-white font-bold text-lg py-4 px-12 rounded-full shadow-xl shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
                                    >
                                        <span>Confirmar y Pagar</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </main>

            <footer className="mt-auto py-10 text-center border-t border-[#f4f0f0] bg-white">
                <p className="text-text-muted text-sm">© 2024 Catálogo Online. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}
