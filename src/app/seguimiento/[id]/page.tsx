import { getPedido } from '@/actions/orders'
import { Navbar } from '@/components/layout/Navbar'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ClientNotifications } from '@/components/client/ClientNotifications'

interface PageProps {
    params: Promise<{ id: string }>
}

interface PedidoItem {
    id: string
    productos: {
        imagen_url?: string
        nombre: string
    }
    precio_unitario: number
    cantidad: number
    subtotal: number
}

const ESTADOS = [
    { key: 'recibido', label: 'Recibido', icon: 'inventory_2' },
    { key: 'preparacion', label: 'Preparación', icon: 'package_2' },
    { key: 'en_camino', label: 'En Camino', icon: 'local_shipping' },
    { key: 'entregado', label: 'Entregado', icon: 'check_circle' },
]

export default async function SeguimientoPage({ params }: PageProps) {
    const { id } = await params
    const pedido = await getPedido(id)

    if (!pedido) {
        notFound()
    }

    const currentStatusIndex = ESTADOS.findIndex(e => e.key === pedido.estado)

    return (
        <div className="min-h-screen bg-background-light">
            <Navbar />
            
            {/* Notificaciones en tiempo real */}
            <ClientNotifications />

            <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Page Heading & Status */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Volver al catálogo
                            </Link>
                            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 capitalize">
                                {pedido.estado.replace('_', ' ')}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text-main">
                            Pedido #{pedido.numero}
                        </h2>
                        <p className="text-gray-500 mt-1 text-base">
                            Realizado el {format(new Date(pedido.fecha_creacion), "d 'de' MMMM, yyyy", { locale: es })}
                        </p>
                    </div>
                    <button className="bg-white border border-gray-200 hover:bg-gray-50 text-text-main font-bold py-2.5 px-5 rounded-lg text-sm transition-all shadow-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                        Descargar Comprobante
                    </button>
                </div>

                {/* Horizontal Timeline */}
                <div className="bg-white rounded-xl p-6 md:p-10 shadow-soft border border-gray-100 mb-8 overflow-x-auto">
                    <div className="min-w-[600px] relative mt-4 mb-8">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full -translate-y-1/2"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-primary -z-0 rounded-full transition-all duration-1000 ease-out -translate-y-1/2"
                            style={{ width: `${(currentStatusIndex / (ESTADOS.length - 1)) * 100}%` }}
                        ></div>

                        <div className="flex justify-between items-center">
                            {ESTADOS.map((estado, index) => {
                                const isActive = index <= currentStatusIndex
                                const isCurrent = index === currentStatusIndex

                                return (
                                    <div key={estado.key} className="flex flex-col items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 ring-4 ring-white
                      ${isActive ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-400'}
                      ${isCurrent ? 'scale-125 ring-primary/20 animate-pulse' : ''}
                    `}>
                                            <span className="material-symbols-outlined text-[20px]">{estado.icon}</span>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm font-bold ${isActive ? 'text-primary' : 'text-gray-400'}`}>
                                                {estado.label}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative bg-white[#25282c] rounded-xl shadow-soft border border-gray-100 overflow-hidden pb-10">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50/30">
                                <h3 className="text-lg font-bold text-text-main">Detalle de Productos</h3>
                                <span className="text-sm text-gray-500 font-medium">{pedido.pedido_items.length} artículos</span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {pedido.pedido_items.map((item: PedidoItem) => (
                                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50/50:bg-gray-800/20 transition-colors">
                                        <div
                                            className="w-full sm:w-20 h-20 bg-gray-100 rounded-lg bg-cover bg-center shrink-0 border border-gray-200"
                                            style={{ backgroundImage: `url('${item.productos.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}
                                        ></div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-base font-bold text-text-main">{item.productos.nombre}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Precio unitario: ${Number(item.precio_unitario).toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-end text-right">
                                            <span className="text-sm text-gray-500 mb-0 sm:mb-1 font-medium">x{item.cantidad} unidades</span>
                                            <p className="text-base font-bold text-text-main">${Number(item.subtotal).toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50/50 p-6 space-y-4 border-t border-dashed border-gray-200">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span className="font-medium">Subtotal</span>
                                    <span className="font-bold">${Number(pedido.subtotal).toLocaleString('es-AR')}</span>
                                </div>
                                {pedido.recargo > 0 && (
                                    <div className="flex justify-between text-sm text-primary font-medium">
                                        <span>Recargo ({pedido.cuotas} cuotas)</span>
                                        <span>+${Number(pedido.recargo).toLocaleString('es-AR')}</span>
                                    </div>
                                )}
                                <div className="h-px bg-gray-200 my-2"></div>
                                <div className="flex justify-between items-center pt-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Pagado</span>
                                        <span className="text-3xl font-black text-primary">${Number(pedido.total).toLocaleString('es-AR')}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 font-mono">ID: {pedido.id.slice(0, 8).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Receipt Tear Effect */}
                            <div className="absolute bottom-0 left-0 w-full flex justify-around items-end overflow-hidden h-4">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className="w-8 h-8 bg-background-light rounded-full -mb-4 border-t border-gray-100"></div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white[#25282c] p-6 rounded-xl border border-gray-100 shadow-soft">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <span className="material-symbols-outlined text-2xl">payments</span>
                                    </div>
                                    <h4 className="font-bold text-text-main">Pago y Facturación</h4>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-bold text-text-main capitalize">{pedido.metodo_pago}</p>
                                    <p className="text-sm text-gray-500">{pedido.cuotas > 0 ? `${pedido.cuotas} cuotas` : 'Pago único'}</p>
                                </div>
                            </div>
                            <div className="bg-white[#25282c] p-6 rounded-xl border border-gray-100 shadow-soft">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <span className="material-symbols-outlined text-2xl">local_shipping</span>
                                    </div>
                                    <h4 className="font-bold text-text-main">Dirección de Entrega</h4>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                    {pedido.datos_entrega.direccion}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Support Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-soft border border-primary/20 p-6 relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-text-main mb-2">¿Necesitas ayuda?</h3>
                                <p className="text-sm text-gray-500 mb-6">Si tienes dudas sobre tu pedido, contáctanos por WhatsApp.</p>
                                <a
                                    href={`https://wa.me/5491100000000?text=Hola, tengo una duda sobre mi pedido ${pedido.numero}`}
                                    target="_blank"
                                    className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-3 px-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg mb-3"
                                >
                                    <span className="material-symbols-outlined">chat</span>
                                    Enviar WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-12 border-t border-gray-100 py-8 text-center bg-white">
                <p className="text-sm text-gray-400">© 2026 Super Aguilares. Todos los derechos reservados.</p>
            </footer>
        </div>
    )
}
