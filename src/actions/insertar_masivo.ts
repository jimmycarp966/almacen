'use server'

import { supabase } from '@/lib/supabase'

// Productos faltantes con sus imágenes reales
const productosFaltantes = [
    // ===== VINOS FALTANTES =====
    {
        codigo: 'VIN-035',
        nombre: 'Vino Don David Malbec 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 3800,
        stock: 18,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Don-David-Malbec-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-036',
        nombre: 'Vino Los Árboles Blanco 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Los-Arboles-Blanco-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-037',
        nombre: 'Vino Mala Maria Blanco Dulce 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Mala-Maria-Blanco-Dulce-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-038',
        nombre: 'Vino Mala Maria Tinto 1.125cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 3200,
        stock: 18,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Mala-Maria-Tinto-1125-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-039',
        nombre: 'Vino Urbano Malbec 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 3500,
        stock: 20,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Urbano-Malbec-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-040',
        nombre: 'Vino Refugio Frutos Rojos 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 4200,
        stock: 12,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Refugio-Frutos-Rojos-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-041',
        nombre: 'Vino Callia Malbec 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 2900,
        stock: 30,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Callia-Malbec-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-042',
        nombre: 'Vino Latitud 33 Cabernet 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 4800,
        stock: 18,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168452/Vino-Latitud-33-Cabernet-750-Cc-1-1.jpg'
    },
    {
        codigo: 'VIN-043',
        nombre: 'Vodka Smirnoff 750cc',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 8500,
        stock: 15,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Vodka-Smirnoff-750-Ml-1-21820.jpg'
    },
    {
        codigo: 'VIN-044',
        nombre: 'Dr. Lemon c/Vodka 1lt',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 4500,
        stock: 20,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Dr-Lemon-Vodka-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'VIN-045',
        nombre: 'Freeze Azul 1lt',
        categoria_id: '9a98d5e4-59fd-438b-9b03-ae68507dad5d',
        precio: 3800,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Freeze-Azul-1-Lt-1-21820.jpg'
    },

    // ===== GASEOSAS FALTANTES =====
    {
        codigo: 'GAS-025',
        nombre: 'Cunnington Tónica 3lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Cunnington-Tonica-3-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-026',
        nombre: 'Cunnington Pomelo 3lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Cunnington-Pomelo-3-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-027',
        nombre: 'Cunnington Naranja 3lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Cunnington-Naranja-3-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-028',
        nombre: 'Cunnington Lima-Limón 3lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Cunnington-Lima-Limon-3-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-029',
        nombre: 'Aquarius Manzana 1.5lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Aquarius-Manzana-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-030',
        nombre: 'Aquarius Pera 1.5lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Aquarius-Pera-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-031',
        nombre: 'Aquarius Naranja 1.5lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Aquarius-Naranja-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-032',
        nombre: 'Aquarius Pomelo 2.25lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Aquarius-Pomelo-2.25-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-033',
        nombre: 'Ades Manzana 1lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1600,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jugo-Ades-Manzana-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-034',
        nombre: 'Villa del Sur 2.25lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Agua-Villa-Del-Sur-2.25-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-035',
        nombre: 'Levité Manzana 2.25lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1800,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Levite-Manzana-2.25-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-036',
        nombre: 'Levité Naranja 2.25lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1800,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Levite-Naranja-2.25-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-037',
        nombre: 'Secco 1.5lt Naranja',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1700,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Secco-Naranja-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-038',
        nombre: 'Secco 3lt Varios Sabores',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Secco-3-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-039',
        nombre: 'Torasso 2.25lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Agua-Torasso-2.25-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-040',
        nombre: 'Torasso 3lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1800,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Agua-Torasso-3-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-041',
        nombre: 'Torasso Soda Sifón 2lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 1200,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Agua-Torasso-Soda-2-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-042',
        nombre: 'Mango Serrano 1.5lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2000,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Mango-Serrano-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-043',
        nombre: 'Amargo Serrano Terma 1.35lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Amargo-Serrano-Terma-1.35-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-044',
        nombre: 'Paso de los Toros Tónica 1.5lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2400,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Paso-De-Los-Toros-Tonica-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-045',
        nombre: 'Paso de los Toros Pomelo 1.5lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2400,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Paso-De-Los-Toros-Pomelo-1.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-046',
        nombre: 'Gatorade Rojo 995cc',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2000,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Isotonica-Gatorade-Rojo-995-Ml-1-21820.jpg'
    },
    {
        codigo: 'GAS-047',
        nombre: 'Gatorade 1.25lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bebida-Isotonica-Gatorade-1.25-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-048',
        nombre: 'Mirinda 2lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Mirinda-2-Lt-1-21820.jpg'
    },
    {
        codigo: 'GAS-049',
        nombre: 'Mirinda 3lt',
        categoria_id: '7918dc62-61a4-46f4-8381-c7eae3e95b57',
        precio: 3000,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gaseosa-Mirinda-3-Lt-1-21820.jpg'
    },

    // ===== CERVEZAS FALTANTES =====
    {
        codigo: 'CER-008',
        nombre: 'Quilmes Lata 473cc',
        categoria_id: 'b8b43347-eaeb-4aa7-9cf9-2414bac6eaaf',
        precio: 1400,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Quilmes-Lata-473-Ml-1-21820.jpg'
    },
    {
        codigo: 'CER-009',
        nombre: 'Quilmes Botella 1lt Retornable',
        categoria_id: 'b8b43347-eaeb-4aa7-9cf9-2414bac6eaaf',
        precio: 2300,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Quilmes-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'CER-010',
        nombre: 'Quilmes Stout 1lt Retornable',
        categoria_id: 'b8b43347-eaeb-4aa7-9cf9-2414bac6eaaf',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Quilmes-Stout-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'CER-011',
        nombre: 'Quilmes 1.2lt Retornable',
        categoria_id: 'b8b43347-eaeb-4aa7-9cf9-2414bac6eaaf',
        precio: 2500,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Quilmes-1.2-Lt-1-21820.jpg'
    },
    {
        codigo: 'CER-012',
        nombre: 'Imperial Golden Lata 473cc',
        categoria_id: 'b8b43347-eaeb-4aa7-9cf9-2414bac6eaaf',
        precio: 1600,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cerveza-Imperial-Lata-473-Ml-1-21820.jpg'
    },

    // ===== HIGIENE FALTANTES =====
    {
        codigo: 'HIG-006',
        nombre: 'Minora',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 900,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Minora-1-Un-1-21820.jpg'
    },
    {
        codigo: 'HIG-007',
        nombre: 'Hojas Gillette x5',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2500,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Hojas-Gillette-X5-1-21820.jpg'
    },
    {
        codigo: 'HIG-008',
        nombre: 'Espuma Gillette',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Espuma-Gillette-1-21820.jpg'
    },
    {
        codigo: 'HIG-009',
        nombre: 'Venus x3',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2800,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Venus-X3-1-21820.jpg'
    },
    {
        codigo: 'HIG-010',
        nombre: 'Match 3',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Match-3-1-21820.jpg'
    },
    {
        codigo: 'HIG-011',
        nombre: 'Hilo Dental Oral-B',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 1200,
        stock: 40,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Hilo-Dental-Oral-B-1-21820.jpg'
    },
    {
        codigo: 'HIG-012',
        nombre: 'Enjuague Bucal Oral-B',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2800,
        stock: 20,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Enjuague-Bucal-Oral-B-1-21820.jpg'
    },
    {
        codigo: 'HIG-013',
        nombre: 'Always Toallas',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Toallitas-Femeninas-Always-1-21820.jpg'
    },
    {
        codigo: 'HIG-014',
        nombre: 'Always Protectores',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 1000,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Protectores-Always-1-21820.jpg'
    },
    {
        codigo: 'HIG-015',
        nombre: 'Pañales Pampers XXG',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 15000,
        stock: 10,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Pampers-XXG-1-21820.jpg'
    },
    {
        codigo: 'HIG-016',
        nombre: 'Pañales Pampers XG',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 14500,
        stock: 10,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Pampers-XG-1-21820.jpg'
    },
    {
        codigo: 'HIG-017',
        nombre: 'Pañales Pampers M',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 12000,
        stock: 12,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Pampers-M-1-21820.jpg'
    },
    {
        codigo: 'HIG-018',
        nombre: 'Pañales Huggies XXG',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 14000,
        stock: 10,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Huggies-XXG-1-21820.jpg'
    },
    {
        codigo: 'HIG-019',
        nombre: 'Pañales Huggies XG',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 13500,
        stock: 10,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Huggies-XG-1-21820.jpg'
    },
    {
        codigo: 'HIG-020',
        nombre: 'Pañales Huggies M',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 11500,
        stock: 12,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pañales-Huggies-M-1-21820.jpg'
    },
    {
        codigo: 'HIG-021',
        nombre: 'Toallas Húmedas Bebé',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Toallas-Humedas-Bebe-1-21820.jpg'
    },
    {
        codigo: 'HIG-022',
        nombre: 'Pilas Duracell AAA x2',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 2000,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Pila-Duracell-AAA-X2-1-21820.jpg'
    },
    {
        codigo: 'HIG-023',
        nombre: 'La Gotita',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 800,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/La-Gotita-1-21820.jpg'
    },
    {
        codigo: 'HIG-024',
        nombre: 'Poxi-Ran',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 900,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Poxi-Ran-1-21820.jpg'
    },
    {
        codigo: 'HIG-025',
        nombre: 'Poxipol',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 1500,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Poxipol-1-21820.jpg'
    },
    {
        codigo: 'HIG-026',
        nombre: 'Fastix',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 1200,
        stock: 40,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Fastix-1-21820.jpg'
    },
    {
        codigo: 'HIG-027',
        nombre: 'Poxilina',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 700,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Poxilina-1-21820.jpg'
    },
    {
        codigo: 'HIG-028',
        nombre: 'Crema Hinds',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 3500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Crema-Hinds-1-21820.jpg'
    },
    {
        codigo: 'HIG-029',
        nombre: 'Gel Cabello',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 4200,
        stock: 20,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Gel-Cabello-1-21820.jpg'
    },
    {
        codigo: 'HIG-030',
        nombre: 'Desodorante Poet Aerosol',
        categoria_id: '1ebcf58b-7fdd-41ce-a327-e232cdc2e888',
        precio: 3200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Desodorante-Poet-Aerosol-1-21820.jpg'
    },

    // ===== LIMPIEZA FALTANTES =====
    {
        codigo: 'LIM-005',
        nombre: 'Magistral Limón 600cc',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2800,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Detergente-Magistral-Limon-600-Ml-1-21820.jpg'
    },
    {
        codigo: 'LIM-006',
        nombre: 'Magistral Limón 900cc',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 3800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Detergente-Magistral-Limon-900-Ml-1-21820.jpg'
    },
    {
        codigo: 'LIM-007',
        nombre: 'Ariel Polvo',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 5500,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Ariel-Polvo-1-21820.jpg'
    },
    {
        codigo: 'LIM-008',
        nombre: 'Jabón Zorro',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jabon-Zorro-1-21820.jpg'
    },
    {
        codigo: 'LIM-009',
        nombre: 'Jabón Envy Polvo',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Jabon-Envv-Polvo-1-21820.jpg'
    },
    {
        codigo: 'LIM-010',
        nombre: 'Suavizante Bonita',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 1800,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Suavizante-Bonita-1-21820.jpg'
    },
    {
        codigo: 'LIM-011',
        nombre: 'Ayudín Ropa Blanca',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Lavandina-Ayudin-Ropa-Blanca-1-21820.jpg'
    },
    {
        codigo: 'LIM-012',
        nombre: 'Ayudín Ropa Color',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Lavandina-Ayudin-Ropa-Color-1-21820.jpg'
    },
    {
        codigo: 'LIM-013',
        nombre: 'Ayudín Aerosol',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 3500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Lavandina-Ayudin-Aerosol-1-21820.jpg'
    },
    {
        codigo: 'LIM-014',
        nombre: 'Harpic Negro',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2800,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Harpic-Negro-1-21820.jpg'
    },
    {
        codigo: 'LIM-015',
        nombre: 'Vim Gel',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 3200,
        stock: 20,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Vim-Gel-1-21820.jpg'
    },
    {
        codigo: 'LIM-016',
        nombre: 'Cif Crema',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cif-Crema-1-21820.jpg'
    },
    {
        codigo: 'LIM-017',
        nombre: 'Poet Piso',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 3500,
        stock: 20,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Poet-Piso-1-21820.jpg'
    },
    {
        codigo: 'LIM-018',
        nombre: 'Mata Insectos',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Mata-Insectos-1-21820.jpg'
    },
    {
        codigo: 'LIM-019',
        nombre: 'Bora Detergente',
        categoria_id: 'f115a67a-d3e5-41ce-81da-2b1a15d68fcc',
        precio: 4500,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Detergente-Bora-1-21820.jpg'
    },

    // ===== SNACKS FALTANTES =====
    {
        codigo: 'SNA-005',
        nombre: 'Doritos 200gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Doritos-200-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-006',
        nombre: 'Doritos 80gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1800,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Doritos-80-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-007',
        nombre: '3D 200gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/3D-200-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-008',
        nombre: 'Cheetos 200gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cheetos-200-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-009',
        nombre: 'Quesitos',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Quesitos-1-21820.jpg'
    },
    {
        codigo: 'SNA-010',
        nombre: 'Palitos',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1200,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Palitos-1-21820.jpg'
    },
    {
        codigo: 'SNA-011',
        nombre: 'Papas Lays Queso 134gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2300,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Papas-Lays-Queso-134-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-012',
        nombre: 'Papas Lays Papas 134gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2300,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Papas-Lays-Papas-134-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-013',
        nombre: 'Papas Lays Cebolla 134gr',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2300,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Papas-Lays-Cebolla-134-G-1-21820.jpg'
    },
    {
        codigo: 'SNA-014',
        nombre: 'Anitos',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1000,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Anitos-1-21820.jpg'
    },
    {
        codigo: 'SNA-015',
        nombre: 'Bolitas de Chocolate',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1800,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Bolitas-Chocolate-1-21820.jpg'
    },
    {
        codigo: 'SNA-016',
        nombre: 'Galleta Granix Frutigran',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Galleta-Granix-Frutigran-1-21820.jpg'
    },
    {
        codigo: 'SNA-017',
        nombre: 'Galleta Granix Fiesta',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Galleta-Granix-Fiesta-1-21820.jpg'
    },
    {
        codigo: 'SNA-018',
        nombre: 'Galleta Granix Sandwich',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Galleta-Granix-Sandwich-1-21820.jpg'
    },
    {
        codigo: 'SNA-019',
        nombre: 'Galleta Granix Salvado',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2000,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Galleta-Granix-Salvado-1-21820.jpg'
    },
    {
        codigo: 'SNA-020',
        nombre: 'Galleta Granix Sin Sal',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Galleta-Granix-Sin-Sal-1-21820.jpg'
    },
    {
        codigo: 'SNA-021',
        nombre: 'Snachitos',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Snachitos-1-21820.jpg'
    },
    {
        codigo: 'SNA-022',
        nombre: 'Tutucas',
        categoria_id: 'a6a61fd6-b480-44e3-a945-fc0b315e0b32',
        precio: 1200,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Tutucas-1-21820.jpg'
    },

    // ===== ALMACÉN FALTANTES =====
    {
        codigo: 'ALM-006',
        nombre: 'Aceite Finca el Lazo 900cc',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 2800,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Aceite-Finca-El-Lazo-900-Ml-1-21820.jpg'
    },
    {
        codigo: 'ALM-007',
        nombre: 'Aceite Finca el Lazo 4.5lt',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 9500,
        stock: 12,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Aceite-Finca-El-Lazo-4.5-Lt-1-21820.jpg'
    },
    {
        codigo: 'ALM-008',
        nombre: 'Caldo Knorr',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 800,
        stock: 60,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Caldo-Knorr-1-21820.jpg'
    },
    {
        codigo: 'ALM-009',
        nombre: 'Caldos Canals',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 900,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Caldos-Canals-1-21820.jpg'
    },
    {
        codigo: 'ALM-010',
        nombre: 'Cacao Toddy 180gr',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1800,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cacao-Toddy-180-G-1-21820.jpg'
    },
    {
        codigo: 'ALM-011',
        nombre: 'Cacao Toddy 360gr',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cacao-Toddy-360-G-1-21820.jpg'
    },
    {
        codigo: 'ALM-012',
        nombre: 'Avena Quaker Tradicional',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 2800,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Avena-Quaker-Tradicional-1-21820.jpg'
    },
    {
        codigo: 'ALM-013',
        nombre: 'Avena Quaker Instantánea',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 3000,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Avena-Quaker-Instantanea-1-21820.jpg'
    },
    {
        codigo: 'ALM-014',
        nombre: 'Avena Quaker Extra Fina',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 3200,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Avena-Quaker-Extra-Fina-1-21820.jpg'
    },
    {
        codigo: 'ALM-015',
        nombre: 'Alfajor Fantoche Triple',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1500,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Alfajor-Fantoche-Triple-1-21820.jpg'
    },

    // ===== PANIFICACIÓN FALTANTE =====
    {
        codigo: 'PAN-004',
        nombre: 'Pan Francés',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1200,
        stock: 40,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Frances.jpg'
    },
    {
        codigo: 'PAN-005',
        nombre: 'Pan Miñón',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1000,
        stock: 48,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Minion.jpg'
    },
    {
        codigo: 'PAN-006',
        nombre: 'Pan Sandwich',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1500,
        stock: 36,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Sandwich.jpg'
    },
    {
        codigo: 'PAN-007',
        nombre: 'Pan Hamburguesas',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1500,
        stock: 36,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Hamburguesas.jpg'
    },
    {
        codigo: 'PAN-008',
        nombre: 'Pan Viena',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1800,
        stock: 24,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Viena.jpg'
    },
    {
        codigo: 'PAN-009',
        nombre: 'Pre-Pizzas',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 2500,
        stock: 20,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pre-Pizzas.jpg'
    },
    {
        codigo: 'PAN-010',
        nombre: 'Pan Lactal Pandino',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 2000,
        stock: 24,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Lactal-Pandino.jpg'
    },
    {
        codigo: 'PAN-011',
        nombre: 'Pan Copo de Oro',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1800,
        stock: 24,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Copo-De-Oro.jpg'
    },
    {
        codigo: 'PAN-012',
        nombre: 'Pan Favorita',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1600,
        stock: 30,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Favorita.jpg'
    },
    {
        codigo: 'PAN-013',
        nombre: 'Pan Bimbo',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 1800,
        stock: 24,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pan-Bimbo.jpg'
    },
    {
        codigo: 'PAN-014',
        nombre: 'Calidad Artesano Original',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 3500,
        stock: 12,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Calidad-Artesano-Original.jpg'
    },
    {
        codigo: 'PAN-015',
        nombre: 'Calidad Artesano Integral',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 3800,
        stock: 12,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Calidad-Artesano-Integral.jpg'
    },
    {
        codigo: 'PAN-016',
        nombre: 'Chipas',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 3000,
        stock: 18,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Chipas.jpg'
    },
    {
        codigo: 'PAN-017',
        nombre: 'Tortillas',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 2500,
        stock: 18,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Tortillas.jpg'
    },
    {
        codigo: 'PAN-018',
        nombre: 'Pascualina Criolla',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 2800,
        stock: 12,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pascualina-Criolla.jpg'
    },
    {
        codigo: 'PAN-019',
        nombre: 'Pascualina Hojaldre',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 3200,
        stock: 10,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pascualina-Hojaldre.jpg'
    },
    {
        codigo: 'PAN-020',
        nombre: 'Pascualina Light',
        categoria_id: '79897b8c-83bb-4b9a-af5b-d51f9a45d799',
        precio: 3000,
        stock: 10,
        imagen_url: 'https://veaargentina.vtexassets.com/arquivos/ids/168453/Pascualina-Light.jpg'
    },

    // ===== LÁCTEOS FALTANTES =====
    {
        codigo: 'LAC-001',
        nombre: 'Leche Milkaut Entera 1lt',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1800,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Leche-Milkaut-Entera-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'LAC-002',
        nombre: 'Leche Milkaut Descremada 1lt',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1800,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Leche-Milkaut-Descremada-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'LAC-003',
        nombre: 'Manteca Milkaut 400gr',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 2200,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Manteca-Milkaut-400-G-1-21820.jpg'
    },
    {
        codigo: 'LAC-004',
        nombre: 'Dulce de Leche Milkaut 250gr',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 2800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Dulce-De-Leche-Milkaut-250-G-1-21820.jpg'
    },
    {
        codigo: 'LAC-005',
        nombre: 'Quesos Saborizados',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 4500,
        stock: 12,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Quesos-Saborizados-1-21820.jpg'
    },
    {
        codigo: 'LAC-006',
        nombre: 'Salchichas Panchín',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 3200,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Salchichas-Panchin-1-21820.jpg'
    },
    {
        codigo: 'LAC-007',
        nombre: 'Huevos de Codorniz',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 3500,
        stock: 20,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Huevos-De-Codorniz-1-21820.jpg'
    },
    {
        codigo: 'LAC-008',
        nombre: 'Tallarines Inche',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1500,
        stock: 30,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Tallarines-Inche-1-21820.jpg'
    },
    {
        codigo: 'LAC-009',
        nombre: 'Tallarines Galetti',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1800,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Tallarines-Galetti-1-21820.jpg'
    },
    {
        codigo: 'LAC-010',
        nombre: 'Tallarines Que Rico',
        categoria_id: 'b44cbef4-f818-4972-9a39-f4bb1049753f',
        precio: 1200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Tallarines-Que-Rico-1-21820.jpg'
    },

    // ===== HELADOS FALTANTES =====
    {
        codigo: 'HEL-004',
        nombre: 'Palito Grido Limón',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 900,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Palito-Grido-Limon-1-21820.jpg'
    },
    {
        codigo: 'HEL-005',
        nombre: 'Palito Grido Frutilla',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 900,
        stock: 48,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Palito-Grido-Frutilla-1-21820.jpg'
    },
    {
        codigo: 'HEL-006',
        nombre: 'Suito Grido',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 1200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Suito-Grido-1-21820.jpg'
    },
    {
        codigo: 'HEL-007',
        nombre: 'Escocés Grido',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 1200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Escoces-Grido-1-21820.jpg'
    },
    {
        codigo: 'HEL-008',
        nombre: 'Fortezza Grido',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 1200,
        stock: 36,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Fortezza-Grido-1-21820.jpg'
    },
    {
        codigo: 'HEL-009',
        nombre: 'Tentación Grido 1lt',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 4500,
        stock: 18,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Tentacion-Grido-1-Lt-1-21820.jpg'
    },
    {
        codigo: 'HEL-010',
        nombre: 'Cucuruchones Grido',
        categoria_id: '73946f3f-6702-4597-9bec-1168e5a4c7c5',
        precio: 2500,
        stock: 24,
        imagen_url: 'https://ardiaprod.vtexassets.com/arquivos/ids/228646/Cucuruchones-Grido-1-21820.jpg'
    },
]

