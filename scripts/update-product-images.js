// Script para actualizar imágenes de productos desde Supabase
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Credenciales del proyecto
const SUPABASE_URL = 'https://guayzrzbqkvqtxoiotwo.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1YXl6cnpicWt2cXR4b2lvdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MjczMTcsImV4cCI6MjA3NjUwMzMxN30.S0_RAsr1QfdM1jzZsHEEpmduYIKi0hJ9wuYZOIhxGAc'

// Mapa de productos con sus imágenes reales conocidas
const productosImagenes = {
    // Vinos
    'VIN-020': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-San-Felipe-Tinto-750-Cc-1-1.jpg',
    'VIN-006': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Nativo-Tinto-1-Lt-1-1.jpg',
    'VIN-007': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Nativo-Rosado-1-Lt-1-1.jpg',
    'VIN-009': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Casillero-Del-Diablo-Blanco-Dulce-1125-Cc-1-1.jpg',
    'VIN-003': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Toro-Tinto-1-Lt-1-1.jpg',
    'VIN-013': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Pato-Criollo-Malbec-750-Cc-1-1.jpg',
    'VIN-015': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Viejo-Vinedo-1125-Cc-1-1.jpg',
    'VIN-016': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Potrillito-1125-Cc-1-1.jpg',
    'VIN-018': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Don-Valentin-Lacrado-750-Cc-1-1.jpg',
    'VIN-021': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Trumpeter-Malbec-750-Cc-1-1.jpg',
    'VIN-023': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Las-Perdices-Malbec-750-Cc-1-1.jpg',
    'VIN-024': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Cafayate-Malbec-750-Cc-1-1.jpg',
    'VIN-026': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Etchart-Privado-Torrontes-750-Cc-1-1.jpg',
    'VIN-027': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Fincas-Las-Moras-Malbec-750-Cc-1-1.jpg',
    'VIN-029': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-De-Alamos-Malbec-750-Cc-1-1.jpg',
    'VIN-030': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-De-Alamos-Cabernet-750-Cc-1-1.jpg',
    'VIN-032': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Santa-Julia-Tinto-750-Cc-1-1.jpg',
    'VIN-034': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Santa-Julia-Blanco-Dulce-750-Cc-1-1.jpg',
    'VIN-002': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Whisky-Old-Smuggler-1-Lt-1-1.jpg',
    'VIN-008': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Casillero-Del-Diablo-Tinto-1125-Cc-1-1.jpg',
    'VIN-014': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Dilema-Blanco-Dulce-750-Cc-1-1.jpg',
    'VIN-017': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Termidor-1125-Cc-1-1.jpg',
    'VIN-022': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Perdices-Malbec-750-Cc-1-1.jpg',
    'VIN-025': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Cafayate-Cabernet-750-Cc-1-1.jpg',
    'VIN-028': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Finca-Las-Moras-Cabernet-750-Cc-1-1.jpg',
    'VIN-031': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-De-Alamos-Merlot-750-Cc-1-1.jpg',
    'VIN-033': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Santa-Julia-Tinto-Dulce-750-Cc-1-1.jpg',
    'VIN-005': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Toro-Chablis-Tinto-1125-Cc-1-1.jpg',
    'VIN-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Fernet-Branca-750-Ml-1-21820.jpg',
    'VIN-010': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Estancia-Mendoza-Cabernet-Malbec-750-Cc-1-1.jpg',
    'VIN-012': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Estancia-Mendoza-1125-Cc-1-1.jpg',
    'VIN-011': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Estancia-Mendoza-Merlot-Malbec-750-Cc-1-1.jpg',
    'VIN-019': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Latitud-33-Malbec-750-Cc-1-1.jpg',
    'VIN-004': 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Toro-Clasico-Tinto-750-Cc-1-1.jpg',

    // Gaseosas
    'GAS-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Coca-Cola-Original-1.5-Lt-1-21820.jpg',
    'GAS-003': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Fanta-Naranja-1.5-Lt-1-21820.jpg',
    'GAS-006': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Fanta-Naranja-2.5-Lt-1-21820.jpg',
    'GAS-004': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Coca-Cola-Original-2.5-Lt-1-21820.jpg',
    'GAS-007': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Coca-Cola-Original-2.25-Lt-1-21820.jpg',
    'GAS-009': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Coca-Cola-Original-3-Lt-1-21820.jpg',
    'GAS-010': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jugo-Cepita-Multifruta-1-Lt-1-21820.jpg',
    'GAS-012': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Soda-Bivendictino-600-Ml-1-21820.jpg',
    'GAS-014': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Agua-Bivendictino-2-Lt-1-21820.jpg',
    'GAS-015': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Agua-Bivendictino-6.25-Lt-1-21820.jpg',
    'GAS-017': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Isotonica-Powerade-Azul-500-Ml-1-21820.jpg',
    'GAS-018': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Pepsi-Original-500-Ml-1-21820.jpg',
    'GAS-020': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Isotonica-Gatorade-Manzana-500-Ml-1-21820.jpg',
    'GAS-021': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Energizante-Red-Bull-Original-250-Ml-1-21820.jpg',
    'GAS-023': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Pepsi-Original-2.25-Lt-1-21820.jpg',
    'GAS-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Sprite-Original-1.5-Lt-1-21820.jpg',
    'GAS-005': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Sprite-Original-2.25-Lt-1-21820.jpg',
    'GAS-019': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-7up-Sin-Azucar-500-Ml-1-21820.jpg',
    'GAS-016': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Energizante-Monster-Energy-Original-473-Ml-1-21820.jpg',
    'GAS-022': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Energizante-Rockstar-Original-500-Ml-1-21820.jpg',
    'GAS-024': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Pepsi-Original-3-Lt-1-21820.jpg',
    'GAS-011': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jugo-Cepita-Naranja-1.5-Lt-1-21820.jpg',
    'GAS-013': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Soda-Bivendictino-2-Lt-1-21820.jpg',
    'GAS-008': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Sprite-Original-2.25-Lt-1-21820.jpg',

    // Cervezas
    'CER-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Norte-Lata-473-Ml-1-21820.jpg',
    'CER-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Norte-Retornable-1-Lt-1-21820.jpg',
    'CER-003': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Salta-Negra-Lata-473-Ml-1-21820.jpg',
    'CER-004': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Salta-Rubia-Retornable-1-Lt-1-21820.jpg',
    'CER-005': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Heineken-Lata-473-Ml-1-21820.jpg',
    'CER-007': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jugo-Baggio-Naranja-1-Lt-1-21820.jpg',
    'CER-006': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jugo-Baggio-Naranja-200-Ml-1-21820.jpg',

    // Higiene y P&G
    'HIG-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Toallitas-Femeninas-Always-Suave-8-Un-1-21820.jpg',
    'HIG-003': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pasta-Dental-Oral-B-70-G-1-21820.jpg',
    'HIG-005': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pila-Duracell-AA-X2-1-21820.jpg',
    'HIG-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gillette-Prestobarba-1-Un-1-21820.jpg',
    'HIG-004': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cepillo-Dental-Oral-B-1-Un-1-21820.jpg',

    // Limpieza
    'LIM-004': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Suavizante-Downy-400-Ml-1-21820.jpg',
    'LIM-003': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Detergente-Magistral-Limón-300-Ml-1-21820.jpg',
    'LIM-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Ariel-Liquido-Platinum-800-Ml-1-21820.jpg',
    'LIM-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Lavandina-Ayudin-Original-1-Lt-1-21820.jpg',

    // Snacks
    'SNA-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Twistos-Queso-100-G-1-21820.jpg',
    'SNA-003': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Chizitos-1-Kg-1-21820.jpg',
    'SNA-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Papas-Lays-Clasicas-134-G-1-21820.jpg',
    'SNA-004': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Mani-Salado-250-G-1-21820.jpg',

    // Panificación
    'PAN-002': 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-de-Molde-Lactal-400g.jpg',
    'PAN-001': 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Casero-1kg.jpg',
    'PAN-003': 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Facturas-docena.jpg',

    // Almacén/Varios
    'ALM-001': 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Arroz-Gallo-Oro-1kg.jpg',
    'ALM-005': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Aceite-Girasol-Natura-1.5-Lt-1-21820.jpg',
    'ALM-002': 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Fideos-Matarazzo-500g.jpg',
    'ALM-003': 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Yerba-Mate-Playadito-500g.jpg',
    'ALM-004': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Azucar-Ledesma-Clasica-1-Kg-1-21820.jpg',

    // Pañales
    'PAÑ-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Huggies-Super-X48-1-21820.jpg',
    'PAÑ-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Pampers-G-X48-1-21820.jpg',

    // Helados
    'HEL-001': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Palito-Bombon-Grido-1-Un-1-21820.jpg',
    'HEL-002': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Helado-Grido-Balde-3-Lt-1-21820.jpg',
    'HEL-003': 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Torta-Helada-Grido-1.6-Lt-1-21820.jpg',
}

