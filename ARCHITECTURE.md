# Arquitectura del Sistema: Sistema de Ventas por Catálogo

Este documento describe la arquitectura, reglas y estándares para el desarrollo del sistema de ventas por catálogo para "Super Aguilares".

## 🚀 Resumen Técnico
El sistema es una aplicación web moderna construida con **Next.js 15** (App Router) y **React 19**, utilizando **Supabase** como backend-as-a-service.

| Capa | Tecnología |
|---|---|
| **Vistas/UI** | React 19 + Tailwind CSS + shadcn/ui |
| **Lógica de Negocio** | Next.js Server Actions (Patrón "use server") |
| **Persistencia** | Supabase (PostgreSQL) |
| **Seguridad** | Row Level Security (RLS) en Supabase |
| **Estado Cliente** | Zustand (Sesión, Carrito) |

## 📐 Reglas Fundamentales (Mandatorias)
1. **Prioridad de Diseño (Regla #0):** Antes de crear cualquier componente UI, se DEBE revisar la carpeta `/stitch_seguimiento_de_pedido_cliente/`. Estos componentes (HTML/CSS) deben ser adaptados a React/Tailwind manteniendo la estética exacta.
2. **Depuración Estratégica:** No aplicar cambios sin formular hipótesis y verificar con logs.
3. **Flujo de Datos:** UI -> Server Action -> Zod Validation -> Supabase RPC/Operation -> RevalidatePath.
4. **Seguridad RLS:** Ninguna tabla es accesible sin políticas RLS configuradas correctamente.

## 📊 Estructura de Datos
El sistema utiliza las siguientes tablas principales:
- `usuarios`: Gestión de perfiles y roles (admin, cliente).
- `categorias` y `productos`: Catálogo dinámico.
- `pedidos` y `pedido_items`: Gestión de transacciones de venta.
- `caja_diaria` y `caja_movimientos`: Control financiero del negocio.
- `configuracion`: (Propuesto) Almacenamiento de metadatos del negocio (WhatsApp, CBU).

## 🧩 Módulos Implementados (Post-Auditoría Stitch)
- **Historial de Pedidos:** Vista de cliente para seguimiento histórico de compras.
- **Configuración Admin:** Panel para gestionar identidad visual y datos de contacto.
- **Recibo Digital:** Transformación visual de la vista de seguimiento en un comprobante troquelado premium.

## 🎨 Estándares de UI/UX
- **Paleta de Colores:** Basada en Stitch (Blanco, Negro, Rojo #FF0000, Grises).
- **Tipografía:** Inter/System-ui.
- **Estados de Carga:** Obligatorio el uso de Skeleton screens o spinners en botones.
- **Feedback:** Notificaciones (toasts) para todas las operaciones críticas.

## 🛠 Proceso de Desarrollo
1. **Stitch -> React:** Convertir el diseño estático de la carpeta de referencia en componentes funcionales.
2. **Server Actions:** Toda interacción con la DB debe pasar por Server Actions validados.
3. **Transacciones:** Operaciones que afectan múltiples tablas (ej: crear pedido) deben ejecutarse mediante funciones de base de datos (`rpc`).
