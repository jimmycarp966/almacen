'use client'

import { useState } from 'react'

export default function CatalogoCarritoLateral3Page() {
interface Producto {
    id: number
    nombre: string
    descripcion: string
    precio: number
    imagen: string
    nuevo?: boolean
    precioOriginal?: number
    descuento?: string
}

interface CartItem extends Producto {
    cantidad: number
}

    const [cartItems, setCartItems] = useState<CartItem[]>([])

    const productos = [
        { id: 1, nombre: 'Silla Ergonómica Z-40', descripcion: 'Diseño minimalista con soporte lumbar ajustable y malla transpirable de alta resistencia.', precio: 320, imagen: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500', nuevo: true },
        { id: 2, nombre: 'Lámpara Nórdica', descripcion: 'Iluminación LED suave con base de madera de roble sostenible.', precio: 85.50, imagen: 'https://images.unsplash.com/photo-1513506003011-3b03c8013682?w=500', nuevo: false },
        { id: 3, nombre: 'Escritorio Elevable Pro', descripcion: 'Sistema motorizado dual, superficie anti-manchas y control de memoria.', precio: 552.50, precioOriginal: 650, imagen: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500', nuevo: false, descuento: '-15%' },
        { id: 4, nombre: 'Estantería Modular Axis', descripcion: 'Configurable en altura y anchura. Acabado mate resistente a rayaduras.', precio: 145, imagen: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500', nuevo: false },
        { id: 5, nombre: 'Sillón Ejecutivo Titan', descripcion: 'Cuero genuino negro con costuras reforzadas. Elegancia para la oficina moderna.', precio: 890, imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500', nuevo: false },
        { id: 6, nombre: 'Gabinete Seguro Block', descripcion: 'Acero inoxidable, cerradura digital y sistema anti-vuelco.', precio: 210, imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', nuevo: false },
    ]

    const categorias = ['Todos', 'Mobiliario', 'Iluminación', 'Accesorios']
    const [categoriaActiva, setCategoriaActiva] = useState('Todos')

    const addToCart = (producto: Producto) => {
        const existingItem = cartItems.find(item => item.id === producto.id)
        if (existingItem) {
            setCartItems(cartItems.map(item => 
                item.id === producto.id 
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            ))
        } else {
            setCartItems([...cartItems, { ...producto, cantidad: 1 }])
        }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    const impuestos = subtotal * 0.16
    const total = subtotal + impuestos

    return (
        <div className="min-h-screen bg-background-light text-text-main flex flex-col overflow-x-hidden">
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100/95 w-full">
                <div className="px-6 md:px-10 lg:px-16 flex items-center justify-between h-20">
                    <div className="flex items-center gap-4 text-text-main">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <span className="material-symbols-outlined text-2xl">grid_view</span>
                        </div>
                        <h2 className="text-xl font-extrabold tracking-tight">Catálogo</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-bold text-text-main">Alex Morgan</span>
                            <span className="text-xs text-text-secondary">Vendedor Senior</span>
                        </div>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-gray-100 bg-gray-200"></div>
                        <button className="flex items-center justify-center p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors:bg-gray-800">
                            <span className="material-symbols-outlined">logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Layout */}
            <div className="flex flex-col lg:flex-row flex-1 max-w-[1600px] w-full mx-auto">
                {/* Left Column: Product Grid */}
                <main className="flex-1 px-6 md:px-10 lg:px-12 py-8 lg:pr-8">
                    {/* Search & Filters Header */}
                    <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-xl group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                            </div>
                            <input 
                                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-xl text-text-main placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 transition-all shadow-sm font-medium" 
                                placeholder="Buscar por nombre, SKU o categoría..." 
                                type="text"
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            {categorias.map((categoria) => (
                                <button
                                    key={categoria}
                                    onClick={() => setCategoriaActiva(categoria)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                                        categoriaActiva === categoria
                                            ? 'bg-black text-white hover:bg-gray-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200:bg-gray-700'
                                    }`}
                                >
                                    {categoria}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {productos.map((producto) => (
                            <div key={producto.id} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-5 bg-gray-50">
                                    <div 
                                        className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500"
                                        style={{ backgroundImage: `url('${producto.imagen}')` }}
                                    ></div>
                                    {producto.nuevo && (
                                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider text-primary shadow-sm">Nuevo</div>
                                    )}
                                    {producto.descuento && (
                                        <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">{producto.descuento}</div>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-text-main leading-tight group-hover:text-primary transition-colors">{producto.nombre}</h3>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">{producto.descripcion}</p>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            {producto.precioOriginal && (
                                                <span className="text-xs text-gray-400 line-through font-medium">${producto.precioOriginal.toFixed(2)}</span>
                                            )}
                                            <span className={`text-xl font-extrabold ${producto.descuento ? 'text-primary' : 'text-text-main'}`}>${producto.precio.toFixed(2)}</span>
                                        </div>
                                        <button 
                                            onClick={() => addToCart(producto)}
                                            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex justify-center">
                        <button className="text-sm font-bold text-text-secondary hover:text-primary flex items-center gap-2 transition-colors px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50:bg-gray-800">
                            Cargar más productos
                            <span className="material-symbols-outlined text-lg">expand_more</span>
                        </button>
                    </div>
                </main>

                {/* Right Column: Sticky Sidebar (Empty Cart) */}
                <aside className="w-full lg:w-[400px] lg:min-w-[400px] bg-surface[#1a1a1a] border-l border-gray-100 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-hidden flex flex-col shadow-2xl shadow-gray-200/50 z-40">
                    {/* Sidebar Header */}
                    <div className="p-6 pb-4 border-b border-gray-200/60">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-2xl font-black text-text-main tracking-tight">Mi Pedido</h2>
                            <span className="bg-gray-200 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">{cartItems.length} ítems</span>
                        </div>
                        <p className="text-xs text-text-secondary font-medium opacity-0">Orden #---</p>
                    </div>

                    {/* Empty Cart State */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-5xl text-gray-300">shopping_cart_off</span>
                        </div>
                        <h3 className="text-lg font-bold text-text-main mb-2">Tu carrito está vacío</h3>
                        <p className="text-sm text-text-secondary max-w-[240px] leading-relaxed">
                            ¡Aún no tienes productos! Explora el catálogo y agrega artículos para comenzar tu pedido.
                        </p>
                    </div>

                    {/* Footer / Totals (Disabled) */}
                    <div className="bg-white border-t border-gray-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                        <div className="space-y-3 mb-6 opacity-50">
                            <div className="flex justify-between text-sm text-text-secondary">
                                <span>Subtotal</span>
                                <span className="font-medium text-text-main">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-text-secondary">
                                <span>Impuestos (16%)</span>
                                <span className="font-medium text-text-main">${impuestos.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-dashed border-gray-200 my-2"></div>
                            <div className="flex justify-between items-end">
                                <span className="text-base font-bold text-text-main">Total a Pagar</span>
                                <span className="text-2xl font-black text-text-main tracking-tight">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button 
                            className="w-full bg-gray-100 text-gray-400 font-bold text-base py-4 px-6 rounded-xl cursor-not-allowed flex justify-between items-center transition-all" 
                            disabled={cartItems.length === 0}
                        >
                            <span>Confirmar Pedido</span>
                            <span className="p-1 rounded-md">
                                <span className="material-symbols-outlined block text-sm">lock</span>
                            </span>
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-3 font-medium">Agrega al menos un producto para continuar</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}
