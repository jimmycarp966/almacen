'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { identificarUsuario } from '@/actions/auth'
import { useSessionStore } from '@/store/sessionStore'

export default function IdentificacionPage() {
    const router = useRouter()
    const [phone, setPhone] = useState('')
    const [nombre, setNombre] = useState('')
    const [needsName, setNeedsName] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const setSession = useSessionStore((state) => state.setSession)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('telefono', phone)
        if (needsName) formData.append('nombre', nombre)

        const result = await identificarUsuario(formData)

        if (result.success) {
            if (result.needsName) {
                setNeedsName(true)
            } else if (result.user) {
                setSession(result.user)
                // Redirigir según el rol del usuario
                if (result.user.rol === 'admin') {
                    router.push('/admin')
                } else {
                    router.push('/catalogo')
                }
            }
        } else {
            setError(result.message || 'Error al intentar ingresar')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-text-dark antialiased overflow-x-hidden selection:bg-primary/20 selection:text-primary">
            <div className="relative flex min-h-screen w-full flex-col">
                {/* Header */}
                <header className="flex w-full items-center justify-between border-b border-[#f4f1f1] px-10 py-5 bg-white/80 backdrop-blur-sm fixed top-0 z-50">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => router.push('/')}>
                        <div className="size-8 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl">local_mall</span>
                        </div>
                        <h2 className="text-[#171212] text-xl font-bold leading-tight tracking-tight">Catálogo Shop</h2>
                    </div>
                    <div className="hidden md:flex gap-6 text-sm font-medium text-[#171212]/70">
                        <a className="hover:text-primary transition-colors" href="#">Ayuda</a>
                        <a className="hover:text-primary transition-colors" href="#">Privacidad</a>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center justify-center relative p-6 mt-20">
                    {/* Abstract background element */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]"></div>
                        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px]"></div>
                    </div>

                    {/* Login Card */}
                    <div className="relative z-10 w-full max-w-[480px] bg-white rounded-2xl shadow-soft border border-slate-100 p-8 md:p-12 animate-fade-in-up">
                        <div className="flex flex-col gap-8">
                            {/* Headline Section */}
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <h1 className="text-[#171212] text-3xl font-bold tracking-tight">
                                    {needsName ? 'Casi listo' : 'Bienvenido de nuevo'}
                                </h1>
                                <p className="text-[#826868] text-base font-normal">
                                    {needsName ? 'Completa tu perfil para continuar' : 'Ingresa tu número para acceder a tu cuenta'}
                                </p>
                            </div>

                            {/* Input Section */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-[#171212] ml-1" htmlFor="phone">Número de celular</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-primary group-focus-within:scale-110 transition-transform duration-200">smartphone</span>
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="55 1234 5678"
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 pl-12 pr-4 py-4 text-[#171212] placeholder:text-gray-400 focus:border-black focus:ring-black focus:bg-white transition-all duration-200 text-lg font-medium shadow-sm hover:border-gray-300"
                                            disabled={loading || needsName}
                                        />
                                    </div>
                                </div>

                                {needsName && (
                                    <div className="space-y-1 animate-fade-in">
                                        <label className="text-sm font-semibold text-[#171212] ml-1" htmlFor="nombre">¿Cuál es tu nombre?</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="material-symbols-outlined text-primary group-focus-within:scale-110 transition-transform duration-200">badge</span>
                                            </div>
                                            <input
                                                id="nombre"
                                                name="nombre"
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Tu nombre completo"
                                                className="block w-full rounded-xl border-gray-200 bg-gray-50/50 pl-12 pr-4 py-4 text-[#171212] placeholder:text-gray-400 focus:border-black focus:ring-black focus:bg-white transition-all duration-200 text-lg font-medium shadow-sm hover:border-gray-300"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Button Section */}
                                <button
                                    type="submit"
                                    disabled={loading || !phone || (needsName && !nombre)}
                                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-white bg-primary hover:bg-[#a92b2b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-bold text-lg shadow-lg shadow-primary/30 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="absolute left-0 inset-y-0 flex items-center pl-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </span>
                                    {loading ? 'Procesando...' : needsName ? 'Completar Registro' : 'Ingresar'}
                                </button>

                                {/* Helper Text */}
                                <div className="text-center px-4">
                                    <p className="text-xs text-[#826868] leading-relaxed">
                                        Al continuar, aceptas recibir un código de verificación por SMS.
                                        <br className="hidden sm:block" />
                                        Pueden aplicar tarifas estándar de mensajería.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="mt-8 text-center text-sm text-[#826868] relative z-10">
                        <p>¿No tienes una cuenta? <a className="text-primary font-bold hover:underline" href="#">Regístrate aquí</a></p>
                    </div>
                </main>

                {/* Bottom abstract graphic */}
                <div className="h-2 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent absolute bottom-0"></div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    )
}
