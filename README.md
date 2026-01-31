# 🛒 Super Aguilares - Sistema de Supermercado Online

Sistema de e-commerce para supermercado argentino con catálogo de acceso libre y checkout vía WhatsApp.

## ✨ Características

- **Catálogo libre** - Sin autenticación para clientes
- **Checkout 4 pasos** - Productos → Entrega → Pago → Confirmar
- **WhatsApp integrado** - Pedidos enviados directamente al negocio
- **Opciones de entrega** - Domicilio ($500) o Retiro (gratis)
- **Panel admin protegido** - Acceso solo con número autorizado
- **Gestión de productos** - Activar/Inactivar, Editar precios, Eliminar
- **Sistema de ofertas** - Productos destacados en el catálogo
- **Diseño responsive** - Optimizado para móvil y desktop

## 🚀 Inicio Rápido

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) - Te llevará automáticamente al catálogo.

## 🔐 Acceso Admin

1. Ir a `/login`
2. Ingresar: `3814011673`
3. Acceder al panel en `/admin`

## 📱 Flujo de Compra

1. Explorar catálogo (sin login)
2. Agregar productos al carrito
3. Elegir tipo de entrega
4. Seleccionar método de pago (con recargos según tarjeta)
5. Finalizar → Se abre WhatsApp con el pedido

## 🛠 Gestión de Productos (Admin)

### Activar / Inactivar Producto
- Hacé clic en el botón **"Activo"** (verde) o **"Inactivo"** (rojo)
- Los productos **inactivos no son visibles** para los clientes en el catálogo
- Permite desactivar productos temporalmente sin eliminarlos

### Editar Precio
- Hacé clic en el ícono del **lápiz** ✏️
- Ingresá el nuevo precio
- Hacé clic en el **check** ✓ verde para guardar

### Eliminar Producto
- Hacé clic en el ícono del **bote de basura** 🗑️
- Confirmá la eliminación
- **Esta acción no se puede deshacer**

### Gestión de Ofertas
- Ir a `/admin/ofertas`
- Marcá los productos que querés que aparezcan destacados en el catálogo
- Los productos marcados se muestran en el banner rojo de "OFERTAS"

## 💳 Métodos de Pago y Recargos

| Método | 1 pago | 2 pagos | 3 pagos |
|--------|---------|----------|----------|
| Visión | 20% | 30% | 40% |
| Mastercard | 20% | 30% | 40% |
| Cabal | 20% | 30% | 40% |
| Credicash | 20% | - | - |
| Efectivo | Sin recargo | - | - |
| Transferencia | Sin recargo | - | - |
| Retiro en local | Sin recargo | - | - |

## 🛠 Stack Tecnológico

- **Next.js 15** (App Router)
- **React 19** + **Tailwind CSS**
- **Zustand** (Estado)
- **Zod** (Validación)

## 📄 Documentación

- [ARCHITECTURE_SUMMARY.md](./ARCHITECTURE_SUMMARY.md) - Resumen de arquitectura
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura detallada