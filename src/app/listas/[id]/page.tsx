'use client'

import { useFavoritesStore } from '@/store/favoritesStore'
import { Navbar } from '@/components/layout/Navbar'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function ListaDetallePage() {
  const router = useRouter()
  const params = useParams()
  const listId = params.id as string
  const { getShoppingList, updateShoppingList, deleteShoppingList, addListToCart } = useFavoritesStore()
  const [mounted, setMounted] = useState(false)
  const [listName, setListName] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setMounted(true)
    const list = getShoppingList(listId)
    if (list) {
      setListName(list.nombre)
    }
  }, [listId, getShoppingList])

  const list = getShoppingList(listId)

  if (!mounted) return null

  if (!list) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background-light pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center py-20">
            <span className="material-symbols-outlined text-8xl text-gray-200 mb-6">error</span>
            <h1 className="text-3xl font-bold text-text-main mb-3">Lista no encontrada</h1>
            <p className="text-text-secondary mb-8">La lista que buscas no existe o fue eliminada</p>
            <Link
              href="/listas"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Volver a Mis Listas
            </Link>
          </div>
        </div>
      </>
    )
  }

  const total = list.items.reduce((acc, item) => acc + item.producto_precio * item.cantidad, 0)
  const checkedCount = list.items.filter((item) => item.checked).length

  const handleUpdateListName = () => {
    if (listName.trim()) {
      updateShoppingList(list.id, listName.trim())
      setIsEditing(false)
    }
  }

  const handleDeleteList = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      deleteShoppingList(list.id)
      router.push('/listas')
    }
  }

  const handleAddToCart = () => {
    addListToCart(list.id)
    router.push('/carrito')
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-light pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/listas"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <h1 className="text-3xl font-bold text-text-main">Detalle de Lista</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        onKeyPress={(e) => e.key === 'Enter' && handleUpdateListName()}
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateListName}
                        className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined">check</span>
                      </button>
                      <button
                        onClick={() => {
                          setListName(list.nombre)
                          setIsEditing(false)
                        }}
                        className="px-4 py-2 bg-background-light text-text-main rounded-xl hover:bg-gray-200 transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-text-main">{list.nombre}</h2>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-primary transition-colors"
                        aria-label="Editar nombre"
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                    <span>
                      {list.items.length} {list.items.length === 1 ? 'producto' : 'productos'}
                    </span>
                    <span>•</span>
                    <span>
                      {checkedCount} de {list.items.length} marcados
                    </span>
                    <span>•</span>
                    <span>
                      Actualizada: {format(new Date(list.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleDeleteList}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Eliminar lista"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {list.items.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">shopping_basket</span>
                  <p className="text-text-secondary font-medium">Esta lista está vacía</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Agrega productos desde el catálogo
                  </p>
                </div>
              ) : (
                list.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-background-light transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          const updatedItems = list.items.map((i) =>
                            i.id === item.id ? { ...i, checked: !i.checked } : i
                          )
                          updateShoppingList(list.id, undefined, updatedItems)
                        }}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          item.checked
                            ? 'bg-primary border-primary text-white'
                            : 'border-gray-300 hover:border-primary'
                        }`}
                        aria-label={item.checked ? 'Desmarcar' : 'Marcar'}
                      >
                        {item.checked && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                      </button>

                      <div
                        className="w-12 h-12 bg-gray-200 rounded-lg bg-cover bg-center flex-shrink-0"
                        style={{
                          backgroundImage: `url('${item.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')`,
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-main truncate">{item.producto_nombre}</p>
                        <p className="text-sm text-text-secondary">
                          Cantidad: {item.cantidad}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-text-main">
                          ${(item.producto_precio * item.cantidad).toLocaleString('es-AR')}
                        </p>
                        <p className="text-sm text-text-secondary">
                          ${item.producto_precio.toLocaleString('es-AR')} c/u
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          const updatedItems = list.items.filter((i) => i.id !== item.id)
                          updateShoppingList(list.id, undefined, updatedItems)
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Eliminar producto"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {list.items.length > 0 && (
              <div className="p-6 bg-background-light border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-text-main">Total</span>
                  <span className="text-2xl font-bold text-text-main">
                    ${total.toLocaleString('es-AR')}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Agregar Todo al Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
