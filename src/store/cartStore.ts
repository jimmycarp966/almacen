import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    nombre: string
    precio: number
    cantidad: number
    imagen_url: string | null
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
                    set({
                        items: items.map((i) =>
                            i.id === product.id ? { ...i, cantidad: i.cantidad + 1 } : i
                        ),
                    })
                } else {
                    set({ items: [...items, { ...product, cantidad: 1 }] })
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