async function main() {
    console.log('Conectando a Supabase...')
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

    try {
        // Obtener productos actuales
        const { data: productos, error } = await supabase
            .from('productos')
            .select('*')

        if (error) {
            console.error('Error al obtener productos:', error)
            return
        }

        console.log(`\nTotal de productos en BD: ${productos.length}`)
        console.log(`Actualizando imágenes...`)

        let actualizados = 0
        let noEncontrados = []

        for (const producto of productos) {
            if (productosImagenes[producto.codigo]) {
                const nuevaImagen = productosImagenes[producto.codigo]

                // Actualizar si la imagen es diferente
                if (producto.imagen_url !== nuevaImagen) {
                    const { error: updateError } = await supabase
                        .from('productos')
                        .update({ imagen_url: nuevaImagen })
                        .eq('id', producto.id)

                    if (!updateError) {
                        console.log(`✅ ${producto.codigo}: ${producto.nombre} - Imagen actualizada`)
                        actualizados++
                    } else {
                        console.log(`❌ ${producto.codigo}: Error al actualizar - ${updateError.message}`)
                    }
                }
            } else {
                noEncontrados.push(`${producto.codigo}: ${producto.nombre}`)
            }
        }

        console.log(`\n=== RESUMEN ===`)
        console.log(`Productos actualizados: ${actualizados}`)
        console.log(`Productos sin imagen en mapa: ${noEncontrados.length}`)

        if (noEncontrados.length > 0) {
            console.log(`\nProductos sin imagen mapeada:`)
            noEncontrados.forEach(p => console.log(`  - ${p}`))
        }

    } catch (error) {
        console.error('Error:', error.message)
    }
}

main().catch(console.error)
