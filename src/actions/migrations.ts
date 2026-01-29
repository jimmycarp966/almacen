'use server'

import { supabase } from '@/lib/supabase'

/**
 * Acción para ejecutar las migraciones pendientes
 * Esta función crea la categoría Balanza
 */
export async function ejecutarMigraciones() {
  const resultados = {
    balanzaCreada: false,
    errores: [] as string[]
  }

  try {
    // ============================================================
    // 1. Crear categoría Balanza si no existe
    // ============================================================
    const { data: categoriaExistente, error: errorConsulta } = await supabase
      .from('categorias')
      .select('id, nombre')
      .ilike('nombre', '%balanza%')
      .maybeSingle()

    if (errorConsulta) {
      resultados.errores.push(`Error consultando categoría: ${errorConsulta.message}`)
    } else if (!categoriaExistente) {
      // Crear la categoría Balanza
      const { data: nuevaCategoria, error: errorInsert } = await supabase
        .from('categorias')
        .insert({
          nombre: 'Balanza',
          descripcion: 'Productos que se venden por peso (gramos/kilogramos)',
          activo: true
        })
        .select()
        .single()

      if (errorInsert) {
        resultados.errores.push(`Error creando categoría Balanza: ${errorInsert.message}`)
      } else {
        resultados.balanzaCreada = true
        console.log('✅ Categoría Balanza creada:', nuevaCategoria.id)
      }
    } else {
      console.log('ℹ️ La categoría Balanza ya existe')
    }

  } catch (error: any) {
    resultados.errores.push(`Error general: ${error.message}`)
  }

  return resultados
}

/**
 * Verifica el estado de la migración de balanza
 */
export async function verificarEstadoMigracion() {
  const estado = {
    categoriaBalanzaExiste: false
  }

  // Verificar categoría Balanza
  const { data: categoriaBalanza } = await supabase
    .from('categorias')
    .select('id')
    .ilike('nombre', '%balanza%')
    .maybeSingle()

  estado.categoriaBalanzaExiste = !!categoriaBalanza

  return estado
}
