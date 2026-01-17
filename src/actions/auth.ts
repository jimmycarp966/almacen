'use server'

import { supabase } from '@/lib/supabase'
import { mockUsuarios } from '@/lib/mockData'
import { z } from 'zod'

const loginSchema = z.object({
    telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
    nombre: z.string().optional(),
})

export async function identificarUsuario(formData: FormData) {
    const telefono = formData.get('telefono') as string
    const nombre = formData.get('nombre') as string | null

    // Validar con Zod
    const validation = loginSchema.safeParse({ telefono, nombre: nombre || undefined })
    if (!validation.success) {
        return { success: false, message: validation.error.issues[0].message }
    }

    try {
        // Primero buscar en usuarios mock (para pruebas locales)
        const mockUser = mockUsuarios.find(u => u.telefono === telefono)
        if (mockUser) {
            return { success: true, user: mockUser }
        }

        // 1. Buscar si el usuario existe en Supabase
        const { data: user, error: fetchError } = await supabase
            .from('usuarios')
            .select('*')
            .eq('telefono', telefono)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error buscando usuario:', fetchError)
            return { success: false, message: 'Error en el servidor al buscar usuario' }
        }

        if (user) {
            // Usuario existe, devolver datos
            return { success: true, user }
        } else {
            // 2. Si no existe y tenemos nombre, crearlo
            if (nombre) {
                const { data: newUser, error: insertError } = await supabase
                    .from('usuarios')
                    .insert([{ nombre, telefono, rol: 'cliente' }])
                    .select()
                    .single()

                if (insertError) {
                    console.error('Error creando usuario:', insertError)
                    return { success: false, message: 'Error al crear el usuario' }
                }

                return { success: true, user: newUser }
            } else {
                // Necesitamos pedir el nombre
                return { success: true, needsName: true }
            }
        }
    } catch (err) {
        console.error('Error inesperado en auth action:', err)
        return { success: false, message: 'Error inesperado en el servidor' }
    }
}
