'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GestionInventarioAdmin1Page() {
    const [cartItems, setCartItems] = useState([
        { id: 1, nombre: 'Zapatillas Deportivas', precio: 89.99, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' },
        { id: 2, nombre: 'Auriculares Bluetooth', precio: 120, cantidad: 2, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    ])

    const productos = [
        { id: 1, nombre: 'Camiseta Básica Negra', categoria: 'Ropa', precio: 25, imagen: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', nuevo: true },
        { id: 2, nombre: 'Zapatillas Deportivas', categoria: 'Calzado', precio: 89.99, imagen: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', nuevo: false },
        { id: 3, nombre: 'Pantalón Jeans Slim', categoria: 'Ropa', precio: 45.50, imagen: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=500', nuevo: false },
        { id: 4, nombre: 'Auriculares Bluetooth', categoria: 'Electrónica', precio: 120, imagen: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', nuevo: false, pocos: true },
        { id: 5, nombre: 'Reloj Inteligente V2', categoria: 'Electrónica', precio: 150, imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', nuevo: false },
    ]

    const categorias = [
        { nombre: 'Todos', icono: 'grid_view' },
        { nombre: 'Ropa', icono: 'checkroom' },
        { nombre: 'Calzado', icono: 'do_not_step' },
        { nombre: 'Tech', icono: 'headphones' },
    ]

    const [categoriaActiva, setCategoriaActiva] = useState('Todos')

    const addToCart = (producto: any) => {
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

    const removeFromCart = (id: number) => {
        setCartItems(cartItems.filter(item => item.id !== id))
    }

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newCantidad = Math.max(1, item.cantidad + delta)
                return { ...item, cantidad: newCantidad }
            }
            return item
        }))
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    const impuestos = subtotal * 0.08
    const total = subtotal + impuestos

    return (
        <div className="min-h-screen bg-background-light text-text-black font-display antialiased h-screen flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-8 z-30 shrink-0 shadow-sm relative">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-black leading-none">SHOP<span className="text-primary">RED</span></h1>
                        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">Catálogo Online</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative group">
                    <span className="absolute left-4 text-gray-400 group-focus-within:text-primary transition-colors material-symbols-outlined">search</span>
                    <input className="w-full bg-gray-50 border-gray-100 rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-gray-400 text-black" placeholder="¿Qué estás buscando hoy?" type="text"/>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600 hover:text-black">
                        <span className="material-symbols-outlined">favorite_border</span>
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-1"></div>
                    <div className="flex items-center gap-3">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 ring-2 ring-gray-100 bg-gray-200"></div>
                        <div className="hidden lg:block text-right leading-tight">
                            <p className="text-xs font-bold text-black">Hola, Cliente</p>
                            <p className="text-[10px] text-gray-400">Mi Cuenta</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-hide bg-white">
                    {/* Categories */}
                    <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                        {categorias.map((cat) => (
                            <button 
                                key={cat.nombre}
                                onClick={() => setCategoriaActiva(cat.nombre)}
                                className={`flex flex-col items-center gap-2 min-w-[70px] group ${categoriaActiva === cat.nombre ? '' : 'opacity-60 hover:opacity-100'} transition-all`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:-translate-y-1 ${
                                    categoriaActiva === cat.nombre 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                        : 'bg-gray-50 text-gray-600 group-hover:bg-red-50 group-hover:text-primary border-gray-100'
                                }`}>
                                    <span className="material-symbols-outlined text-2xl">{cat.icono}</span>
                                </div>
                                <span className={`text-xs ${categoriaActiva === cat.nombre ? 'font-bold text-primary' : 'font-medium text-gray-600 group-hover:text-primary'}`}>{cat.nombre}</span>
                            </button>
                        ))}
                    </div>

                    {/* Section Header */}
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-black">Tendencias</h2>
                            <p className="text-gray-400 text-sm mt-1">Nuevos productos agregados hoy</p>
                        </div>
                        <div className="flex gap-2 text-sm">
                            <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">Más Populares</button>
                            <button className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-colors">Precio: Menor a Mayor</button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {productos.map((producto) => (
                            <div key={producto.id} className={`group bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col overflow-hidden relative ${
                                cartItems.some(item => item.id === producto.id) 
                                    ? 'border-primary/20 shadow-md shadow-primary/5 ring-1 ring-primary/20' 
                                    : 'border-gray-100'
                            }`}>
                                {producto.nuevo && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Nuevo</span>
                                    </div>
                                )}
                                {producto.pocos && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">local_fire_department</span> Pocos
                                        </span>
                                    </div>
                                )}
                                <div className="relative h-64 overflow-hidden bg-gray-50 p-4">
                                    <img 
                                        alt={producto.nombre} 
                                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
                                        src={producto.imagen}
                                    />
                                    <button className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-primary hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 duration-300">
                                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                                    </button>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-1">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">{producto.categoria}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-black leading-tight mb-2 group-hover:text-primary transition-colors">{producto.nombre}</h3>
                                    <div className="mt-auto flex items-end justify-between">
                                        <div>
                                            <span className={`text-2xl font-bold ${cartItems.some(item => item.id === producto.id) ? 'text-primary' : 'text-black'}`}>${producto.precio.toFixed(2)}</span>
                                        </div>
                                        {cartItems.some(item => item.id === producto.id) ? (
                                            <div className="flex items-center gap-2 bg-red-50 rounded-xl p-1 border border-primary/10">
                                                <button 
                                                    onClick={() => updateQuantity(producto.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white hover:shadow-sm rounded-lg transition-all text-lg font-medium"
                                                >-</button>
                                                <span className="font-bold text-primary text-sm w-4 text-center">{cartItems.find(item => item.id === producto.id)?.cantidad || 1}</span>
                                                <button 
                                                    onClick={() => updateQuantity(producto.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white hover:shadow-sm rounded-lg transition-all text-lg font-medium"
                                                >+</button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => addToCart(producto)}
                                                className="bg-primary hover:bg-primary-dark text-white w-10 h-10 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center transition-transform active:scale-95"
                                            >
                                                <span className="material-symbols-outlined">add_shopping_cart</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex items-center justify-center gap-2">
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-black text-white font-bold">1</button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium">2</button>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 font-medium">3</button>
                        <span className="text-gray-300">...</span>
                        <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </main>

                {/* Sidebar Cart */}
                <aside className="w-[400px] bg-white border-l border-gray-100 flex flex-col z-20 shadow-2xl hidden xl:flex">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-black flex items-center gap-3">
                            Tu Pedido
                        </h2>
                        <div className="bg-red-50 text-primary font-bold px-3 py-1 rounded-full text-sm border border-red-100">
                            {cartItems.length} Artículos
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-gray-50/50 border border-transparent hover:border-gray-200 transition-colors group">
                                <div className="w-20 h-20 rounded-xl bg-white border border-gray-100 overflow-hidden flex-shrink-0 p-2">
                                    <img className="w-full h-full object-contain mix-blend-multiply" src={item.imagen} alt={item.nombre}/>
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="font-bold text-sm text-black leading-tight">{item.nombre}</h4>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-6 h-6 rounded bg-white text-gray-400 hover:text-primary border border-gray-200 flex items-center justify-center text-xs transition-colors"
                                            >-</button>
                                            <span className="text-sm font-bold text-black">{item.cantidad}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-6 h-6 rounded bg-white text-gray-400 hover:text-primary border border-gray-200 flex items-center justify-center text-xs transition-colors"
                                            >+</button>
                                        </div>
                                        <span className="font-bold text-black text-sm">${(item.precio * item.cantidad).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-medium text-black">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Impuestos (8%)</span>
                                <span className="font-medium text-black">${impuestos.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-extrabold text-black pt-4 border-t border-gray-100 mt-4">
                                <span>Total</span>
                                <span className="text-primary">${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]">
                            <span>Confirmar Pedido</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">lock</span>
                            Pago 100% Seguro
                        </p>
                    </div>
                </aside>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
