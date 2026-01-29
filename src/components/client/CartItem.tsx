'use client'

import { useCartStore, CartItem as CartItemType, TipoVenta } from '@/store/cartStore'

interface CartItemProps {
    item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore()

    const esBalanza = item.tipo_venta === 'peso'

    // Función para formatear cantidad
    const formatCantidad = (cantidad: number, tipo?: TipoVenta): string => {
        if (tipo === 'peso') {
            // Para productos de balanza, mostrar en kg o gramos
            if (cantidad < 1) {
                const grams = Math.round(cantidad * 1000)
                return `${grams}g`
            }
            return `${cantidad.toFixed(2).replace(/\.?0+$/, '')}kg`
        }
        // Para productos por unidad, mostrar entero
        return cantidad.toString()
    }

    const handleDecrease = () => {
        if (esBalanza) {
            // Para balanza, restar 100g (0.1kg)
            const nuevaCantidad = Math.max(0.1, item.cantidad - 0.1)
            updateQuantity(item.id, parseFloat(nuevaCantidad.toFixed(3)))
        } else {
            updateQuantity(item.id, item.cantidad - 1)
        }
    }

    const handleIncrease = () => {
        if (esBalanza) {
            // Para balanza, sumar 100g (0.1kg)
            const nuevaCantidad = item.cantidad + 0.1
            updateQuantity(item.id, parseFloat(nuevaCantidad.toFixed(3)))
        } else {
            updateQuantity(item.id, item.cantidad + 1)
        }
    }

    return (
        <div className="flex gap-4 group animate-fade-in-up">
            <div className="size-20 min-w-20 bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url('${item.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')` }}
                ></div>
            </div>
            <div className="flex flex-col flex-1 justify-between py-1">
                <div>
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-text-main leading-tight group-hover:text-primary transition-colors">
                                {item.nombre}
                            </h4>
                            {esBalanza && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                                    Balanza
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                        Precio unitario: ${item.precio.toLocaleString('es-AR')}{esBalanza ? '/kg' : ''}
                    </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white h-8">
                        <button
                            onClick={handleDecrease}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-l-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xs">remove</span>
                        </button>
                        <span className="text-xs font-bold px-2 min-w-[40px] text-center">
                            {formatCantidad(item.cantidad, item.tipo_venta)}
                        </span>
                        <button
                            onClick={handleIncrease}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-r-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xs">add</span>
                        </button>
                    </div>
                    <span className="font-bold text-sm text-text-main">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                </div>
            </div>
        </div>
    )
}
