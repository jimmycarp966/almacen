'use client'

import { useState } from 'react'

export default function CatalogoCarritoLateral2Page() {
    const [cartItems, setCartItems] = useState([
        { id: 1, nombre: 'Silla Ergonómica Z-40', descripcion: 'Negro / Malla', precio: 320, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200' },
        { id: 2, nombre: 'Lámpara Nórdica', descripcion: 'Roble / LED', precio: 85.50, cantidad: 2, imagen: 'https://images.unsplash.com/photo-1513506003011-3b03c8013682?w=200' },
        { id: 3, nombre: 'Escritorio Elevable Pro', descripcion: 'Blanco / Motorizado', precio: 552.50, cantidad: 1, imagen: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200' },
    ])

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

    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

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

    const openProductModal = (producto: Producto) => {
        setSelectedProduct(producto)
        setModalOpen(true)
    }

    const closeProductModal = () => {
        setModalOpen(false)
        setSelectedProduct(null)
    }

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
        closeProductModal()
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
    const impuestos = subtotal * 0.16
    const total = subtotal + impuestos

    return (
        <div className="min-h-screen bg-background-light text-text-main flex flex-col overflow-x-hidden relative">
            {/* Product Detail Modal */}
            {modalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeProductModal}></div>
                    <div className="relative bg-white w-full max-w-6xl h-auto max-h-[90vh] md:h-auto md:max-h-[800px] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up">
                        <button 
                            onClick={closeProductModal}
                            className="absolute top-5 right-5 z-20 p-2 bg-white/90/50 rounded-full text-gray-400 hover:text-primary hover:bg-gray-100:bg-gray-800 transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined text-2xl font-bold">close</span>
                        </button>
                        <div className="w-full md:w-1/2 bg-gray-50 relative group min-h-[300px] md:min-h-full">
                            <div 
                                className="w-full h-full absolute inset-0 bg-center bg-cover transition-transform duration-700 hover:scale-105"
                                style={{ backgroundImage: `url('${selectedProduct.imagen}')` }}
                            ></div>
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm ring-2 ring-white"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-white/50 backdrop-blur hover:bg-white cursor-pointer transition-colors"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-white/50 backdrop-blur hover:bg-white cursor-pointer transition-colors"></div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-14 flex flex-col overflow-y-auto bg-white[#151515]">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                                <span>Mobiliario</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span>Oficina</span>
                                <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                                <span className="text-primary">Sillas</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-4 leading-tight">{selectedProduct.nombre}</h1>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex text-yellow-500">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`material-symbols-outlined fill-current text-[20px] ${i === 4 ? 'text-gray-200' : ''}`}>star</span>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-semibold border-l border-gray-200 pl-3">4.8 (124 reviews)</span>
                            </div>
                            <div className="flex items-end gap-3 mb-8">
                                <span className="text-5xl font-black text-primary tracking-tight">${selectedProduct.precio.toFixed(2)}</span>
                                {selectedProduct.precioOriginal && (
                                    <>
                                        <span className="text-xl text-gray-400 font-medium line-through mb-2">${selectedProduct.precioOriginal.toFixed(2)}</span>
                                        <span className="mb-2 px-2 py-1 bg-red-50 text-primary text-xs font-bold uppercase rounded ml-2">Oferta</span>
                                    </>
                                )}
                            </div>
                            <div className="prose prose-lg text-text-secondary mb-8 leading-relaxed">
                                <p>{selectedProduct.descripcion}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="bg-surface p-4 rounded-xl border border-gray-100">
                                    <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Material</span>
                                    <span className="font-bold text-text-main">Premium</span>
                                </div>
                                <div className="bg-surface p-4 rounded-xl border border-gray-100">
                                    <span className="block text-xs text-gray-400 font-bold uppercase mb-1">Garantía</span>
                                    <span className="font-bold text-text-main">5 Años</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-6 border-t border-gray-100">
                                <button 
                                    onClick={() => addToCart(selectedProduct)}
                                    className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg h-16 rounded-xl shadow-xl shadow-primary/30 hover:shadow-primary/40 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Navigation */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100/95 w-full">
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
                            <div key={producto.id} className="group bg-white rounded-2xl p-4 border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer" onClick={() => openProductModal(producto)}>
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
                                            onClick={(e) => { e.stopPropagation(); addToCart(producto); }}
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

                {/* Right Column: Sticky Sidebar */}
                <aside className="w-full lg:w-[400px] lg:min-w-[400px] bg-surface[#1a1a1a] border-l border-gray-100 lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 overflow-hidden flex flex-col shadow-2xl shadow-gray-200/50 z-30">
                    {/* Sidebar Header */}
                    <div className="p-6 pb-4 border-b border-gray-200/60">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-2xl font-black text-text-main tracking-tight">Mi Pedido</h2>
                            <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-full">{cartItems.length} ítems</span>
                        </div>
                        <p className="text-xs text-text-secondary font-medium">Orden #ORD-2024-884</p>
                    </div>

                    {/* Cart Items (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="size-20 min-w-20 bg-white rounded-lg border border-gray-100 overflow-hidden">
                                    <div 
                                        className="w-full h-full bg-center bg-cover"
                                        style={{ backgroundImage: `url('${item.imagen}')` }}
                                    ></div>
                                </div>
                                <div className="flex flex-col flex-1 justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-sm text-text-main leading-tight">{item.nombre}</h4>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">close</span>
                                            </button>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">{item.descripcion}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center border border-gray-200 rounded-md bg-white h-8">
                                            <button 
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50:bg-gray-700 rounded-l-md transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xs">remove</span>
                                            </button>
                                            <span className="text-xs font-bold px-2 min-w-[20px] text-center">{item.cantidad}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50:bg-gray-700 rounded-r-md transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-xs">add</span>
                                            </button>
                                        </div>
                                        <span className="font-bold text-sm">${(item.precio * item.cantidad).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Totals */}
                    <div className="bg-white border-t border-gray-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                        <div className="space-y-3 mb-6">
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
                        <button className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-base py-4 px-6 rounded-xl shadow-lg shadow-primary/30 transition-all hover:translate-y-[-2px] active:translate-y-[0px] flex justify-between items-center group">
                            <span>Confirmar Pedido</span>
                            <span className="bg-white/20 p-1 rounded-md group-hover:bg-white/30 transition-colors">
                                <span className="material-symbols-outlined block text-sm">arrow_forward</span>
                            </span>
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    )
}
