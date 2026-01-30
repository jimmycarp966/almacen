'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

// Categorías
export async function createCategoria(nombre: string) {
    const { data, error } = await supabase
        .from('categorias')
        .insert([{ nombre }])
        .select()

    if (!error) revalidatePath('/admin/categorias')
    return { data, error }
}

export async function updateCategoria(id: string, updates: any) {
    const { data, error } = await supabase
        .from('categorias')
        .update(updates)
        .eq('id', id)

    if (!error) revalidatePath('/admin/categorias')
    return { data, error }
}

// Productos
export async function createProducto(producto: any) {
    console.log('[DEBUG createProducto] Producto a crear:', JSON.stringify(producto))

    const { data, error } = await supabase
        .from('productos')
        .insert([producto])
        .select()

    console.log('[DEBUG createProducto] Resultado data:', JSON.stringify(data))
    console.log('[DEBUG createProducto] Resultado error:', JSON.stringify(error))

    if (!error) {
        console.log('[DEBUG createProducto] Revalidando /admin/productos')
        revalidatePath('/admin/productos')
    }
    return { data, error }
}

export async function updateProducto(id: string, updates: any) {
    const { data, error } = await supabase
        .from('productos')
        .update(updates)
        .eq('id', id)

    if (!error) revalidatePath('/admin/productos')
    return { data, error }
}

export async function deleteProducto(id: string) {
    // Soft delete
    const { error } = await supabase
        .from('productos')
        .update({ activo: false })
        .eq('id', id)

    if (!error) revalidatePath('/admin/productos')
    return { error }
}
