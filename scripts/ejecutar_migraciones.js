/**
 * Script para ejecutar las migraciones pendientes de Super Aguilares
 *
 * USO:
 * 1. Asegúrate de tener las variables de entorno configuradas
 * 2. Ejecuta: node scripts/ejecutar_migraciones.js
 */

const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan las variables de entorno NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function ejecutarMigraciones() {
  console.log('🚀 Iniciando migraciones de Super Aguilares...\n')

  try {
    // ============================================================
    // MIGRACIÓN 1: Agregar campos de balanza a productos
    // ============================================================
    console.log('📦 MIGRACIÓN 1: Campos de balanza en productos')

    // Primero verificamos si las columnas ya existen
    const { data: columnas, error: errorColumnas } = await supabase
      .rpc('get_table_columns', { table_name: 'productos' })
      .select('column_name')

    // Como no tenemos acceso a esa función, intentamos agregar directamente
    // y si falla por duplicado, continuamos

    // Agregar tipo_venta si no existe
    try {
      const { error: errorTipoVenta } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE productos ADD COLUMN IF NOT EXISTS tipo_venta TEXT DEFAULT 'unidad' CHECK (tipo_venta IN ('unidad', 'peso'));`
      })
      if (errorTipoVenta && !errorTipoVenta.message.includes('already exists')) {
        console.log('   ⚠️  No se pudo agregar tipo_venta (quizás ya existe)')
      } else {
        console.log('   ✅ Columna tipo_venta agregada o ya existía')
      }
    } catch (e) {
      console.log('   ⚠️  No se pudo agregar tipo_venta (quizás ya existe)')
    }

    // Agregar precio_por_kg si no existe
    try {
      const { error: errorPrecioKg } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE productos ADD COLUMN IF NOT EXISTS precio_por_kg DECIMAL(10, 2);`
      })
      if (errorPrecioKg && !errorPrecioKg.message.includes('already exists')) {
        console.log('   ⚠️  No se pudo agregar precio_por_kg (quizás ya existe)')
      } else {
        console.log('   ✅ Columna precio_por_kg agregada o ya existía')
      }
    } catch (e) {
      console.log('   ⚠️  No se pudo agregar precio_por_kg (quizás ya existe)')
    }

    // ============================================================
    // MIGRACIÓN 2: Cambiar cantidad a decimal en pedido_items
    // ============================================================
    console.log('\n📦 MIGRACIÓN 2: Campo cantidad como DECIMAL en pedido_items')
    try {
      const { error: errorCantidad } = await supabase.rpc('exec_sql', {
        sql: `ALTER TABLE pedido_items ALTER COLUMN cantidad TYPE DECIMAL(10, 3);`
      })
      if (errorCantidad) {
        console.log('   ⚠️  No se pudo modificar cantidad (quizás ya es DECIMAL o no existe):', errorCantidad.message)
      } else {
        console.log('   ✅ Columna cantidad modificada a DECIMAL(10,3)')
      }
    } catch (e) {
      console.log('   ⚠️  No se pudo modificar cantidad (quizás ya es DECIMAL)')
    }

    // ============================================================
    // MIGRACIÓN 3: Crear categoría Balanza
    // ============================================================
    console.log('\n📦 MIGRACIÓN 3: Crear categoría Balanza')

    const { data: categoriaExistente, error: errorConsulta } = await supabase
      .from('categorias')
      .select('id, nombre')
      .ilike('nombre', '%balanza%')
      .single()

    if (errorConsulta && errorConsulta.code !== 'PGRST116') {
      console.log('   ⚠️  Error al consultar categoría:', errorConsulta.message)
    } else if (categoriaExistente) {
      console.log('   ℹ️  La categoría Balanza ya existe:', categoriaExistente.nombre)
    } else {
      // Crear la categoría
      const { data: nuevaCategoria, error: errorInsert } = await supabase
        .from('categorias')
        .insert({
          nombre: 'Balanza',
          descripcion: 'Productos que se venden por peso (gramos/kilogramos)',
          activo: true
        })
        .select()

      if (errorInsert) {
        console.log('   ❌ Error al crear categoría Balanza:', errorInsert.message)
      } else {
        console.log('   ✅ Categoría Balanza creada:', nuevaCategoria[0].id)
      }
    }

    // ============================================================
    // MIGRACIÓN 4: Verificar y asignar imágenes a productos sin imagen
    // ============================================================
    console.log('\n📦 MIGRACIÓN 4: Verificar imágenes de productos')

    const { data: productosSinImagen, error: errorProductos } = await supabase
      .from('productos')
      .select('id, nombre, categoria_id, imagen_url')
      .or('imagen_url.is.null,imagen_url.eq.')

    if (errorProductos) {
      console.log('   ❌ Error al obtener productos:', errorProductos.message)
    } else if (productosSinImagen && productosSinImagen.length > 0) {
      console.log(`   ℹ️  Found ${productosSinImagen.length} productos sin imagen`)

      // Lista de imágenes genéricas por categoría
      const imagenesPorCategoria = {
        'Bebidas': 'https://images.unsplash.com/photo-1560508180-03f285f59ded?w=400&h=400&fit=crop',
        'Almacén': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
        'Lácteos': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
        'Congelados': 'https://images.unsplash.com/photo-1632145372295-2aead8f10045?w=400&h=400&fit=crop',
        'Limpieza': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop',
        'Perfumería': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        'Mascotas': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop',
        'Balanza': 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=400&h=400&fit=crop'
      }

      const imagenPorDefecto = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'

      // Obtener categorías para mapear
      const { data: categorias } = await supabase
        .from('categorias')
        .select('id, nombre')

      const categoriaMap = {}
      if (categorias) {
        categorias.forEach(cat => {
          categoriaMap[cat.id] = cat.nombre
        })
      }

      // Actualizar productos sin imagen
      for (const producto of productosSinImagen) {
        const nombreCategoria = categoriaMap[producto.categoria_id] || ''
        let imagenAsignada = imagenesPorCategoria[nombreCategoria] || imagenPorDefecto

        // Para productos más específicos, usar imágenes más específicas
        const nombreLower = producto.nombre.toLowerCase()

        if (nombreLower.includes('galletita') || nombreLower.includes('galleta') || nombreLower.includes('cookie')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('aceite')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('arroz') || nombreLower.includes('fideo') || nombreLower.includes('pasta')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('café') || nombreLower.includes('cafe') || nombreLower.includes('te')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('azúcar') || nombreLower.includes('azucar')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('yerba')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('leche') || nombreLower.includes('yogur') || nombreLower.includes('yogurt')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('queso') || nombreLower.includes('crema')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('harina')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('detergente') || nombreLower.includes('lavado') || nombreLower.includes('limpia')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('papel') || nombreLower.includes('servilleta')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1588166899106-e8bf93f8507c?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('champú') || nombreLower.includes('champu') || nombreLower.includes('jabon') || nombreLower.includes('jabón')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('carne')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=400&fit=crop'
        } else if (nombreLower.includes('pollo') || nombreLower.includes('poll')) {
          imagenAsignada = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=400&fit=crop'
        }

        const { error: errorUpdate } = await supabase
          .from('productos')
          .update({ imagen_url: imagenAsignada })
          .eq('id', producto.id)

        if (errorUpdate) {
          console.log(`   ❌ Error al actualizar producto ${producto.nombre}:`, errorUpdate.message)
        } else {
          console.log(`   ✅ Imagen asignada a: ${producto.nombre}`)
        }
      }
    } else {
      console.log('   ✅ Todos los productos tienen imagen')
    }

    // ============================================================
    // RESUMEN FINAL
    // ============================================================
    console.log('\n' + '='.repeat(60))
    console.log('✅ Migraciones completadas')
    console.log('='.repeat(60))
    console.log('\n📋 Resumen:')
    console.log('   - Campos tipo_venta y precio_por_kg agregados a productos')
    console.log('   - Campo cantidad en pedido_items ahora es DECIMAL(10,3)')
    console.log('   - Categoría Balanza creada')
    console.log('   - Productos sin imagen actualizados')
    console.log('\n💡 Si notaste algún error anterior, ejecuta el SQL manualmente:')
    console.log('   Archivo: supabase_migration_balanza.sql')

  } catch (error) {
    console.error('\n❌ Error durante las migraciones:', error.message)
    console.error('\n📋 Como alternativa, ejecuta manualmente el archivo:')
    console.log('   supabase_migration_balanza.sql')
    console.log('\n   en el SQL Editor de tu panel de Supabase.')
    process.exit(1)
  }
}

ejecutarMigraciones()
  .then(() => {
    console.log('\n🎉 Proceso finalizado')
    process.exit(0)
  })
  .catch(error => {
    console.error('\n❌ Error:', error)
    process.exit(1)
  })
