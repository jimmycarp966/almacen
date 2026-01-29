import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TipoVenta = 'unidad' | 'peso'

export interface CartItem {
    id: string
    nombre: string
    precio: number
    cantidad: number  // Ahora puede ser decimal (kg para balanza)
    imagen_url: string | null
    tipo_venta?: TipoVenta  // 'unidad' | 'peso'
}

interface CartState {
    items: CartItem[]
    addItem: (product: CartItem) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, cantidad: number) => void
    clearCart: () => void
    getTotal: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const items = get().items
                const existingItem = items.find((i) => i.id === product.id)

                if (existingItem) {
                    // Para productos por peso, sumar cantidades directamente
                    // Para productos por unidad, sumar 1
                    const cantidadASumar = product.tipo_venta === 'peso' ? product.cantidad : 1

                    set({
                        items: items.map((i) =>
                            i.id === product.id
                                ? { ...i, cantidad: i.cantidad + cantidadASumar }
                                : i
                        ),
                    })
                } else {
                    set({ items: [...items, { ...product, cantidad: product.cantidad }] })
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((i) => i.id !== productId) })
            },
            updateQuantity: (productId, cantidad) => {
                if (cantidad <= 0) {
                    get().removeItem(productId)
                    return
                }
                set({
                    items: get().items.map((i) =>
                        i.id === productId ? { ...i, cantidad } : i
                    ),
                })
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
            },
        }),
        {
            name: 'super-aguilares-cart',
        }
    )
)
