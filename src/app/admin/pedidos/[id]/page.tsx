'use client'

import { getPedido } from '@/actions/orders'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

interface PedidoItem {
    id: string
    productos: {
        imagen_url?: string
        nombre: string
        sku?: string
    }
    cantidad: number
    precio_unitario: number
    subtotal: number
}

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function AdminPedidoDetallePage({ params }: PageProps) {
    const { id } = await params
    const pedido = await getPedido(id)

    if (!pedido) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background-light font-display transition-colors duration-200">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-neutral-200 bg-white px-6 py-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/admin/pedidos" className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg">
                        <span className="material-symbols-outlined">grid_view</span>
                    </Link>
                    <h2 className="text-neutral-900 text-lg font-bold leading-tight tracking-tight">Admin Panel</h2>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-neutral-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-neutral-900">Admin User</p>
                            <p className="text-xs text-neutral-500">Gerente de Ventas</p>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20 bg-neutral-200"></div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex justify-center w-full py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col w-full max-w-[1024px] gap-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Link href="/admin/pedidos" className="text-neutral-500 hover:text-primary transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Pedidos
                            </Link>
                            <span className="text-neutral-300">/</span>
                            <span className="text-neutral-900 font-medium">Detalle del Pedido</span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-all shadow-[0_4px_14px_0_rgba(195,55,55,0.39)] hover:shadow-[0_6px_20px_rgba(195,55,55,0.23)] active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">print</span>
                                Imprimir Ticket
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50:bg-neutral-800 text-neutral-700 text-sm font-medium transition-colors">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                Factura
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-red-50/10 border-l-[6px] border-primary p-6 rounded-r-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="bg-white p-3 rounded-full text-primary shrink-0 shadow-sm border border-red-100/30">
                                <span className="material-symbols-outlined text-3xl">verified</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight uppercase">Pago Confirmado</h3>
                                <p className="text-sm text-neutral-600 flex items-center gap-2 mt-1">
                                    <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                                    Método: <span className="font-bold text-neutral-900 capitalize">{pedido.metodo_pago}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 pr-2 rounded-lg border border-neutral-200 shadow-sm w-full md:w-auto">
                            <div className="size-16 shrink-0 bg-neutral-100 rounded overflow-hidden relative border border-neutral-100">
                                <div className="w-full h-full flex items-center justify-center bg-neutral-50 text-neutral-300">
                                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 pr-2">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Comprobante de Pago</span>
                                <button className="bg-neutral-900 hover:bg-black:bg-neutral-200 text-white text-xs font-bold px-4 py-2 rounded transition-colors flex items-center gap-2 shadow-lg shadow-neutral-900/10">
                                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    Ver Comprobante
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">Pedido #{pedido.numero}</h1>
                                    <div className="flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                        <span className="size-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider capitalize">{pedido.estado.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <p className="text-neutral-500 text-sm">
                                    Realizado el {format(new Date(pedido.fecha_creacion), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto p-4 bg-surface-light rounded-lg border border-neutral-100">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 rounded-full bg-neutral-200 overflow-hidden bg-neutral-300"></div>
                                    <div>
                                        <p className="text-sm font-bold text-neutral-900">Cliente</p>
                                        <p className="text-xs text-neutral-500">{pedido.usuarios?.telefono || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-neutral-200 hidden sm:block"></div>
                                <div className="flex flex-col gap-2 justify-center">
                                    <div className="flex items-center gap-2 text-sm text-neutral-700">
                                        <span className="material-symbols-outlined text-[16px] text-primary">smartphone</span>
                                        {pedido.usuarios?.telefono || 'No disponible'}
                                    </div>
                                    <div className="flex gap-2">
                                        <a
                                            href={`https://wa.me/${pedido.usuarios?.telefono?.replace(/\D/g, '') || ''}`}
                                            target="_blank"
                                            className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">chat</span>
                                            WhatsApp
                                        </a>
                                        <a
                                            href={`tel:${pedido.usuarios?.telefono || ''}`}
                                            className="flex-1 flex items-center justify-center gap-1 bg-primary hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">call</span>
                                            Llamar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
                                <div className="border-b border-neutral-200 px-6 py-4 bg-surface-light">
                                    <h3 className="font-bold text-neutral-900">Detalle de Productos</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-white text-neutral-500 border-b border-neutral-100">
                                            <tr>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Producto</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs w-24 text-center">Cant.</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs w-32 text-right">Precio Unit.</th>
                                                <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs w-32 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 text-neutral-800">
                                            {pedido.pedido_items.map((item: PedidoItem) => (
                                                <tr key={item.id} className="hover:bg-neutral-50:bg-surface-dark transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className="size-10 bg-neutral-100 rounded bg-cover bg-center"
                                                                style={{ backgroundImage: `url('${item.productos.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}
                                                            ></div>
                                                            <div>
                                                                <p className="font-bold text-neutral-900">{item.productos.nombre}</p>
                                                                <p className="text-xs text-neutral-500">SKU: {item.productos.sku || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center font-medium">{item.cantidad}</td>
                                                    <td className="px-6 py-4 text-right tabular-nums">${Number(item.precio_unitario).toLocaleString('es-AR')}</td>
                                                    <td className="px-6 py-4 text-right tabular-nums font-bold">${Number(item.subtotal).toLocaleString('es-AR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                            <div className="bg-surface-light p-6 rounded-xl border border-neutral-200">
                                <h3 className="font-bold text-neutral-900 mb-4 text-lg">Resumen</h3>
                                <div className="space-y-3 text-sm border-b border-dashed border-neutral-300 pb-4 mb-4">
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-neutral-900 tabular-nums">${Number(pedido.subtotal).toLocaleString('es-AR')}</span>
                                    </div>
                                    {pedido.recargo > 0 && (
                                        <div className="flex justify-between text-neutral-600">
                                            <span>Recargo ({pedido.cuotas} cuotas)</span>
                                            <span className="font-medium text-neutral-900 tabular-nums">+${Number(pedido.recargo).toLocaleString('es-AR')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Envío</span>
                                        <span className="font-medium text-neutral-900 tabular-nums">$0</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <span className="text-neutral-900 font-bold text-lg">Total General</span>
                                    <span className="text-primary font-black text-2xl tabular-nums">${Number(pedido.total).toLocaleString('es-AR')}</span>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-neutral-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="material-symbols-outlined text-neutral-400">local_shipping</span>
                                    <h3 className="font-bold text-neutral-900">Dirección de Envío</h3>
                                </div>
                                <p className="text-sm text-neutral-600 leading-relaxed">
                                    {pedido.datos_entrega?.direccion || 'No disponible'}
                                </p>
                                <div className="mt-4 h-24 w-full rounded-lg bg-neutral-100 overflow-hidden relative border border-neutral-200">
                                    <div className="w-full h-full bg-cover bg-center opacity-75 grayscale hover:grayscale-0 transition-all duration-500 bg-neutral-200"></div>
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="material-symbols-outlined text-primary text-3xl drop-shadow-md">location_on</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sticky bottom-6 z-40">
                        <div className="bg-neutral-900 text-white rounded-xl shadow-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-neutral-800 ring-1 ring-white/10 backdrop-blur-md bg-opacity-95">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="p-2 bg-neutral-800 rounded-lg">
                                    <span className="material-symbols-outlined text-neutral-400">tune</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Gestión del Estado</span>
                                    <span className="text-sm font-medium">Actualizar progreso del pedido</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="relative w-full sm:w-48 group">
                                    <select 
                                        defaultValue={pedido.estado}
                                        className="w-full appearance-none bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer transition-colors hover:bg-neutral-700"
                                    >
                                        <option value="recibido">Recibido</option>
                                        <option value="preparacion">Preparación</option>
                                        <option value="en_camino">En Camino</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-neutral-400">
                                        <span className="material-symbols-outlined text-sm">expand_more</span>
                                    </div>
                                </div>
                                <button className="bg-primary hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded-lg transition-all shadow-[0_4px_14px_0_rgba(195,55,55,0.39)] hover:shadow-[0_6px_20px_rgba(195,55,55,0.23)] active:scale-95 whitespace-nowrap flex-1 sm:flex-none">
                                    Actualizar Estado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
