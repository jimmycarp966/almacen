'use client'

import { getPedidosAdmin, updateEstadoPedido } from '@/actions/admin_ops'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'

const ESTADOS = [
    { value: 'recibido', label: 'Recibido', icon: 'inbox' },
    { value: 'preparacion', label: 'Preparación', icon: 'conveyor_belt' },
    { value: 'en_camino', label: 'En Camino', icon: 'local_shipping' },
    { value: 'entregado', label: 'Entregado', icon: 'check_circle' },
    { value: 'cancelado', label: 'Cancelado', icon: 'cancel' },
]

interface PedidoItem {
    id: string
    productos: {
        nombre: string
        imagen_url?: string
    }
    cantidad: number
    precio_unitario: number
    subtotal: number
}

interface Usuario {
    nombre: string
    email: string
    telefono?: string
}

interface DatosEntrega {
    direccion: string
    ciudad?: string
    codigo_postal?: string
}

interface Pedido {
    id: string
    numero: string
    estado: string
    fecha_creacion: string
    total: number
    pedido_items: PedidoItem[]
    usuarios: Usuario
    datos_entrega: DatosEntrega
    metodo_pago: string
    pago_validado: boolean
}

export default function AdminPedidosPage() {
    const [pedidos, setPedidos] = useState<Pedido[]>([])
    const [loading, setLoading] = useState(true)

    const fetchPedidos = async () => {
        setLoading(true)
        const data = await getPedidosAdmin()
        setPedidos(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPedidos()
    }, [])

    const handleUpdateStatus = async (id: string, state: string) => {
        await updateEstadoPedido(id, state)
        fetchPedidos()
    }

    const handlePrint = (pedido: Pedido) => {
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        const itemsHtml = pedido.pedido_items?.map((item: PedidoItem) => `
        <tr>
            <td style="padding: 5px 0;">${item.cantidad}x ${item.productos.nombre}</td>
            <td style="text-align: right; padding: 5px 0;">$${Number(item.subtotal).toLocaleString('es-AR')}</td>
        </tr>
    `).join('') || ''

        printWindow.document.write(`
      <html>
        <head>
          <title>Ticket Pedido #${pedido.numero}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 80mm; padding: 10px; font-size: 12px; }
            .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
            .footer { border-top: 1px dashed #000; padding-top: 10px; margin-top: 10px; text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            .total { font-weight: bold; font-size: 14px; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <h2 style="margin: 0;">SUPER AGUILARES</h2>
            <p style="margin: 5px 0;">Ticket de Pedido #${pedido.numero}</p>
            <p style="margin: 0;">${format(new Date(pedido.fecha_creacion), "dd/MM/yyyy HH:mm")}</p>
          </div>
          <div class="cliente">
            <p><strong>Cliente:</strong> ${pedido.usuarios?.nombre}</p>
            <p><strong>Tel:</strong> ${pedido.usuarios?.telefono}</p>
            <p><strong>Dir:</strong> ${pedido.datos_entrega?.direccion}</p>
          </div>
          <table>
            <thead>
                <tr>
                    <th style="text-align: left;">Item</th>
                    <th style="text-align: right;">Subt.</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
            </tbody>
          </table>
          <div class="footer">
            <p class="total">TOTAL: $${Number(pedido.total).toLocaleString('es-AR')}</p>
            <p>Pago: ${pedido.metodo_pago.toUpperCase()}</p>
            <p style="margin-top: 10px;">¡Gracias por su compra!</p>
          </div>
        </body>
      </html>
    `)
        printWindow.document.close()
    }

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'recibido': return 'bg-blue-100 text-blue-700'
            case 'preparacion': return 'bg-purple-100 text-purple-700'
            case 'en_camino': return 'bg-amber-100 text-amber-700'
            case 'entregado': return 'bg-emerald-100 text-emerald-700'
            case 'cancelado': return 'bg-red-100 text-red-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-end">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-text-main tracking-tight">Gestión de Pedidos</h1>
                    <p className="text-text-secondary font-medium">Visualiza y gestiona el flujo de trabajo de tus pedidos.</p>
                </div>
                <button onClick={fetchPedidos} className="btn-secondary flex items-center gap-2 !py-2.5">
                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                    Actualizar
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Pedido / Cliente</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Fecha</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Total</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider">Estado Actual</th>
                                <th className="px-8 py-5 text-sm font-bold text-text-secondary uppercase tracking-wider text-right">Acciones de Gestión</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={5} className="py-20 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div></td></tr>
                            ) : pedidos.length > 0 ? pedidos.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-text-secondary text-xs">
                                                {p.usuarios?.nombre?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">#{p.numero}</p>
                                                <p className="text-xs text-text-secondary font-medium">{p.usuarios?.nombre} • {p.usuarios?.telefono}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-medium text-text-main">
                                            {format(new Date(p.fecha_creacion), "dd/MM HH:mm", { locale: es })}
                                        </p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-extrabold text-text-main">${Number(p.total).toLocaleString('es-AR')}</p>
                                            <p className="text-[10px] text-text-secondary uppercase font-bold">{p.metodo_pago}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getEstadoBadge(p.estado)}`}>
                                                {p.estado.replace('_', ' ')}
                                            </span>
                                            {p.metodo_pago === 'transferencia' && !p.pago_validado && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Pago pendiente de validar"></span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <select
                                                value={p.estado}
                                                onChange={(e) => handleUpdateStatus(p.id, e.target.value)}
                                                className="bg-gray-50 border-0 text-xs font-bold rounded-xl py-2 px-3 focus:ring-2 focus:ring-primary h-9"
                                            >
                                                {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                                            </select>

                                            <button
                                                onClick={() => handlePrint(p)}
                                                className="p-2 text-gray-400 hover:text-text-main transition-colors h-9 w-9 flex items-center justify-center bg-gray-50 rounded-xl"
                                                title="Imprimir Ticket"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">print</span>
                                            </button>

                                            <a
                                                href={`https://wa.me/54${p.usuarios?.telefono?.replace(/\D/g, '')}?text=Hola ${p.usuarios?.nombre}, te escribimos de Super Aguilares sobre tu pedido #${p.numero}...`}
                                                target="_blank"
                                                className="p-2 text-gray-400 hover:text-emerald-500 transition-colors h-9 w-9 flex items-center justify-center bg-gray-50 rounded-xl"
                                                title="Enviar WhatsApp"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chat</span>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <p className="text-text-secondary font-medium">Aún no hay pedidos registrados.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
