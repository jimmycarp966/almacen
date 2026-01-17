# Plan de Implementación de Funcionalidades - Super Aguilares

Este plan detalla la implementación de nuevas funcionalidades para mejorar el sistema de supermercado online, incluyendo notificaciones en tiempo real, gestión de inventario, optimización de rendimiento, búsqueda avanzada, favoritos y análisis de ventas.

## Fase 1: Sistema de Notificaciones en Tiempo Real

### 1.1 Configuración de Supabase Realtime
- Instalar dependencias: `@supabase/realtime-js`
- Configurar canales de Realtime en Supabase
- Crear tabla `notificaciones` en Supabase
- Implementar suscripción a cambios en `pedidos`

**Archivos a crear/modificar:**
- `src/lib/realtime.ts` - Configuración de Realtime
- `src/hooks/useRealtimeOrders.ts` - Hook para suscripciones
- `src/components/notifications/OrderNotification.tsx` - Componente de notificación
- `src/app/admin/page.tsx` - Agregar notificaciones de nuevos pedidos
- `src/app/seguimiento/[id]/page.tsx` - Notificaciones de cambios de estado

### 1.2 Notificaciones Push para Clientes
- Integrar Service Worker para notificaciones push
- Solicitar permisos de notificación
- Enviar notificaciones cuando el pedido cambia de estado
- Sonido de notificación personalizado

**Archivos a crear/modificar:**
- `public/sw.js` - Service Worker
- `src/lib/notifications.ts` - Utilidades de notificaciones
- `src/app/layout.tsx` - Solicitar permisos de notificación

## Fase 2: Gestión de Inventario

### 2.1 Alertas de Stock Bajo
- Agregar campo `stock_minimo` a productos
- Crear sistema de alertas automáticas
- Mostrar alertas en dashboard admin
- Notificaciones push cuando stock baja

**Archivos a crear/modificar:**
- `src/actions/inventory.ts` - Server Actions para inventario
- `src/components/admin/StockAlerts.tsx` - Componente de alertas
- `src/app/admin/page.tsx` - Agregar alertas de stock
- `src/lib/mockData.ts` - Agregar `stock_minimo` a productos

### 2.2 Historial de Movimientos de Inventario
- Crear tabla `movimientos_inventario` en Supabase
- Tipos de movimientos: entrada, salida, ajuste
- Registrar cada cambio de stock
- Vista de historial en admin

**Archivos a crear/modificar:**
- `src/app/admin/inventario/historial/page.tsx` - Página de historial
- `src/actions/inventory.ts` - Registrar movimientos
- `src/lib/mockData.ts` - Agregar `mockMovimientosInventario`

## Fase 3: Optimización de Rendimiento

### 3.1 ISR para Catálogo
- Configurar revalidate en `getProductos`
- Implementar revalidación on-demand
- Caching inteligente por categoría
- Actualización automática de precios

**Archivos a crear/modificar:**
- `src/actions/catalog.ts` - Agregar revalidate
- `src/app/catalogo/page.tsx` - Configurar ISR
- `src/app/api/revalidate/route.ts` - API de revalidación

### 3.2 Lazy Loading de Imágenes
- Usar `next/image` con lazy loading
- Implementar placeholder blur
- Optimización de imágenes
- Carga progresiva

**Archivos a crear/modificar:**
- `src/components/client/OptimizedImage.tsx` - Componente optimizado
- `src/components/client/ProductCard.tsx` - Usar OptimizedImage
- `next.config.ts` - Configurar dominios de imágenes

### 3.3 Caching Inteligente
- Implementar SWR para datos
- Caching de categorías
- Cache de productos por ID
- Invalidación de cache inteligente

**Archivos a crear/modificar:**
- `src/hooks/useProducts.ts` - Hook con SWR
- `src/hooks/useCategories.ts` - Hook con SWR
- `src/lib/cache.ts` - Utilidades de cache

## Fase 4: Búsqueda y Filtros Avanzados

### 4.1 Búsqueda por Nombre
- Campo de búsqueda en catálogo
- Búsqueda en tiempo real
- Debounce de búsqueda
- Resaltado de resultados

**Archivos a crear/modificar:**
- `src/components/catalog/SearchBar.tsx` - Componente de búsqueda
- `src/app/catalogo/page.tsx` - Integrar búsqueda
- `src/actions/catalog.ts` - Agregar `searchProductos`

### 4.2 Filtros Avanzados
- Filtro por precio (rango)
- Filtro por disponibilidad
- Filtro por categoría múltiple
- Ordenamiento (precio, nombre, popularidad)

**Archivos a crear/modificar:**
- `src/components/catalog/FilterPanel.tsx` - Panel de filtros
- `src/components/catalog/PriceRange.tsx` - Filtro de precio
- `src/app/catalogo/page.tsx` - Integrar filtros
- `src/actions/catalog.ts` - Agregar lógica de filtrado

## Fase 5: Carrito Persistente (Ya Implementado)

### 5.1 Verificación y Mejoras
- ✅ Ya implementado con Zustand persist
- Agregar sincronización con backend
- Merge de carritos local y remoto
- Manejo de conflictos

**Archivos a crear/modificar:**
- `src/store/cartStore.ts` - Agregar sync con backend
- `src/actions/cart.ts` - Server Actions para carrito
- `src/app/carrito/page.tsx` - Sincronizar al cargar

## Fase 6: Favoritos y Listas Recurrentes

### 6.1 Productos Favoritos
- Crear tabla `favoritos` en Supabase
- Botón de favorito en ProductCard
- Página de favoritos
- Persistencia de favoritos

