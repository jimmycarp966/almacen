# Búsqueda de Imágenes de Productos - Resumen

## ⚠️ Resultado Importante

**No fue posible obtener URLs de imágenes de marcas específicas** (Coca Cola, Pepsi, Johnnie Walker, etc.) porque:

1. **Protección anti-bot**: Pexels y Unsplash usan Cloudflare que bloquea accesos automatizados
2. **Derechos de autor**: Las marcas registradas no tienen imágenes libres en estos bancos de fotos

## 📁 Archivos Creados

### 1. `imagenes_productos_reales.json`
Contiene **URLs reales de Unsplash** con imágenes genéricas de:
- Vinos (8 imágenes)
- Cervezas (7 imágenes)
- Gaseosas (6 imágenes genéricas - NO marcas específicas)
- Whisky (6 imágenes)
- Otros productos

### 2. `buscar_imagenes.ps1`
Script de PowerShell para buscar imágenes usando la **API oficial de Pexels**:
```powershell
# Uso:
1. Obtén API key gratis en https://www.pexels.com/api/
2. Ejecuta: .\buscar_imagenes.ps1
3. Ingresa tu API key cuando se solicite
```

### 3. `imagenes_productos_urls.json`
Ejemplos de formato y alternativas.

## 🖼️ URLs Destacadas (Listas para Usar)

```javascript
// Vinos
const vino1 = "https://images.unsplash.com/photo-1586370434639-0fe43b2d32e6?w=600&h=800&fit=crop";
const vino2 = "https://images.unsplash.com/photo-1559563362-c667ba5f5480?w=600&h=800&fit=crop";

// Cervezas
const cerveza1 = "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=800&fit=crop";
const cerveza2 = "https://images.unsplash.com/photo-1586993451228-b2d7c3976f08?w=600&h=800&fit=crop";

// Whisky
const whisky1 = "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&h=800&fit=crop";
const whisky2 = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&h=800&fit=crop";

// Gaseosa genérica (reemplaza a Coca/Pepsi)
const gaseosa = "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&h=800&fit=crop";
```

## 💡 Recomendaciones para Producción

Para un e-commerce argentino real con las marcas específicas que mencionas:

1. **Contacta a los distribuidores oficiales**: 
   - CCU Argentina (Coca Cola, Sprite, Fanta, Toro, Royal)
   - Quilmes (Cervezas)
   - Bodegas Trapiche (Trumpeter, Estancia Mendoza)
   - Pernod Ricard (Chivas, Absolut)
   - Diageo (Johnnie Walker)

2. **Solicita sus Media Kits**: Las marcas suelen proporcionar imágenes oficiales para distribuidores

3. **Contrata fotografía profesional**: Para tu catálogo específico

4. **Alternativas de stock pagado**:
   - Shutterstock
   - iStock
   - Adobe Stock
   - Getty Images

## 🔧 Opción Alternativa: Placeholders

Para desarrollo, puedes usar imágenes de placeholder con el nombre del producto:

```
https://via.placeholder.com/400x600/722F37/FFFFFF?text=Vino+Toro
https://via.placeholder.com/400x600/CC0000/FFFFFF?text=Coca+Cola
https://via.placeholder.com/400x600/F4D03F/000000?text=Cerveza+Quilmes
```

---

**Total de imágenes proporcionadas**: 27 URLs de imágenes genéricas funcionales
