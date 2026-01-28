#!/usr/bin/env node
/**
 * Script para actualizar imágenes de productos en Supabase
 * Usa Node.js y el cliente de Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://guayzrzbqkvqtxoiotwo.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Mapeo de productos a imágenes
const PRODUCT_IMAGES = {
  // Vinos
  'vino': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
  'toro': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400',
  'nativo': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
  'cava': 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400',
  'cava negra': 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400',
  'portillo': 'https://images.unsplash.com/photo-1560148218-1a83060f7b32?w=400',
  'estancia': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
  'pato': 'https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400',
  'dada': 'https://images.unsplash.com/photo-1560148218-1a83060f7b32?w=400',
  'latitud': 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400',
  'san felipe': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
  'tramontina': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400',
  'los robles': 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
  'cofrade': 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400',
  'etchart': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
  'finca las moras': 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400',
  
  // Whiskys
  'whisky': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400',
  'old smuggler': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400',
  'dewar': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
  'johnnie walker': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
  'jack daniels': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400',
  'chivas': 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400',
  'ballantine': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400',
  
  // Gaseosas
  'coca': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
  'coca cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
  'pepsi': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400',
  'sprite': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
  'fanta': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
  '7up': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
  'paso de los toros': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
  'secco': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
  
  // Cervezas
  'quilmes': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'brahma': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'heineken': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'stella': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'corona': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'cerveza': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'budweiser': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'schneider': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'imperial': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  
  // Agua y jugos
  'agua': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
  'tonica': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
  'jugo': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
  'bc': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
  'cepita': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
  'ades': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
  
  // Aperitivos
  'aperitivo': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'fernet': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'campari': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'cinzano': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'gancia': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'aperol': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'martini': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  
  // Bebidas energéticas y otras
  'gatorade': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
  'powerade': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
  'speed': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
  'red bull': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
  'monster': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
};

const CATEGORY_IMAGES = {
  'vinos': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
  'cervezas': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'gaseosas': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
  'aperitivos': 'https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400',
  'jugos': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
  'aguas': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
  'whisky': 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400',
  'vinos tintos': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
  'vinos blancos': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400',
  'cervezas rubias': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
  'cervezas negras': 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400';

function findImageForProduct(product) {
  const name = product.nombre.toLowerCase();
  
  // Buscar coincidencia exacta o parcial en productos
  for (const [key, url] of Object.entries(PRODUCT_IMAGES)) {
    if (name.includes(key.toLowerCase())) {
      return url;
    }
  }
  
  // Buscar por categoría
  if (product.categoria) {
    const catName = typeof product.categoria === 'string' 
      ? product.categoria.toLowerCase()
      : (product.categoria.nombre || '').toLowerCase();
    
    for (const [key, url] of Object.entries(CATEGORY_IMAGES)) {
      if (catName.includes(key.toLowerCase())) {
        return url;
      }
    }
  }
  
  return DEFAULT_IMAGE;
}

async function main() {
  console.log('🚀 Iniciando actualización de imágenes de productos...');
  console.log('=' .repeat(60));
  
  if (!SUPABASE_SERVICE_KEY) {
    console.error('❌ Error: SUPABASE_SERVICE_KEY no está configurada');
    console.error('Por favor, ejecuta: set SUPABASE_SERVICE_KEY=tu_service_role_key');
    process.exit(1);
  }
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  console.log('✅ Conectado a Supabase');
  
  // Obtener productos
  console.log('\n📦 Obteniendo productos...');
  const { data: products, error } = await supabase
    .from('productos')
    .select('*, categoria:categorias(nombre)')
    .eq('activo', true);
  
  if (error) {
    console.error('❌ Error al obtener productos:', error.message);
    process.exit(1);
  }
  
  console.log(`   Encontrados ${products.length} productos`);
  
  // Filtrar productos sin imagen
  const productsWithoutImage = products.filter(p => !p.imagen_url);
  console.log(`   ${productsWithoutImage.length} productos sin imagen`);
  
  if (productsWithoutImage.length === 0) {
    console.log('\n✅ Todos los productos ya tienen imagen!');
    return;
  }
  
  // Mostrar productos sin imagen
  console.log('\n📋 Lista de productos sin imagen:');
  productsWithoutImage.slice(0, 20).forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.nombre} ($${p.precio})`);
  });
  
  if (productsWithoutImage.length > 20) {
    console.log(`   ... y ${productsWithoutImage.length - 20} más`);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Procesando actualizaciones...\n');
  
  let updated = 0;
  let failed = 0;
  
  for (const product of productsWithoutImage) {
    try {
      const imageUrl = findImageForProduct(product);
      
      const { error: updateError } = await supabase
        .from('productos')
        .update({ imagen_url: imageUrl })
        .eq('id', product.id);
      
      if (updateError) {
        console.log(`   ❌ ${product.nombre}: ${updateError.message}`);
        failed++;
      } else {
        console.log(`   ✅ ${product.nombre.slice(0, 40).padEnd(40)} -> Imagen asignada`);
        updated++;
      }
    } catch (err) {
      console.log(`   ❌ ${product.nombre}: ${err.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Resumen:');
  console.log(`   ✅ Actualizados: ${updated}`);
  console.log(`   ❌ Fallidos: ${failed}`);
  console.log('\n🎉 Proceso completado!');
}

main().catch(console.error);
