'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionStore } from '@/store/sessionStore'

const ADMIN_PHONE = '3814011673'

export default function LoginPage() {
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const setSession = useSessionStore((state) => state.setSession)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simular verificación del número de teléfono
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Verificar si es el admin
        if (phone === ADMIN_PHONE) {
            setSession({
                id: 'admin',
                nombre: 'Administrador',
                telefono: ADMIN_PHONE,
                rol: 'admin',
            })
            router.push('/admin')
        } else {
            // Usuario normal
            setSession({
                id: 'user-' + Date.now(),
                nombre: 'Usuario',
                telefono: phone,
                rol: 'cliente',
            })
            router.push('/catalogo')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                    {/* Logo/Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                            <span className="material-symbols-outlined text-white text-3xl">shopping_cart</span>
                        </div>
                        <h1 className="text-3xl font-black text-text-main">Super Aguilares</h1>
                        <p className="text-text-secondary">Ingresa tu número de teléfono para continuar</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-bold text-text-main mb-2">
                                Número de Teléfono
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="3811234567"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-text-main placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg font-medium"
                                required
                                pattern="[0-9]{10}"
                                title="Ingresa un número de teléfono de 10 dígitos"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">refresh</span>
                                    <span>Verificando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">login</span>
                                    <span>Ingresar</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="bg-blue-50/20 border border-blue-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-600 text-xl">info</span>
                            <div className="text-sm text-blue-800">
                                <p className="font-bold mb-1">Para acceder como administrador:</p>
                                <p className="font-mono">3814011673</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-green-600 text-xl">person</span>
                            <div className="text-sm text-green-800">
                                <p className="font-bold mb-1">Para acceder como cliente demo:</p>
                                <p className="font-mono">3863502004</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-text-secondary mt-6">
                    © 2026 Super Aguilares. Todos los derechos reservados.
                </p>
            </div>
        </div>
    )
}
