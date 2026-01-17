'use server'

import { mockCategorias, mockProductos } from '@/lib/mockData'

export async function getCategorias() {
    // Usar datos mock en lugar de Supabase
    return mockCategorias
}

export async function getProductos(categoriaId?: string) {
    let productos = mockProductos

    if (categoriaId && categoriaId !== 'todos') {
        productos = productos.filter(p => p.categoria_id === categoriaId)
    }

    return productos
}