**Archivos a crear/modificar:**
- `src/store/favoritesStore.ts` - Store de favoritos
- `src/actions/favorites.ts` - Server Actions
- `src/components/client/FavoriteButton.tsx` - Botón de favorito
- `src/app/favoritos/page.tsx` - Página de favoritos

### 6.2 Listas de Compras Recurrentes
- Crear tabla `listas_compras` en Supabase
- Crear listas personalizadas
- Agregar productos a lista
- Cargar lista en carrito

**Archivos a crear/modificar:**
- `src/app/listas/page.tsx` - Página de listas
- `src/components/shopping/ShoppingList.tsx` - Componente de lista
- `src/actions/shoppingLists.ts` - Server Actions
- `src/lib/mockData.ts` - Agregar `mockListasCompras`

### 6.3 Productos Frecuentes
- Rastrear productos más comprados
- Mostrar en dashboard cliente
- Acceso rápido desde catálogo
- Recomendaciones

**Archivos a crear/modificar:**
- `src/actions/analytics.ts` - Analytics de compras
- `src/components/client/FrequentProducts.tsx` - Componente
- `src/app/catalogo/page.tsx` - Mostrar productos frecuentes

## Fase 7: Análisis de Ventas y Métricas

### 7.1 Análisis de Ventas por Período
- Gráficos de ventas (diario, semanal, mensual)
- Comparación con período anterior
- Tendencias de ventas
- Exportación de datos

**Archivos a crear/modificar:**
- `src/app/admin/reportes/page.tsx` - Agregar gráficos
- `src/components/admin/SalesChart.tsx` - Gráfico de ventas
- `src/actions/reports.ts` - Agregar análisis avanzado
- `src/lib/mockData.ts` - Agregar datos de análisis

### 7.2 Productos Más Vendidos
- Ranking de productos
- Ventas por producto
- Categorías más populares
- Productos en tendencia

**Archivos a crear/modificar:**
- `src/components/admin/TopProducts.tsx` - Componente
- `src/actions/reports.ts` - Agregar top productos
- `src/app/admin/reportes/page.tsx` - Mostrar ranking

### 7.3 Clientes Frecuentes
- Lista de clientes recurrentes
- Valor de vida del cliente (LTV)
- Frecuencia de compra
- Ticket promedio por cliente

**Archivos a crear/modificar:**
- `src/app/admin/clientes/page.tsx` - Página de clientes
- `src/components/admin/CustomerTable.tsx` - Tabla de clientes
- `src/actions/customers.ts` - Server Actions
- `src/lib/mockData.ts` - Agregar `mockClientesFrecuentes`

### 7.4 Métricas de Conversión
- Tasa de conversión
- Carritos abandonados
- Tiempo en catálogo
- Funnel de conversión

**Archivos a crear/modificar:**
- `src/components/admin/ConversionMetrics.tsx` - Métricas
- `src/actions/analytics.ts` - Analytics de conversión
- `src/app/admin/reportes/page.tsx` - Mostrar métricas

## Fase 8: Optimización Móvil

### 8.1 Responsive Design Mejorado
- Touch targets más grandes (min 44px)
- Menú hamburguesa móvil
- Navegación por gestos
- Optimización de scroll

**Archivos a crear/modificar:**
- `src/components/layout/MobileNav.tsx` - Navegación móvil
- `src/components/layout/MobileMenu.tsx` - Menú móvil
- `src/app/catalogo/page.tsx` - Optimizar para móvil
- `tailwind.config.ts` - Agregar breakpoints móviles

### 8.2 PWA Features
- Manifest.json para instalación
- Iconos de app
- Splash screen
- Modo offline básico

**Archivos a crear/modificar:**
- `public/manifest.json` - Manifest de PWA
- `public/icons/` - Iconos de app
- `public/sw.js` - Service Worker mejorado
- `src/app/layout.tsx` - Agregar meta tags PWA

### 8.3 Optimización de Performance Móvil
- Reducir bundle size
- Lazy loading de componentes
- Optimizar imágenes para móvil
- Reducir re-renders

**Archivos a crear/modificar:**
- `next.config.ts` - Optimizaciones de build
- `src/components/client/ProductCard.tsx` - Lazy load
- `src/app/catalogo/page.tsx` - Virtual scrolling
- `package.json` - Agregar dependencias de optimización

## Orden de Implementación Recomendado

**Sprint 1 (Prioridad Alta):**
1. Fase 1: Sistema de Notificaciones
2. Fase 4: Búsqueda y Filtros
3. Fase 8.1: Optimización Móvil Básica

**Sprint 2 (Prioridad Media):**
4. Fase 2: Gestión de Inventario
5. Fase 6: Favoritos y Listas
6. Fase 3.1: ISR para Catálogo

**Sprint 3 (Prioridad Media):**
7. Fase 7: Análisis de Ventas
8. Fase 3.2: Lazy Loading
9. Fase 5: Mejoras de Carrito

**Sprint 4 (Prioridad Baja):**
10. Fase 3.3: Caching Inteligente
11. Fase 8.2: PWA Features
12. Fase 8.3: Optimización Avanzada

## Dependencias a Instalar

```bash
npm install @supabase/realtime-js swr recharts date-fns
npm install -D @types/node
```

## Notas Importantes

- El carrito ya está persistente con Zustand, solo necesita mejoras
- Usar datos mock durante desarrollo
- Implementar tests para cada funcionalidad
- Documentar cambios en ARCHITECTURE.md
- Mantener consistencia con diseños Stitch
- Priorizar mobile-first en todas las implementaciones
