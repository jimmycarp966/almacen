#!/usr/bin/env python3
"""
Script para actualizar imágenes de productos en Supabase.
Busca imágenes de productos genéricos y actualiza la base de datos.
"""

import os
import sys
import json
import requests
from supabase import create_client, Client

# Cargar variables de entorno
SUPABASE_URL = "https://guayzrzbqkvqtxoiotwo.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

def get_supabase_client():
    """Crear cliente de Supabase con service role key."""
    if not SUPABASE_SERVICE_KEY:
        print("❌ Error: SUPABASE_SERVICE_KEY no está configurada")
        print("Por favor, establece la variable de entorno SUPABASE_SERVICE_KEY")
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def get_all_products(supabase: Client):
    """Obtener todos los productos de la base de datos."""
    response = supabase.table("productos").select("*").execute()
    return response.data

def search_product_image(product_name: str, category: str = ""):
    """
    Buscar imagen de producto usando búsqueda en DuckDuckGo o Unsplash.
    Retorna URL de imagen genérica según el tipo de producto.
    """
    # Mapeo de productos comunes a imágenes de placeholder o genéricas
    product_images = {
        # Vinos
        "vino": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        "toro": "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400",
        "nativo": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400",
        "cava": "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=400",
        "portillo": "https://images.unsplash.com/photo-1560148218-1a83060f7b32?w=400",
        "estancia": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
        "pato": "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400",
        
        # Whisky
        "whisky": "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400",
        "old smuggler": "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400",
        "dewar": "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400",
        
        # Gaseosas
        "coca": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
        "pepsi": "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400",
        "sprite": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
        "fanta": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
        "7up": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
        "paso": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
        
        # Cervezas
        "quilmes": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "brahma": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "heineken": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "stella": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "corona": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "beer": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "cerveza": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        
        # Agua y jugos
        "agua": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
        "tonica": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
        "jugo": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
        "jugo": "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400",
        
        # Aperitivos
        "aperitivo": "https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400",
        "fernet": "https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400",
        "campari": "https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400",
        "cinzano": "https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400",
        "gancia": "https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400",
        
        # Otros
        "gatorade": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
        "powerade": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
        "speed": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
        "red bull": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400",
    }
    
    # Buscar coincidencia parcial
    product_lower = product_name.lower()
    for key, url in product_images.items():
        if key in product_lower:
            return url
    
    # Imagen genérica por categoría
    category_images = {
        "vinos": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400",
        "cervezas": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400",
        "gaseosas": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400",
        "aperitivos": "https://images.unsplash.com/photo-1560512823-8f9e758e3739?w=400",
        "jugos": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
        "aguas": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400",
        "whisky": "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400",
    }
    
    if category:
        category_lower = category.lower()
        for key, url in category_images.items():
            if key in category_lower:
                return url
    
    # Imagen genérica
    return "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400"

def update_product_image(supabase: Client, product_id: str, image_url: str):
    """Actualizar la imagen de un producto."""
    response = supabase.table("productos").update({
        "imagen_url": image_url
    }).eq("id", product_id).execute()
    return response

def main():
    print("🚀 Iniciando actualización de imágenes de productos...")
    print("=" * 60)
    
    # Crear cliente Supabase
    supabase = get_supabase_client()
    print("✅ Conectado a Supabase")
    
    # Obtener todos los productos
    print("\n📦 Obteniendo productos...")
    products = get_all_products(supabase)
    print(f"   Encontrados {len(products)} productos")
    
    # Mostrar productos sin imagen
    products_without_image = [p for p in products if not p.get("imagen_url")]
    print(f"   {len(products_without_image)} productos sin imagen")
    
    if not products_without_image:
        print("\n✅ Todos los productos ya tienen imagen!")
        return
    
    # Listar productos
    print("\n📋 Lista de productos sin imagen:")
    for i, product in enumerate(products_without_image[:20], 1):  # Mostrar primeros 20
        print(f"   {i}. {product['nombre']} (${product['precio']})")
    
    if len(products_without_image) > 20:
        print(f"   ... y {len(products_without_image) - 20} más")
    
    # Preguntar si continuar
    print("\n" + "=" * 60)
    response = input("¿Deseas actualizar las imágenes de estos productos? (s/n): ")
    
    if response.lower() != 's':
        print("❌ Operación cancelada")
        return
    
    # Actualizar imágenes
    print("\n🔄 Actualizando imágenes...")
    updated = 0
    failed = 0
    
    for product in products_without_image:
        try:
            # Buscar imagen apropiada
            image_url = search_product_image(product['nombre'], product.get('categoria', ''))
            
            # Actualizar en base de datos
            update_product_image(supabase, product['id'], image_url)
            
            print(f"   ✅ {product['nombre'][:40]:<40} -> {image_url[:50]}...")
            updated += 1
            
        except Exception as e:
            print(f"   ❌ Error con {product['nombre']}: {e}")
            failed += 1
    
    print("\n" + "=" * 60)
    print("📊 Resumen:")
    print(f"   ✅ Actualizados: {updated}")
    print(f"   ❌ Fallidos: {failed}")
    print("\n🎉 Proceso completado!")

if __name__ == "__main__":
    main()
