'use client'

import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'
import { FavoriteButton } from './FavoriteButton'

interface ProductCardProps {
    id: string
    nombre: string
    descripcion: string
    precio: number
    imagen_url: string | null
    categoria_id: string
    esNuevo?: boolean
    descuento?: number
    compact?: boolean // Nuevo: modo compacto para imágenes más pequeñas
}

export function ProductCard({ id, nombre, descripcion, precio, imagen_url, categoria_id, esNuevo, descuento, compact = false }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)
    const [isAdding, setIsAdding] = useState(false)

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsAdding(true)
        addItem({ id, nombre, precio, cantidad: 1, imagen_url })
        setTimeout(() => setIsAdding(false), 500)
    }

    // Usar imagen por defecto si no hay imagen_url
    const displayImage = imagen_url && imagen_url.trim() !== ''
        ? imagen_url
        : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'

    return (
        <div className="group cursor-pointer product-card">
            <div
                className={`relative overflow-hidden rounded-2xl bg-accent-gray mb-3 sm:mb-4 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 ${compact ? 'aspect-square' : 'aspect-[4/5]'
                    }`}
                style={{ backgroundImage: `url('${displayImage}')` }}
            >
                {/* Favorite Button */}
                <FavoriteButton
                    productId={id}
                    nombre={nombre}
                    descripcion={descripcion}
                    precio={precio}
                    imagen_url={imagen_url}
                    categoria_id={categoria_id}
                />

                {/* Add Button */}
                <button
                    onClick={handleAdd}
                    className={`add-btn absolute bottom-3 right-3 ${compact ? 'w-10 h-10' : 'w-12 h-12'} rounded-full shadow-xl flex items-center justify-center transition-all duration-300 transform 
            ${isAdding ? 'bg-green-500 text-white scale-110' : 'bg-white text-text-main opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary hover:text-white'}`}
                >
                    <span className={`material-symbols-outlined ${compact ? 'text-lg' : ''}`}>{isAdding ? 'check' : 'add'}</span>
                </button>

                {/* Badges */}
                {esNuevo && (
                    <div className={`absolute top-3 left-3 bg-primary text-white text-[8px] sm:text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-wider`}>
                        Nuevo
                    </div>
                )}
                {descuento && descuento > 0 && (
                    <div className={`absolute ${esNuevo ? 'top-10' : 'top-3'} left-3 bg-black/90 text-white text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider`}>
                        -{descuento}%
                    </div>
                )}
            </div>

            <div className={`flex justify-between items-start gap-2 ${compact ? 'px-1' : ''}`}>
                <div className="min-w-0 flex-1">
                    <h3 className={`${compact ? 'text-sm sm:text-base' : 'text-lg sm:text-xl'} font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1`}>{nombre}</h3>
                    <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-text-secondary mt-0.5 line-clamp-1`}>{descripcion}</p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                    <span className={`${compact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'} font-extrabold text-text-main`}>
                        ${precio.toLocaleString('es-AR')}
                    </span>
                    {descuento && descuento > 0 && (
                        <span className={`${compact ? 'text-xs' : 'text-sm'} font-medium text-text-secondary line-through`}>
                            ${Math.round(precio / (1 - descuento / 100)).toLocaleString('es-AR')}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
