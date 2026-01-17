'use client'

import { useCartStore, CartItem as CartItemType } from '@/store/cartStore'

interface CartItemProps {
    item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeItem } = useCartStore()

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
                        <h4 className="font-bold text-sm text-text-main leading-tight group-hover:text-primary transition-colors">
                            {item.nombre}
                        </h4>
                        <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">Precio unitario: ${item.precio.toLocaleString('es-AR')}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-md bg-white h-8">
                        <button
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-l-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xs">remove</span>
                        </button>
                        <span className="text-xs font-bold px-2 min-w-[24px] text-center">{item.cantidad}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-gray-50 rounded-r-md transition-colors"
                        >
                            <span className="material-symbols-outlined text-xs">add</span>
                        </button>
                    </div>
                    <span className="font-bold text-sm text-text-main">
                        ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                    </span>
                </div>
            </div>
        </div>
    )
}
