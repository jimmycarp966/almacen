# Resumen de Arquitectura - Super Aguilares

## 🎯 Objetivo
Proveer un sistema de ventas por catálogo premium con 100% de fidelidad a los diseños de Stitch.

## 🏗 Stack Tecnológico
- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS.
- **Backend:** Supabase (Auth, DB, Storage).
- **Estado:** Zustand.
- **Validación:** Zod.

## 📁 Estructura del Proyecto
- `src/app/admin`: Panel administrativo (Pedidos, Caja, Reportes, Configuración).
- `src/app/historial`: Historial de pedidos del cliente.
- `src/app/seguimiento/[id]`: Seguimiento en tiempo real con estética de Comprobante Digital.
- `src/app/identificacion`: Login por número de celular con redirección por rol.
- `src/actions`: Lógica de servidor (Server Actions) para interacción con Supabase.
- `src/components/layout`: Componentes estructurales (Navbar, Sidebar).
- `src/lib/mockData.ts`: Datos de prueba para desarrollo local.

## 🔒 Seguridad
- Row Level Security (RLS) habilitado en todas las tablas sensibles.
- Middleware para protección de rutas administrativas.
- Validación de esquemas con Zod en todas las entradas de datos.

## 🎨 Identidad Stitch
- **Fidelidad:** Se han adaptado 28 diseños de Stitch a componentes React/Tailwind.
- **Estética:** Uso de bordes troquelados para recibos, micro-animaciones y paleta de colores corporativa.

## 🧪 Usuarios de Prueba
- **Admin:** Teléfono `3814011673` → Redirige a `/admin`
- **Cliente:** Teléfono `3863502004` → Redirige a `/catalogo`

