# Arquitectura del Sistema: Super Aguilares - Sistema de Supermercado Argentino

Este documento describe la arquitectura, reglas y estándares para el desarrollo del sistema de supermercado online "Super Aguilares".

## 🚀 Resumen Técnico
El sistema es una aplicación web moderna construida con **Next.js 15** (App Router) y **React 19**, utilizando **Supabase** como backend-as-a-service.

| Capa | Tecnología |
|---|---|
| **Vistas/UI** | React 19 + Tailwind CSS + shadcn/ui |
| **Lógica de Negocio** | Next.js Server Actions (Patrón "use server") |
| **Persistencia** | Supabase (PostgreSQL) + Mock Data (Desarrollo) |
| **Seguridad** | Row Level Security (RLS) en Supabase |
| **Estado Cliente** | Zustand (Sesión, Carrito) |
| **Validación** | Zod (Schema Validation) |

## 📐 Reglas Fundamentales (Mandatorias)
1. **Prioridad de Diseño (Regla #0):** Antes de crear cualquier componente UI, se DEBE revisar la carpeta `/stitch_seguimiento_de_pedido_cliente/`. Estos componentes (HTML/CSS) deben ser adaptados a React/Tailwind manteniendo la estética exacta.
2. **Depuración Estratégica:** No aplicar cambios sin formular hipótesis y verificar con logs.
3. **Flujo de Datos:** UI -> Server Action -> Zod Validation -> Supabase RPC/Operation -> RevalidatePath.
4. **Seguridad RLS:** Ninguna tabla es accesible sin políticas RLS configuradas correctamente.
5. **Modo Claro:** El sistema opera exclusivamente en modo claro. No se permite dark mode en ningún componente.

## 📊 Estructura de Datos
El sistema utiliza las siguientes tablas principales:
- `usuarios`: Gestión de perfiles y roles (admin, cliente).
- `categorias`: Categorías de productos (Alimentos, Lácteos, Carnes, Bebidas, Panadería, Limpieza).
- `productos`: Catálogo dinámico con precios en pesos argentinos.
- `pedidos` y `pedido_items`: Gestión de transacciones de venta.
- `caja_diaria` y `caja_movimientos`: Control financiero del negocio.
- `configuracion`: Almacenamiento de metadatos del negocio (WhatsApp, CBU).

## 🛒 Datos Mock (Desarrollo)
Para desarrollo local, el sistema utiliza datos mock de un supermercado argentino típico:

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

## 🧩 Módulos Implementados
- **Catálogo de Productos:** Navegación por categorías con filtros.
- **Carrito de Compras:** Gestión de productos con cálculo de totales.
- **Checkout:** Proceso de compra con dirección de entrega y método de pago.
- **Seguimiento de Pedidos:** Vista de cliente con timeline de estado.
- **Historial de Pedidos:** Vista de cliente para seguimiento histórico de compras.
- **Panel Admin:**
  - Dashboard con métricas clave
  - Gestión de pedidos (cambio de estado)
  - Gestión de productos (CRUD)
  - Caja diaria (ingresos/egresos)
  - Reportes de ventas
  - Configuración del negocio
- **Recibo Digital:** Transformación visual de la vista de seguimiento en un comprobante troquelado premium.

## 🎨 Estándares de UI/UX
- **Paleta de Colores:** Basada en Stitch (Blanco, Negro, Rojo #FF0000, Grises).
- **Tipografía:** Inter/System-ui.
- **Modo:** Exclusivamente modo claro (sin dark mode).
- **Estados de Carga:** Obligatorio el uso de Skeleton screens o spinners en botones.
- **Feedback:** Notificaciones (toasts) para todas las operaciones críticas.
- **Formato de Precios:** Pesos argentinos con formato local (ej: $1.500).

## 🛠 Proceso de Desarrollo
1. **Stitch -> React:** Convertir el diseño estático de la carpeta de referencia en componentes funcionales.
2. **Server Actions:** Toda interacción con la DB debe pasar por Server Actions validados.
3. **Transacciones:** Operaciones que afectan múltiples tablas (ej: crear pedido) deben ejecutarse mediante funciones de base de datos (`rpc`).
4. **Mock Data:** Utilizar datos mock para desarrollo local antes de conectar con Supabase.

## 🧪 Usuarios de Prueba
- **Admin:** Teléfono `3814011673` → Redirige a `/admin`
- **Cliente:** Teléfono `3863502004` → Redirige a `/catalogo`

## 📦 Estructura del Proyecto
```
src/
├── app/
│   ├── admin/              # Panel administrativo
│   ├── catalogo/           # Catálogo de productos
│   ├── carrito/            # Carrito de compras
│   ├── seguimiento/[id]/   # Seguimiento de pedidos
│   ├── historial/          # Historial de pedidos
│   └── page.tsx            # Login por teléfono
├── actions/                # Server Actions
├── components/             # Componentes reutilizables
├── lib/                    # Utilidades y mock data
└── store/                  # Zustand stores
```
