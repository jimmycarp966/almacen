'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CatalogoCarritoFlotantePage() {
    const [cartCount, setCartCount] = useState(2)
    const [cartTotal, setCartTotal] = useState(1070)

    const productos = [
        { id: 1, nombre: 'Silla Lounge Eames', descripcion: 'Madera de Nogal & Piel', precio: 850, imagen: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500', nuevo: true },
        { id: 2, nombre: 'Lámpara Halo', descripcion: 'Metal Negro Mate', precio: 220, imagen: 'https://images.unsplash.com/photo-1513506003011-3b03c8013682?w=500', nuevo: false },
        { id: 3, nombre: 'Sofá Modular Cloud', descripcion: 'Tejido Premium Gris', precio: 1299, imagen: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', nuevo: false },
        { id: 4, nombre: 'Mesa de Centro Oaki', descripcion: 'Roble Natural', precio: 450, imagen: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=500', nuevo: false },
        { id: 5, nombre: 'Macetero Cerámico', descripcion: 'Blanco Mate', precio: 48, precioOriginal: 60, imagen: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', nuevo: false, descuento: '-20%' },
        { id: 6, nombre: 'Escritorio Studio', descripcion: 'Fresno y Metal', precio: 599, imagen: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500', nuevo: false },
        { id: 7, nombre: 'Estantería Axis', descripcion: 'Diseño Modular', precio: 340, imagen: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=500', nuevo: false },
        { id: 8, nombre: 'Cuadro Abstracto V', descripcion: 'Impresión Giclée', precio: 120, imagen: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500', nuevo: false },
    ]

    const categorias = [
        'Todos los Productos',
        'Nuevos Lanzamientos',
        'Sofás & Sillones',
        'Mesas',
        'Iluminación',
        'Accesorios',
        'Exterior',
    ]

    const [categoriaActiva, setCategoriaActiva] = useState('Todos los Productos')

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

    const addToCart = (producto: Producto) => {
        setCartCount(prev => prev + 1)
        setCartTotal(prev => prev + producto.precio)
    }

    return (
        <div className="min-h-screen bg-background-light font-display text-text-main antialiased selection:bg-primary/20 selection:text-primary">
            {/* Navbar */}
            <nav className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group">
                            <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-lg group-hover:bg-primary transition-colors duration-300">
                                <span className="material-symbols-outlined text-2xl">chair</span>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-text-main">MOBI</h1>
                        </Link>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-10">
                            <Link href="/" className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors">Inicio</Link>
                            <Link href="#" className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors">Colecciones</Link>
                            <Link href="#" className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors">Diseñadores</Link>
                            <Link href="#" className="text-text-main hover:text-primary font-bold text-sm uppercase tracking-wide transition-colors">Blog</Link>
                        </div>
                        {/* Utilities */}
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-text-main">
                                <span className="material-symbols-outlined">search</span>
                            </button>
                            <button className="p-2.5 rounded-full hover:bg-gray-100 transition-colors text-text-main">
                                <span className="material-symbols-outlined">person</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Categories Tabs */}
            <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_2px_15px_-10px_rgba(0,0,0,0.05)]">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8 overflow-x-auto hide-scrollbar py-4">
                        {categorias.map((categoria) => (
                            <button
                                key={categoria}
                                onClick={() => setCategoriaActiva(categoria)}
                                className={`whitespace-nowrap pb-1 border-b-[3px] font-medium text-sm tracking-wide transition-colors ${
                                    categoriaActiva === categoria
                                        ? 'border-primary text-primary font-bold'
                                        : 'border-transparent text-text-secondary hover:text-text-main'
                                }`}
                            >
                                {categoria}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-text-main mb-2">Catálogo 2024</h2>
                        <p className="text-text-secondary text-lg">Diseño minimalista para espacios modernos.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-text-main">
                            <span className="material-symbols-outlined text-[20px]">tune</span>
                            Filtrar
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-bold text-text-main">
                            <span className="material-symbols-outlined text-[20px]">sort</span>
                            Ordenar
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                    {productos.map((producto) => (
                        <div key={producto.id} className="group cursor-pointer product-card">
                            <div className="relative overflow-hidden rounded-2xl bg-accent-gray aspect-[4/5] mb-5">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    style={{ backgroundImage: `url('${producto.imagen}')` }}
                                ></div>
                                {/* Add Button */}
                                <button
                                    onClick={() => addToCart(producto)}
                                    className="add-btn absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-text-main opacity-0 translate-y-4 transition-all duration-300 hover:bg-primary hover:text-white group-hover:opacity-100 group-hover:translate-y-0"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                {/* Badge */}
                                {producto.nuevo && (
                                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full tracking-wider">Nuevo</div>
                                )}
                                {producto.descuento && (
                                    <div className="absolute top-4 left-4 bg-black/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">{producto.descuento}</div>
                                )}
                            </div>
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors">{producto.nombre}</h3>
                                    <p className="text-sm font-medium text-text-secondary mt-1">{producto.descripcion}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-extrabold text-text-main">${producto.precio}</span>
                                    {producto.precioOriginal && (
                                        <span className="text-sm font-medium text-text-secondary line-through">${producto.precioOriginal}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Meta Text */}
                <div className="mt-20 flex justify-center pb-32">
                    <p className="text-text-secondary text-base font-medium">Mostrando 8 de 45 productos exclusivos</p>
                </div>
            </main>

            {/* Floating Action Button (FAB) */}
            <div className="fixed bottom-10 right-10 z-50 group">
                <button className="relative w-[72px] h-[72px] bg-primary text-white rounded-full shadow-[0_8px_30px_rgb(230,0,0,0.3)] flex items-center justify-center hover:scale-110 hover:shadow-[0_8px_35px_rgb(230,0,0,0.4)] transition-all duration-300 cursor-pointer outline-none ring-0">
                    <span className="material-symbols-outlined text-[32px]">shopping_cart</span>
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 h-7 w-7 bg-white text-primary text-sm font-extrabold flex items-center justify-center rounded-full border-2 border-primary shadow-sm">{cartCount}</span>
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 w-max px-4 py-2 bg-black text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none shadow-lg">
                    Ver Carrito (${cartTotal.toLocaleString('es-AR')})
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                </div>
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .product-card:hover .add-btn {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    )
}
