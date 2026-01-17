'use client'

import { useFavoritesStore } from '@/store/favoritesStore'
import { Navbar } from '@/components/layout/Navbar'
import { useState, useEffect } from 'react'
import { OptimizedImage } from '@/components/client/OptimizedImage'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'

export default function FavoritosPage() {
  const { favorites, removeFavorite, isFavorite } = useFavoritesStore()
  const { addItem } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  if (favorites.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background-light pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-8xl text-gray-200 mb-6">favorite_border</span>
              <h1 className="text-3xl font-bold text-text-main mb-3">No tienes favoritos</h1>
              <p className="text-text-secondary mb-8">
                Guarda tus productos favoritos para encontrarlos fácilmente
              </p>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined">shopping_bag</span>
                Ir al Catálogo
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background-light pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-main mb-2">Mis Favoritos</h1>
            <p className="text-text-secondary">
              {favorites.length} {favorites.length === 1 ? 'producto' : 'productos'} guardados
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-soft hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="relative aspect-[4/5] bg-gray-100">
                  <OptimizedImage
                    src={product.imagen_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                    alt={product.nombre}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />

                  <button
                    onClick={() => removeFavorite(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                    aria-label="Quitar de favoritos"
                  >
                    <span className="material-symbols-outlined text-red-500 text-xl">favorite</span>
                  </button>

                  <button
                    onClick={() => addItem({ id: product.id, nombre: product.nombre, precio: product.precio, cantidad: 1, imagen_url: product.imagen_url })}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    aria-label="Agregar al carrito"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                  </button>
                </div>

                <div className="p-4">
                  <Link href={`/catalogo?producto=${product.id}`} className="block">
                    <h3 className="text-lg font-bold text-text-main mb-1 hover:text-primary transition-colors line-clamp-1">
                      {product.nombre}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{product.descripcion}</p>
                    <p className="text-xl font-bold text-text-main">
                      ${product.precio.toLocaleString('es-AR')}
                    </p>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
