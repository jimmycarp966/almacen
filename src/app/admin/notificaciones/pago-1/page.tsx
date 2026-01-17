'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NotificacionPagoAdmin1Page() {
    const [notificationVisible, setNotificationVisible] = useState(true)

    const pedidos = [
        { id: 'ORD-001', cliente: 'Juan Pérez', email: 'juan.perez@email.com', telefono: '+52 55 1234 5678', fecha: 'Hace 1 min', monto: 1250, metodo: 'QR', estado: 'Verificando', nuevo: true },
        { id: 'ORD-002', cliente: 'Maria García', email: 'maria.g@email.com', telefono: '+34 612 345 678', fecha: 'Hace 20 min', monto: 450, metodo: 'Tarjeta', estado: 'Pagado', nuevo: false },
        { id: 'ORD-003', cliente: 'Carlos Lopez', email: 'c.lopez@email.com', telefono: '+57 300 123 4567', fecha: 'Hace 1 hora', monto: 890, metodo: 'Efectivo', estado: 'Preparando', nuevo: false },
        { id: 'ORD-004', cliente: 'Ana Torres', email: 'ana.t@email.com', telefono: '+1 202 555 0123', fecha: 'Hace 2 horas', monto: 120, metodo: 'Tarjeta', estado: 'Pagado', nuevo: false },
    ]

    const handleWhatsApp = (telefono: string) => {
        window.open(`https://wa.me/${telefono.replace(/[^0-9]/g, '')}`, '_blank')
    }

    return (
        <div className="min-h-screen bg-surface-light text-text-main font-display antialiased h-screen flex overflow-hidden">
            {/* Notification Popup */}
            {notificationVisible && (
                <div className="fixed top-24 right-8 z-50 w-full max-w-sm transform transition-all duration-300 ease-out">
                    <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-l-4 border-primary p-5 flex items-start gap-4">
                        <div className="bg-red-50 p-2 rounded-full shrink-0">
                            <span className="material-symbols-outlined text-primary text-2xl">payments</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-text-main text-lg leading-tight mb-1">¡Nuevo Pago Recibido!</h3>
                                <span className="flex h-2 w-2 relative">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                            </div>
                            <p className="text-text-secondary text-sm mb-3">
                                <span className="font-medium text-text-main">Juan Pérez</span> ha enviado <span className="font-bold text-text-main">$1,250.00</span> vía Transferencia QR.
                            </p>
                            <div className="flex gap-3">
                                <Link href="/admin/pagos/aprobar/ORD-001" className="text-xs font-bold text-white bg-primary hover:bg-red-700 px-4 py-2 rounded-lg transition-colors">
                                    Ver Detalles
                                </Link>
                                <button onClick={() => setNotificationVisible(false)} className="text-xs font-bold text-text-secondary hover:text-text-main px-2 py-2 transition-colors">
                                    Ignorar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-200 flex-col hidden lg:flex">
                <div className="h-16 flex items-center px-8 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
                        <span className="font-bold text-xl tracking-tight text-text-main">AdminPanel</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <p className="px-4 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">General</p>
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-light transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:text-text-main">grid_view</span>
                            <span className="font-medium group-hover:text-text-main">Dashboard</span>
                        </Link>
                        <Link href="/admin/pedidos" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl font-semibold">shopping_cart</span>
                            <span className="font-bold">Pedidos</span>
                        </Link>
                        <Link href="/admin/pagos" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-light transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:text-text-main">credit_card</span>
                            <span className="font-medium group-hover:text-text-main">Pagos</span>
                        </Link>
                        <Link href="/admin/usuarios" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-light transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:text-text-main">group</span>
                            <span className="font-medium group-hover:text-text-main">Usuarios</span>
                        </Link>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="px-4 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Sistema</p>
                        <Link href="/admin/notificaciones" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-light transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:text-text-main">notifications</span>
                            <span className="font-medium group-hover:text-text-main">Notificaciones</span>
                            <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                        </Link>
                        <Link href="/admin/configuracion" className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-surface-light transition-colors group">
                            <span className="material-symbols-outlined text-xl group-hover:text-text-main">settings</span>
                            <span className="font-medium group-hover:text-text-main">Configuración</span>
                        </Link>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-light cursor-pointer">
                        <div className="h-10 w-10 rounded-full bg-gray-200 bg-cover bg-center bg-gray-300"></div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-text-main">Admin User</span>
                            <span className="text-xs text-text-secondary">admin@empresa.com</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <button className="lg:hidden text-text-main">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="hidden md:flex items-center max-w-md w-full bg-surface-light rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-text-secondary">search</span>
                        <input className="bg-transparent border-none focus:ring-0 text-sm w-full text-text-main placeholder-text-secondary" placeholder="Buscar pedidos, clientes..." type="text"/>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-text-secondary hover:text-text-main hover:bg-surface-light rounded-full transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary border-2 border-white"></span>
                        </button>
                        <button className="p-2 text-text-secondary hover:text-text-main hover:bg-surface-light rounded-full transition-colors">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-surface-light p-8">
                    <div className="max-w-6xl mx-auto flex flex-col gap-8">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-text-main tracking-tight">Gestión de Pedidos</h1>
                                <p className="text-text-secondary text-sm mt-1">Administra y verifica los pagos entrantes en tiempo real.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-text-main hover:bg-gray-50 transition-colors shadow-sm">
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Exportar
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-200">
                                    <span className="material-symbols-outlined text-lg">add</span>
                                    Nuevo Pedido
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-red-50 rounded-lg text-primary">
                                        <span className="material-symbols-outlined">attach_money</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm font-medium">Ingresos Hoy</p>
                                    <h3 className="text-2xl font-bold text-text-main">$4,250.00</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-gray-50 rounded-lg text-text-main">
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+4 nuevos</span>
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm font-medium">Pedidos Activos</p>
                                    <h3 className="text-2xl font-bold text-text-main">28</h3>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-gray-50 rounded-lg text-text-main">
                                        <span className="material-symbols-outlined">pending</span>
                                    </div>
                                    <span className="text-xs font-bold text-primary bg-red-50 px-2 py-1 rounded-full">Atención</span>
                                </div>
                                <div>
                                    <p className="text-text-secondary text-sm font-medium">Pendientes de Pago</p>
                                    <h3 className="text-2xl font-bold text-text-main">5</h3>
                                </div>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                                <h2 className="font-bold text-lg text-text-main">Pedidos Recientes</h2>
                                <div className="flex gap-2">
                                    <button className="p-2 text-text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-xl">filter_list</span>
                                    </button>
                                    <button className="p-2 text-text-secondary hover:bg-gray-50 rounded-lg transition-colors">
                                        <span className="material-symbols-outlined text-xl">more_horiz</span>
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-200">
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider w-12"></th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Monto</th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Método</th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pedidos.map((pedido) => (
                                            <tr key={pedido.id} className={`${pedido.nuevo ? 'bg-red-50/40 group hover:bg-red-50' : 'hover:bg-gray-50'} transition-colors`}>
                                                <td className="px-6 py-4 text-center">
                                                    {pedido.nuevo && (
                                                        <div className="h-2.5 w-2.5 rounded-full bg-primary static-pulse mx-auto" title="Nuevo"></div>
                                                    )}
                                                </td>
                                                <td className={`px-6 py-4 text-sm font-medium ${pedido.nuevo ? 'text-primary' : 'text-text-secondary'}`}>
                                                    #{pedido.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-gray-200 bg-cover bg-gray-300"></div>
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm ${pedido.nuevo ? 'font-bold' : 'font-medium'} text-text-main`}>{pedido.cliente}</span>
                                                            <span className="text-xs text-text-secondary">{pedido.email}</span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs text-text-secondary font-medium tracking-tight">{pedido.telefono}</span>
                                                                <button 
                                                                    onClick={() => handleWhatsApp(pedido.telefono)}
                                                                    className="flex items-center justify-center w-5 h-5 rounded-full bg-primary hover:bg-red-700 transition-colors"
                                                                    title="Chat en WhatsApp"
                                                                >
                                                                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 16 16">
                                                                        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary">
                                                    {pedido.nuevo ? (
                                                        <span className="inline-flex items-center gap-1 font-medium text-primary">
                                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                                            {pedido.fecha}
                                                        </span>
                                                    ) : (
                                                        pedido.fecha
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-text-main">
                                                    ${pedido.monto.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border ${pedido.nuevo ? 'border-gray-200 text-text-main' : 'border-gray-200 text-text-secondary'} text-xs font-medium shadow-sm`}>
                                                        <span className="material-symbols-outlined text-sm">
                                                            {pedido.metodo === 'QR' ? 'qr_code_2' : pedido.metodo === 'Tarjeta' ? 'credit_card' : 'payments'}
                                                        </span>
                                                        {pedido.metodo}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                        pedido.estado === 'Verificando' ? 'bg-yellow-100 text-yellow-800' :
                                                        pedido.estado === 'Pagado' ? 'bg-green-100 text-green-800' :
                                                        'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {pedido.estado === 'Verificando' && <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>}
                                                        {pedido.estado === 'Pagado' && <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>}
                                                        {pedido.estado === 'Preparando' && <span className="material-symbols-outlined text-sm">inventory_2</span>}
                                                        {pedido.estado}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={`/admin/pedidos/${pedido.id}`} className={`${pedido.nuevo ? 'text-primary hover:text-red-700' : 'text-text-secondary hover:text-text-main'} font-medium text-sm`}>
                                                        {pedido.nuevo ? 'Ver Detalles' : 'Ver'}
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                                <p className="text-xs text-text-secondary">Mostrando 4 de 45 pedidos</p>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-xs font-medium text-text-secondary border border-gray-200 rounded hover:bg-gray-50">Anterior</button>
                                    <button className="px-3 py-1 text-xs font-medium text-text-secondary border border-gray-200 rounded hover:bg-gray-50">Siguiente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .static-pulse {
                    box-shadow: 0 0 0 4px rgba(234, 42, 51, 0.2);
                }
            `}</style>
        </div>
    )
}
