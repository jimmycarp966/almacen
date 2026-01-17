'use client'

import { getSalesReport } from '@/actions/reports'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface DailyReport {
    date: string
    total: number
    orders?: number
}

interface CategoryReport {
    name: string
    count: number
}

export default function AdminReportesPage() {
    const [report, setReport] = useState<{ daily: DailyReport[], categories: CategoryReport[] }>({ daily: [], categories: [] })
    const [loading, setLoading] = useState(true)
    const [periodo, setPeriodo] = useState('semana')

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true)
            const data = await getSalesReport()
            setReport(data)
            setLoading(false)
        }
        fetchReport()
    }, [])

    const productosTop = [
        { nombre: 'Yerba Mate Playadito', categoria: 'Alimentos / Bebidas', ventas: 342, imagen: 'https://images.unsplash.com/photo-1615447550545-8f8e6b8e3b4e?w=100' },
        { nombre: 'Leche La Serenísima', categoria: 'Lácteos', ventas: 215, imagen: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100' },
        { nombre: 'Carne Vacuna', categoria: 'Carnes', ventas: 189, imagen: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=100' },
        { nombre: 'Coca-Cola', categoria: 'Bebidas', ventas: 142, imagen: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100' },
        { nombre: 'Pan Casero', categoria: 'Panadería', ventas: 98, imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100' },
    ]

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>

    const totalVentas = report.daily.reduce((sum, d) => sum + d.total, 0)
    const totalPedidos = report.daily.reduce((sum, d) => sum + (d.orders || 0), 0)
    const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0

    return (
        <div className="bg-background-light text-slate-900 font-display transition-colors duration-200 min-h-screen">
            {/* Header / Navigation */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                                <span className="material-symbols-outlined text-xl">analytics</span>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">Admin<span className="text-primary">Panel</span></h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/admin" className="text-sm font-medium text-slate-500 hover:text-primary:text-primary transition-colors">Dashboard</Link>
                            <Link href="/admin/productos" className="text-sm font-medium text-slate-500 hover:text-primary:text-primary transition-colors">Catálogo</Link>
                            <Link href="/admin/pedidos" className="text-sm font-medium text-slate-500 hover:text-primary:text-primary transition-colors">Pedidos</Link>
                            <Link href="/admin/reportes" className="text-sm font-medium text-slate-900 border-b-2 border-primary pb-5 mt-5">Reportes</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-white"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-slate-200 bg-cover bg-center ring-2 ring-white bg-gray-300"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Page Heading & Date Filter */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900">
                                Reportes y Estadísticas
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Resumen de rendimiento y métricas clave de ventas.
                            </p>
                        </div>
                        {/* Segmented Control */}
                        <div className="flex rounded-lg bg-surface-light p-1 border border-slate-200">
                            <button 
                                onClick={() => setPeriodo('hoy')}
                                className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-all focus:outline-none ${periodo === 'hoy' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5/10' : 'text-slate-500 hover:text-slate-700:text-slate-200'}`}
                            >
                                Hoy
                            </button>
                            <button 
                                onClick={() => setPeriodo('semana')}
                                className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-all focus:outline-none ${periodo === 'semana' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5/10' : 'text-slate-500 hover:text-slate-700:text-slate-200'}`}
                            >
                                Esta Semana
                            </button>
                            <button 
                                onClick={() => setPeriodo('mes')}
                                className={`relative rounded-md px-4 py-1.5 text-sm font-medium transition-all focus:outline-none ${periodo === 'mes' ? 'bg-white text-primary shadow-sm ring-1 ring-black/5/10' : 'text-slate-500 hover:text-slate-700:text-slate-200'}`}
                            >
                                Este Mes
                            </button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        {/* Card 1 */}
                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border-t-4 border-primary transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Ventas Totales</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">${totalVentas.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="flex items-center font-medium text-emerald-600">
                                    <span className="material-symbols-outlined mr-1 text-base">trending_up</span>
                                    12%
                                </span>
                                <span className="ml-2 text-slate-400">vs semana pasada</span>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border-t-4 border-primary transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Pedidos Realizados</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">{totalPedidos}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">shopping_bag</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="flex items-center font-medium text-emerald-600">
                                    <span className="material-symbols-outlined mr-1 text-base">trending_up</span>
                                    5%
                                </span>
                                <span className="ml-2 text-slate-400">vs semana pasada</span>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border-t-4 border-primary transition-all hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Ticket Promedio</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">${ticketPromedio.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">receipt_long</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <span className="flex items-center font-medium text-rose-600">
                                    <span className="material-symbols-outlined mr-1 text-base">trending_down</span>
                                    2%
                                </span>
                                <span className="ml-2 text-slate-400">vs semana pasada</span>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Chart Section */}
                        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Tendencia de Ventas</h3>
                                    <p className="text-sm text-slate-500">Ingresos mensuales de los últimos 6 meses</p>
                                </div>
                                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50:bg-slate-800 transition-colors">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>
                            {/* Custom SVG Chart */}
                            <div className="relative h-[300px] w-full pt-4">
                                <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#e60000" stopOpacity="0.15"></stop>
                                            <stop offset="100%" stopColor="#e60000" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    {/* Grid Lines */}
                                    <line className="" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.2" x1="0" x2="100" y1="0" y2="0"></line>
                                    <line className="" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.2" x1="0" x2="100" y1="12.5" y2="12.5"></line>
                                    <line className="" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.2" x1="0" x2="100" y1="25" y2="25"></line>
                                    <line className="" stroke="#e2e8f0" strokeDasharray="2" strokeWidth="0.2" x1="0" x2="100" y1="37.5" y2="37.5"></line>
                                    <line className="" stroke="#e2e8f0" strokeWidth="0.2" x1="0" x2="100" y1="50" y2="50"></line>
                                    {/* Area Fill */}
                                    <path d="M0,50 L0,35 Q10,25 20,30 T40,20 T60,15 T80,25 T100,10 V50 Z" fill="url(#chartGradient)"></path>
                                    {/* Line */}
                                    <path d="M0,35 Q10,25 20,30 T40,20 T60,15 T80,25 T100,10" fill="none" stroke="#e60000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8"></path>
                                    {/* Points */}
                                    <circle cx="20" cy="30" fill="#fff" r="1" stroke="#e60000" strokeWidth="0.5"></circle>
                                    <circle cx="40" cy="20" fill="#fff" r="1" stroke="#e60000" strokeWidth="0.5"></circle>
                                    <circle cx="60" cy="15" fill="#fff" r="1" stroke="#e60000" strokeWidth="0.5"></circle>
                                    <circle cx="80" cy="25" fill="#fff" r="1" stroke="#e60000" strokeWidth="0.5"></circle>
                                    <circle cx="100" cy="10" fill="#fff" r="1" stroke="#e60000" strokeWidth="0.5"></circle>
                                </svg>
                                {/* X Axis Labels */}
                                <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                                    <span>Feb</span>
                                    <span>Mar</span>
                                    <span>Abr</span>
                                    <span>May</span>
                                    <span>Jun</span>
                                    <span>Jul</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Products List */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 flex flex-col h-full">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Productos Más Vendidos</h3>
                                <Link href="/admin/productos" className="text-xs font-semibold text-primary hover:text-primary-dark">Ver Todo</Link>
                            </div>
                            <div className="flex-1 space-y-5 overflow-y-auto">
                                {productosTop.map((producto, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                            <img alt={producto.nombre} className="h-full w-full object-cover" src={producto.imagen}/>
                                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5/10"></div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-slate-900">{producto.nombre}</p>
                                            <p className="truncate text-xs text-slate-500">{producto.categoria}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-bold text-slate-900">{producto.ventas}</span>
                                            <span className="text-[10px] font-medium text-slate-400">ventas</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Extra Actions */}
                    <div className="mt-8 flex justify-end">
                        <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800:bg-slate-100 transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Exportar Reporte PDF
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
