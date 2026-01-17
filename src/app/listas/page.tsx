'use client'

import { useFavoritesStore } from '@/store/favoritesStore'
import { Navbar } from '@/components/layout/Navbar'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

export default function ListasPage() {
  const { shoppingLists, createShoppingList, deleteShoppingList, addListToCart } = useFavoritesStore()
  const [mounted, setMounted] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newListName, setNewListName] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateList = () => {
    if (newListName.trim()) {
      createShoppingList(newListName.trim(), [])
      setNewListName('')
      setShowCreateModal(false)
    }
  }

  if (!mounted) return null

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-light pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-main mb-2">Mis Listas de Compras</h1>
              <p className="text-text-secondary">
                {shoppingLists.length} {shoppingLists.length === 1 ? 'lista' : 'listas'} guardadas
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Nueva Lista
            </button>
          </div>

          {shoppingLists.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-8xl text-gray-200 mb-6">playlist_add</span>
              <h2 className="text-2xl font-bold text-text-main mb-3">No tienes listas de compras</h2>
              <p className="text-text-secondary mb-8">
                Crea listas de compras para organizar tus compras recurrentes
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">add</span>
                Crear Primera Lista
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shoppingLists.map((list) => (
                <div
                  key={list.id}
                  className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-text-main mb-1">{list.nombre}</h3>
                        <p className="text-sm text-text-secondary">
                          {list.items.length} {list.items.length === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteShoppingList(list.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Eliminar lista"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      <span>
                        Actualizada: {format(new Date(list.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}
                      </span>
                    </div>

                    <div className="space-y-2 mb-6">
                      {list.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 bg-background-light rounded-lg"
                        >
                          <div
                            className="w-8 h-8 bg-gray-200 rounded bg-cover bg-center flex-shrink-0"
                            style={{
                              backgroundImage: `url('${item.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}')`,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-main truncate">
                              {item.producto_nombre}
                            </p>
                            <p className="text-xs text-text-secondary">Cantidad: {item.cantidad}</p>
                          </div>
                          <span className="text-sm font-bold text-text-main">
                            ${(item.producto_precio * item.cantidad).toLocaleString('es-AR')}
                          </span>
                        </div>
                      ))}
                      {list.items.length > 3 && (
                        <p className="text-sm text-text-secondary text-center">
                          +{list.items.length - 3} productos más
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/listas/${list.id}`}
                        className="flex-1 flex items-center justify-center gap-2 bg-background-light text-text-main px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Editar
                      </Link>
                      <button
                        onClick={() => addListToCart(list.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        Agregar al Carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create List Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-text-main mb-4">Crear Nueva Lista</h2>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nombre de la lista"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCreateList()}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewListName('')
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-bold border border-gray-300 text-text-main hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                  className="flex-1 px-6 py-3 rounded-xl font-bold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