export async function insertarProductosMasivos() {
    const resultados = {
        exitosos: [] as string[],
        errores: [] as { codigo: string; error: string }[],
        omitidos: [] as string[]
    }

    // Obtener códigos existentes
    const { data: existentes } = await supabase
        .from('productos')
        .select('codigo')

    const codigosExistentes = new Set(existentes?.map(p => p.codigo) || [])

    // Insertar productos que no existen
    for (const producto of productosFaltantes) {
        // Verificar si ya existe
        if (codigosExistentes.has(producto.codigo)) {
            resultados.omitidos.push(`${producto.codigo}: ${producto.nombre}`)
            continue
        }

        const { data, error } = await supabase
            .from('productos')
            .insert([{
                codigo: producto.codigo,
                nombre: producto.nombre,
                categoria_id: producto.categoria_id,
                precio: producto.precio,
                stock: producto.stock,
                stock_minimo: Math.floor(producto.stock / 4),
                imagen_url: producto.imagen_url,
                activo: true,
                descuento: 0
            }])
            .select()

        if (!error && data) {
            resultados.exitosos.push(`${producto.codigo}: ${producto.nombre}`)
        } else {
            resultados.errores.push({ codigo: producto.codigo, error: error?.message || 'Error desconocido' })
        }
    }

    return resultados
}
