'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ConfiguracionPage() {
    const [nombreNegocio, setNombreNegocio] = useState('Super Aguilares')
    const [slogan, setSlogan] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [whatsapp, setWhatsapp] = useState('5493810000000')
    const [instagram, setInstagram] = useState('')
    const [direccion, setDireccion] = useState('')
    const [horarios, setHorarios] = useState({
        lunes: { abierto: true, inicio: '09:00', fin: '18:00' },
        martes: { abierto: true, inicio: '09:00', fin: '18:00' },
        miercoles: { abierto: true, inicio: '09:00', fin: '18:00' },
        jueves: { abierto: true, inicio: '09:00', fin: '18:00' },
        viernes: { abierto: true, inicio: '09:00', fin: '18:00' },
        sabado: { abierto: true, inicio: '09:00', fin: '14:00' },
        domingo: { abierto: false, inicio: '09:00', fin: '18:00' },
    })

    const dias = [
        { key: 'lunes', label: 'Lunes', letra: 'L' },
        { key: 'martes', label: 'Martes', letra: 'M' },
        { key: 'miercoles', label: 'Miércoles', letra: 'X' },
        { key: 'jueves', label: 'Jueves', letra: 'J' },
        { key: 'viernes', label: 'Viernes', letra: 'V' },
        { key: 'sabado', label: 'Sábado', letra: 'S' },
        { key: 'domingo', label: 'Domingo', letra: 'D' },
    ]

    return (
        <div className="min-h-screen bg-surface-light text-[#181010] font-display">
            {/* Top Navbar */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f5f0f0][#2a2e33] bg-background-light px-10 py-3 shadow-sm">
                <div className="flex items-center gap-4 text-[#181010]">
                    <div className="size-6 text-primary">
                        <span className="material-symbols-outlined text-2xl">grid_view</span>
                    </div>
                    <h2 className="text-[#181010] text-lg font-bold leading-tight tracking-[-0.015em]">Admin Panel</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <button className="text-[#8d5e5e] hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-transparent hover:border-primary cursor-pointer transition-all bg-gray-200"></div>
                </div>
            </header>

            <div className="layout-container flex h-full grow flex-col pb-24">
                {/* Breadcrumbs & Heading */}
                <div className="w-full flex justify-center pt-8 pb-4">
                    <div className="flex flex-col max-w-[960px] w-full px-4 lg:px-0">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Link href="/admin" className="text-[#8d5e5e] hover:text-primary:text-primary text-sm font-medium leading-normal transition-colors">Inicio</Link>
                            <span className="text-[#8d5e5e] text-sm font-medium leading-normal">/</span>
                            <span className="text-[#181010] text-sm font-medium leading-normal">Configuración</span>
                        </div>
                        <div className="flex flex-wrap justify-between gap-3">
                            <div className="flex min-w-72 flex-col gap-2">
                                <h1 className="text-[#181010] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Configuración del Negocio</h1>
                                <p className="text-[#8d5e5e] text-base font-normal leading-normal">Gestiona la identidad y disponibilidad de tu tienda para tus clientes.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full flex justify-center">
                    <div className="flex flex-col gap-8 max-w-[960px] w-full px-4 lg:px-0">
                        {/* Section: Información General */}
                        <div className="flex flex-col rounded-xl bg-background-light border border-[#f0f0f0][#333] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#f0f0f0][#333]">
                                <h2 className="text-[#181010] text-xl font-bold leading-tight">Información General</h2>
                            </div>
                            <div className="p-6 md:p-8 flex flex-col gap-8">
                                {/* Logo Uploader */}
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="relative group">
                                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-xl h-32 w-32 shadow-inner border border-gray-100 bg-gray-200 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-gray-400 text-4xl">store</span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <span className="material-symbols-outlined text-white">edit</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-[#181010] text-lg font-bold">Logo de la Tienda</h3>
                                        <p className="text-[#8d5e5e] text-sm">Formato recomendado: PNG o JPG. Max 2MB.<br/>Dimensiones ideales: 500x500px.</p>
                                        <div className="flex gap-3 mt-2">
                                            <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[#f5f0f0] hover:bg-gray-200[#333]:bg-[#444] text-[#181010] text-sm font-bold transition-colors">
                                                Subir Nueva Imagen
                                            </button>
                                            <button className="flex items-center justify-center rounded-lg h-9 px-4 text-primary text-sm font-bold hover:bg-primary/5 transition-colors">
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#181010]">Nombre del Negocio</label>
                                        <input
                                            className="w-full h-11 rounded-lg border border-[#e0e0e0][#444] bg-white[#2a2e33] px-4 text-sm text-[#181010] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            type="text"
                                            value={nombreNegocio}
                                            onChange={(e) => setNombreNegocio(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-[#181010]">Slogan (Opcional)</label>
                                        <input
                                            className="w-full h-11 rounded-lg border border-[#e0e0e0][#444] bg-white[#2a2e33] px-4 text-sm text-[#181010] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            type="text"
                                            placeholder="Ej. La mejor moda a tu alcance"
                                            value={slogan}
                                            onChange={(e) => setSlogan(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-sm font-bold text-[#181010]">Descripción del Negocio</label>
                                        <textarea
                                            className="w-full rounded-lg border border-[#e0e0e0][#444] bg-white[#2a2e33] p-4 text-sm text-[#181010] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                            rows={4}
                                            placeholder="Describe tu negocio..."
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                        ></textarea>
                                        <span className="text-xs text-[#8d5e5e] self-end">{descripcion.length}/500 caracteres</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: Horarios de Atención */}
                        <div className="flex flex-col rounded-xl bg-background-light border border-[#f0f0f0][#333] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#f0f0f0][#333] flex justify-between items-center">
                                <h2 className="text-[#181010] text-xl font-bold leading-tight">Horarios de Atención</h2>
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Zona Horaria: UTC-5</span>
                            </div>
                            <div className="p-0">
                                {/* Header Row */}
                                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#f9fafb][#25282c] text-xs font-bold text-[#8d5e5e] uppercase tracking-wider">
                                    <div className="col-span-4">Día</div>
                                    <div className="col-span-2 text-center">Estado</div>
                                    <div className="col-span-6">Horario</div>
                                </div>
                                {/* Days Rows */}
                                <div className="divide-y divide-[#f0f0f0][#333]">
                                    {dias.map((dia) => (
                                        <div key={dia.key} className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50:bg-[#2a2e33] transition-colors ${!horarios[dia.key as keyof typeof horarios].abierto ? 'bg-gray-50/50[#232529]' : ''}`}>
                                            <div className="col-span-1 md:col-span-4 flex items-center gap-3">
                                                <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs ${!horarios[dia.key as keyof typeof horarios].abierto ? 'bg-red-50/20 text-red-600' : 'bg-blue-50/20 text-blue-600'}`}>
                                                    {dia.letra}
                                                </div>
                                                <span className="font-bold text-[#181010]">{dia.label}</span>
                                            </div>
                                            <div className="col-span-1 md:col-span-2 flex md:justify-center">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        checked={horarios[dia.key as keyof typeof horarios].abierto}
                                                        className="sr-only peer"
                                                        type="checkbox"
                                                        onChange={(e) => setHorarios((prev: any) => ({ ...prev, [dia.key]: { ...prev[dia.key as keyof typeof horarios], abierto: e.target.checked } }))}
                                                    />
                                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                    <span className="ml-3 text-sm font-medium text-gray-900 md:hidden">
                                                        {horarios[dia.key as keyof typeof horarios].abierto ? 'Abierto' : 'Cerrado'}
                                                    </span>
                                                </label>
                                            </div>
                                            <div className={`col-span-1 md:col-span-6 flex items-center gap-2 ${!horarios[dia.key as keyof typeof horarios].abierto ? 'opacity-50 grayscale pointer-events-none select-none' : ''}`}>
                                                <div className="relative flex-1">
                                                    <input
                                                        className="w-full h-10 rounded border border-[#e0e0e0][#444] bg-white[#2a2e33] px-3 text-sm text-[#181010] focus:border-primary outline-none"
                                                        type="time"
                                                        value={horarios[dia.key as keyof typeof horarios].inicio}
                                                        onChange={(e) => setHorarios(prev => ({ ...prev, [dia.key]: { ...prev[dia.key as keyof typeof horarios], inicio: e.target.value } }))}
                                                        disabled={!horarios[dia.key as keyof typeof horarios].abierto}
                                                    />
                                                </div>
                                                <span className="text-[#8d5e5e]">-</span>
                                                <div className="relative flex-1">
                                                    <input
                                                        className="w-full h-10 rounded border border-[#e0e0e0][#444] bg-white[#2a2e33] px-3 text-sm text-[#181010] focus:border-primary outline-none"
                                                        type="time"
                                                        value={horarios[dia.key as keyof typeof horarios].fin}
                                                        onChange={(e) => setHorarios(prev => ({ ...prev, [dia.key]: { ...prev[dia.key as keyof typeof horarios], fin: e.target.value } }))}
                                                        disabled={!horarios[dia.key as keyof typeof horarios].abierto}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section: Contacto y Redes */}
                        <div className="flex flex-col rounded-xl bg-background-light border border-[#f0f0f0][#333] shadow-[0px_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
                            <div className="px-6 py-5 border-b border-[#f0f0f0][#333]">
                                <h2 className="text-[#181010] text-xl font-bold leading-tight">Contacto y Redes</h2>
                            </div>
                            <div className="p-6 md:p-8 grid gap-6 md:grid-cols-2">
                                {/* WhatsApp */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#181010] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-green-600 text-lg">chat</span>
                                        WhatsApp Business
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-500 text-sm font-bold">+52</span>
                                        </div>
                                        <input
                                            className="w-full h-11 rounded-lg border border-[#e0e0e0][#444] bg-white[#2a2e33] pl-12 pr-4 text-sm text-[#181010] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="123 456 7890"
                                            type="tel"
                                            value={whatsapp}
                                            onChange={(e) => setWhatsapp(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Instagram */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#181010] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-pink-600 text-lg">photo_camera</span>
                                        Instagram
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-500 text-sm">@</span>
                                        </div>
                                        <input
                                            className="w-full h-11 rounded-lg border border-[#e0e0e0][#444] bg-white[#2a2e33] pl-8 pr-4 text-sm text-[#181010] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="mitienda.oficial"
                                            type="text"
                                            value={instagram}
                                            onChange={(e) => setInstagram(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Address */}
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-bold text-[#181010] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                        Dirección Física
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 h-11 rounded-lg border border-[#e0e0e0][#444] bg-white[#2a2e33] px-4 text-sm text-[#181010] placeholder:text-[#9ca3af] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            placeholder="Av. Principal #123, Colonia Centro"
                                            type="text"
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value)}
                                        />
                                        <button className="h-11 px-4 rounded-lg bg-gray-100[#333] hover:bg-gray-200:bg-[#444] text-[#181010] font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap">
                                            <span className="material-symbols-outlined text-lg">map</span>
                                            <span className="hidden sm:inline">Ubicar en Mapa</span>
                                        </button>
                                    </div>
                                    {/* Mini Map Placeholder */}
                                    <div className="mt-2 w-full h-40 bg-gray-100 rounded-lg overflow-hidden relative border border-[#e0e0e0][#444]">
                                        <div className="bg-center bg-no-repeat bg-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-500 bg-gray-200"></div>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="bg-primary text-white p-2 rounded-full shadow-lg">
                                                <span className="material-symbols-outlined">location_on</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#f0f0f0][#333] py-4 px-6 md:px-10 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="max-w-[960px] mx-auto flex items-center justify-between">
                    <button className="text-[#8d5e5e] font-bold text-sm hover:text-[#181010]:text-white transition-colors px-4 py-2">
                        Descartar Cambios
                    </button>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-primary hover:bg-[#cc0000] text-white rounded-lg px-8 py-3 text-sm font-bold shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                            <span className="material-symbols-outlined text-lg">save</span>
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
