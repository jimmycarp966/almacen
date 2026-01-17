import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoriteItem {
  id: string
  nombre: string
  descripcion: string
  precio: number
  imagen_url: string | null
  categoria_id: string
  addedAt: string
}

export interface ShoppingList {
  id: string
  nombre: string
  items: ShoppingListItem[]
  createdAt: string
  updatedAt: string
}

export interface ShoppingListItem {
  id: string
  producto_id: string
  producto_nombre: string
  producto_precio: number
  imagen_url: string | null
  cantidad: number
  checked: boolean
}

interface FavoritesState {
  favorites: FavoriteItem[]
  shoppingLists: ShoppingList[]
  addFavorite: (product: Omit<FavoriteItem, 'addedAt'>) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  createShoppingList: (nombre: string, items: ShoppingListItem[]) => void
  updateShoppingList: (listId: string, nombre?: string, items?: ShoppingListItem[]) => void
  deleteShoppingList: (listId: string) => void
  addToList: (listId: string, item: ShoppingListItem) => void
  removeFromList: (listId: string, itemId: string) => void
  updateListItemQuantity: (listId: string, itemId: string, cantidad: number) => void
  toggleListItemChecked: (listId: string, itemId: string) => void
  getShoppingList: (listId: string) => ShoppingList | undefined
  addListToCart: (listId: string) => void
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      shoppingLists: [],

      addFavorite: (product) => {
        const favorites = get().favorites
        const existing = favorites.find((f) => f.id === product.id)
        if (!existing) {
          set({
            favorites: [...favorites, { ...product, addedAt: new Date().toISOString() }],
          })
        }
      },

      removeFavorite: (productId) => {
        set({ favorites: get().favorites.filter((f) => f.id !== productId) })
      },

      isFavorite: (productId) => {
        return get().favorites.some((f) => f.id === productId)
      },

      createShoppingList: (nombre, items) => {
        const newList: ShoppingList = {
          id: `list-${Date.now()}`,
          nombre,
          items,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set({ shoppingLists: [...get().shoppingLists, newList] })
      },

      updateShoppingList: (listId, nombre, items) => {
        const lists = get().shoppingLists
        const listIndex = lists.findIndex((l) => l.id === listId)
        if (listIndex !== -1) {
          const updatedList = {
            ...lists[listIndex],
            ...(nombre && { nombre }),
            ...(items && { items }),
            updatedAt: new Date().toISOString(),
          }
          set({
            shoppingLists: lists.map((l, i) => (i === listIndex ? updatedList : l)),
          })
        }
      },

      deleteShoppingList: (listId) => {
        set({ shoppingLists: get().shoppingLists.filter((l) => l.id !== listId) })
      },

      addToList: (listId, item) => {
        const lists = get().shoppingLists
        const listIndex = lists.findIndex((l) => l.id === listId)
        if (listIndex !== -1) {
          const existingItem = lists[listIndex].items.find((i) => i.producto_id === item.producto_id)
          if (existingItem) {
            const updatedItems = lists[listIndex].items.map((i) =>
              i.producto_id === item.producto_id
                ? { ...i, cantidad: i.cantidad + item.cantidad }
                : i
            )
            set({
              shoppingLists: lists.map((l, i) =>
                i === listIndex
                  ? { ...l, items: updatedItems, updatedAt: new Date().toISOString() }
                  : l
              ),
            })
          } else {
            set({
              shoppingLists: lists.map((l, i) =>
                i === listIndex
                  ? {
                      ...l,
                      items: [...l.items, item],
                      updatedAt: new Date().toISOString(),
                    }
                  : l
              ),
            })
          }
        }
      },

      removeFromList: (listId, itemId) => {
        const lists = get().shoppingLists
        const listIndex = lists.findIndex((l) => l.id === listId)
        if (listIndex !== -1) {
          set({
            shoppingLists: lists.map((l, i) =>
              i === listIndex
                ? {
                    ...l,
                    items: l.items.filter((item) => item.id !== itemId),
                    updatedAt: new Date().toISOString(),
                  }
                : l
            ),
          })
        }
      },

      updateListItemQuantity: (listId, itemId, cantidad) => {
        const lists = get().shoppingLists
        const listIndex = lists.findIndex((l) => l.id === listId)
        if (listIndex !== -1) {
          if (cantidad <= 0) {
            get().removeFromList(listId, itemId)
          } else {
            set({
              shoppingLists: lists.map((l, i) =>
                i === listIndex
                  ? {
                      ...l,
                      items: l.items.map((item) =>
                        item.id === itemId ? { ...item, cantidad } : item
                      ),
                      updatedAt: new Date().toISOString(),
                    }
                  : l
              ),
            })
          }
        }
      },

      toggleListItemChecked: (listId, itemId) => {
        const lists = get().shoppingLists
        const listIndex = lists.findIndex((l) => l.id === listId)
        if (listIndex !== -1) {
          set({
            shoppingLists: lists.map((l, i) =>
              i === listIndex
                ? {
                    ...l,
                    items: l.items.map((item) =>
                      item.id === itemId ? { ...item, checked: !item.checked } : item
                    ),
                    updatedAt: new Date().toISOString(),
                  }
                : l
            ),
          })
        }
      },

      getShoppingList: (listId) => {
        return get().shoppingLists.find((l) => l.id === listId)
      },

      addListToCart: (listId) => {
        const list = get().getShoppingList(listId)
        if (list) {
          // Importar useCartStore dinámicamente para evitar dependencia circular
          const { useCartStore } = require('@/store/cartStore')
          const addItem = useCartStore.getState().addItem

          list.items.forEach((item) => {
            for (let i = 0; i < item.cantidad; i++) {
              addItem({
                id: item.producto_id,
                nombre: item.producto_nombre,
                precio: item.producto_precio,
                imagen_url: item.imagen_url,
                cantidad: 1,
              })
            }
          })
        }
      },
    }),
    {
      name: 'super-aguilares-favorites',
    }
  )
)
