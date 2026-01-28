# Resumen de Arquitectura - Super Aguilares

## 🎯 Objetivo
Proveer un sistema de supermercado online premium con catálogo de acceso libre y checkout vía WhatsApp, enfocado en el mercado argentino.

## 🏗 Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
- **Backend:** Supabase (DB, Storage) + Mock Data (Fallback).
- **Estado:** Zustand.
- **Validación:** Zod.
- **Testing:** Playwright (E2E).

## 📁 Estructura del Proyecto
- `src/app/admin`: Panel administrativo protegido (Dashboard, Pedidos, Productos, Caja, Reportes, Configuración).
- `src/app/catalogo`: Catálogo de productos con filtros por categoría (acceso libre).
- `src/app/carrito`: Checkout en 4 pasos con opciones de entrega y envío a WhatsApp.
- `src/app/login`: Login exclusivo para administradores.
- `src/app/page.tsx`: Redirección automática al catálogo.
- `src/lib/whatsapp.ts`: Utilidad para generar mensajes de WhatsApp formateados.
- `src/components/client`: Componentes de checkout (CheckoutSteps, DeliverySelector).
- `src/actions`: Server Actions para interacción con Supabase.

## 🔒 Seguridad
- Row Level Security (RLS) habilitado en tablas sensibles.
- Protección de rutas `/admin/*` por sesión de teléfono admin.
- Validación de esquemas con Zod en entradas de datos.
- Solo el número admin (`3814011673`) accede al panel.

## 🛒 Flujo de Compra
1. **Catálogo Libre:** Cliente accede sin autenticación
2. **Carrito:** Selecciona productos
3. **Checkout 4 Pasos:**
   - Paso 1: Revisar productos
   - Paso 2: Elegir entrega (Domicilio $500 / Retiro gratis)
   - Paso 3: Método de pago
   - Paso 4: Confirmar y enviar a WhatsApp

## 🎨 Identidad Stitch
- **Fidelidad:** Diseños Stitch adaptados a React/Tailwind.
- **Responsive:** Optimizado para móvil y desktop.
- **Modo:** Exclusivamente modo claro (sin dark mode).

## 📊 Módulos Implementados
- ✅ Catálogo de productos con filtros por categoría
- ✅ Checkout multi-paso responsive
- ✅ Selector de tipo de entrega (domicilio/retiro)
- ✅ Integración WhatsApp para envío de pedidos
- ✅ Panel admin completo y responsive
- ✅ Dashboard admin con estadísticas

## 🧪 Acceso Admin
- **Ruta:** `/login`
- **Teléfono:** `3814011673` → Redirige a `/admin`

## 🚀 Estado Actual
- **Compilación:** Exitosa sin errores
- **Build:** Next.js 15.1.4 - 36 páginas estáticas
- **Deploy:** Repositorio en GitHub
- **UI:** Responsive, modo claro exclusivo

## 🔧 Cambios Recientes (Ene 2026)
- **Asociación de Imágenes Reales (Ene 2026):**
  - Integración de 15 fotos reales de productos clave vía VtexAssets y Wikimedia.
  - Mejora en `ProductosTable.tsx` con previsualización ampliada y edición de URL optimizada.
- **Sistema de Pagos Renovado:**
  - Eliminado pago en efectivo
  - 7 tarjetas de crédito con recargos: Visa, Mastercard, Cabal, Maestro, Naranja, Zeta, Credicash
  - 3 métodos sin recargo: Transferencia/QR, Débito, Tarjeta Alimentar
  - Pago al momento de la entrega con posnet
- **Catálogo Mejorado:**
  - Sección "Ofertas de la Semana" con 10 productos destacados
  - Imágenes de productos más compactas (grid 4-5 columnas)
  - Banner de confianza verde
- **Mensajes de Confianza:**
  - "Pagás cuando recibís y controlás tu pedido" en navbar, checkout y WhatsApp
- WhatsApp: 3865572025
- Panel admin responsive con sidebar colapsable

