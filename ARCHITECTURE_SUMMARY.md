# Resumen de Arquitectura - Super Aguilares

## 🎯 Objetivo
Proveer un sistema de supermercado online premium con 100% de fidelidad a los diseños de Stitch, enfocado en el mercado argentino.

## 🏗 Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
- **Backend:** Supabase (Auth, DB, Storage) + Mock Data (Fallback).
- **Estado:** Zustand.
- **Validación:** Zod.
- **Testing:** Playwright (E2E).

## 📁 Estructura del Proyecto
- `src/app/admin`: Panel administrativo (Dashboard, Pedidos, Productos, Caja, Reportes, Configuración).
- `src/app/catalogo`: Catálogo de productos con filtros por categoría.
- `src/app/carrito`: Carrito de compras con cálculo de totales.
- `src/app/seguimiento/[id]`: Seguimiento en tiempo real con estética de Comprobante Digital.
- `src/app/historial`: Historial de pedidos del cliente.
- `src/app/page.tsx`: Login por número de celular con redirección por rol.
- `src/actions`: Lógica de servidor (Server Actions) para interacción con Supabase.
- `src/components/layout`: Componentes estructurales (Navbar, Sidebar).
- `src/lib/mockData.ts`: Datos de prueba para desarrollo local (supermercado argentino).

## 🔒 Seguridad
- Row Level Security (RLS) habilitado en todas las tablas sensibles.
- Middleware para protección de rutas administrativas.
- Validación de esquemas con Zod en todas las entradas de datos.
- Autenticación por número de teléfono.

## 🎨 Identidad Stitch
- **Fidelidad:** Se han adaptado 28 diseños de Stitch a componentes React/Tailwind.
- **Estética:** Uso de bordes troquelados para recibos, micro-animaciones y paleta de colores corporativa.
- **Modo:** Exclusivamente modo claro (sin dark mode).

## 🛒 Catálogo de Productos
- **Datos:** Conexión a Supabase con fallback automático a datos mock.
- **Imágenes:** Soporte para imágenes de Supabase Storage + fallback a Unsplash.
- **Categorías:** 6 categorías (Alimentos, Lácteos, Carnes, Bebidas, Panadería, Limpieza).
- **Visualización:** CSS backgroundImage para mejor compatibilidad.

## 🧪 Usuarios de Prueba
- **Admin:** Teléfono `3814011673` → Redirige a `/admin`
- **Cliente:** Teléfono `3863502004` → Redirige a `/catalogo`

## 📊 Módulos Implementados
- ✅ Catálogo de productos con filtros por categoría
- ✅ Carrito lateral siempre visible (desktop) + FAB (móvil)
- ✅ Checkout con dirección de entrega y método de pago
- ✅ Seguimiento de pedidos con timeline
- ✅ Historial de pedidos del cliente
- ✅ Panel admin completo (Dashboard con datos mock, Pedidos, Productos, Caja, Reportes, Configuración)
- ✅ Dashboard admin con pedidos recientes, productos más vendidos y gráfico de ventas
- ✅ Recibo digital con diseño premium
- ✅ Sistema de autenticación por teléfono
- ✅ Logout funcional en admin y cliente
- ✅ Imágenes con fallback automático

## 🚀 Estado Actual
- **Compilación:** Exitosa sin errores
- **Build:** Next.js 15.1.4 - 36 páginas estáticas
- **Tests E2E:** Plan completado y ejecutado con Playwright
- **Deploy:** Repositorio en GitHub (https://github.com/jimmycarp966/almacen.git)
- **Datos:** Supabase con fallback a mock data argentino
- **UI:** Modo claro exclusivo, sin dark mode
- **Estado:** En producción

## 🔧 Cambios Recientes (Ene 2026)
- Corregido botón de logout en panel admin
- Corregido botón de logout en navbar cliente
- Catálogo conectado a Supabase con fallback a mock
- Imágenes usando CSS backgroundImage para mejor compatibilidad
- Configuración de dominios permitidos en Next.js para Supabase

