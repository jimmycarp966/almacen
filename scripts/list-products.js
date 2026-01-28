// Script para listar productos desde Supabase
const { createClient } = require('@supabase/supabase-js')

// Credenciales del proyecto
const SUPABASE_URL = 'https://guayzrzbqkvqtxoiotwo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXl6cnpicWt2cXR4b2lvdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjczMTcsImV4cCI6MjA3NjUwMzMxN30.S0_RAsr1QfdM1jzZsHEEpmduYIKi0hJ9wuYZOIhxGAc'

async function main() {
    console.log('Conectando a Supabase...')
    console.log('URL:', SUPABASE_URL)

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    try {
        // Listar productos
        console.log('\n=== OBTENIENDO PRODUCTOS ===')
        const { data: productos, error: productosError } = await supabase
            .from('productos')
            .select('*')

        if (productosError) {
            console.error('Error al obtener productos:', productosError)
        } else {
            console.log(`\nTotal de productos: ${productos.length}`)
            console.log('\n--- LISTADO DE PRODUCTOS ---')
            productos.forEach((p, index) => {
                console.log(`\n${index + 1}. ${p.nombre}`)
                console.log(`   Código: ${p.codigo}`)
                console.log(`   Precio: $${p.precio}`)
                console.log(`   Descuento: ${p.descuento || 0}%`)
                console.log(`   Stock: ${p.stock}`)
                console.log(`   Categoría ID: ${p.categoria_id}`)
                console.log(`   Imagen URL: ${p.imagen_url || 'Sin imagen'}`)
                console.log(`   Activo: ${p.activo ? 'Sí' : 'No'}`)
            })
        }

        // Listar categorías
        console.log('\n\n=== OBTENIENDO CATEGORÍAS ===')
        const { data: categorias, error: categoriasError } = await supabase
            .from('categorias')
            .select('*')

        if (categoriasError) {
            console.error('Error al obtener categorías:', categoriasError)
        } else {
            console.log(`\nTotal de categorías: ${categorias.length}`)
            console.log('\n--- LISTADO DE CATEGORÍAS ---')
            categorias.forEach((c, index) => {
                console.log(`\n${index + 1}. ${c.nombre}`)
                console.log(`   ID: ${c.id}`)
                console.log(`   Activo: ${c.activo ? 'Sí' : 'No'}`)
            })
        }

        // Exportar a JSON
        const fs = require('fs')
        const output = {
            fecha: new Date().toISOString(),
            productos: productos || [],
            categorias: categorias || []
        }

        fs.writeFileSync(
            'D:\\Daniel\\Paginas\\Clientes\\Super Aguilares\\productos_export.json',
            JSON.stringify(output, null, 2)
        )
        console.log('\n\n=== EXPORTACIÓN COMPLETADA ===')
        console.log('Datos exportados a: productos_export.json')

    } catch (error) {
        console.error('Error:', error.message)
    }
}

main().catch(console.error)
