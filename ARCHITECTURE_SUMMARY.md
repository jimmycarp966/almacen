# Resumen de Arquitectura - Super Aguilares

## 🎯 Objetivo
Proveer un sistema de supermercado online premium con 100% de fidelidad a los diseños de Stitch, enfocado en el mercado argentino.

## 🏗 Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
- **Backend:** Supabase (Auth, DB, Storage) + Mock Data (Desarrollo).
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

## 🛒 Datos Mock (Supermercado Argentino)
### Categorías (6)
- Alimentos, Lácteos, Carnes, Bebidas, Panadería, Limpieza

### Productos (10 productos)
- Arroz Gallo Oro 1kg - $1.500
- Fideos Matarazzo 500g - $1.200
- Yerba Mate Playadito 500g - $3.500 (con descuento)
- Leche La Serenísima 1L - $1.000
- Carne Vacuna 1kg - $12.000
- Coca-Cola 2.25L - $2.000
- Pan Casero 1kg - $1.500
- Aceite Natura 1L - $2.500
- Azúcar Ledesma 1kg - $1.800
- Detergente Magistral 1L - $2.200

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
- ✅ Mock data de supermercado argentino

## 🚀 Estado Actual
- **Compilación:** Exitosa sin errores
- **Tests E2E:** Plan completado y ejecutado con Playwright
- **Deploy:** Repositorio en GitHub (https://github.com/jimmycarp966/almacen.git)
- **Datos:** Mock data actualizado para supermercado argentino
- **UI:** Modo claro exclusivo, sin dark mode

