'use client'

import { useFavoritesStore } from '@/store/favoritesStore'
import { useState } from 'react'

interface FavoriteButtonProps {
  productId: string
  nombre: string
  descripcion: string
  precio: number
  imagen_url: string | null
  categoria_id: string
}

export function FavoriteButton({
  productId,
  nombre,
  descripcion,
  precio,
  imagen_url,
  categoria_id,
}: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore()
  const [isAnimating, setIsAnimating] = useState(false)

  const isFav = isFavorite(productId)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAnimating(true)

    if (isFav) {
      removeFavorite(productId)
    } else {
      addFavorite({
        id: productId,
        nombre,
        descripcion,
        precio,
        imagen_url,
        categoria_id,
      })
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <button
      onClick={toggleFavorite}
      className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
        isAnimating ? 'scale-125' : ''
      }`}
      aria-label={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <span
        className={`material-symbols-outlined text-xl transition-colors duration-300 ${
          isFav ? 'text-red-500' : 'text-gray-400'
        }`}
      >
        {isFav ? 'favorite' : 'favorite_border'}
      </span>
    </button>
  )
}
