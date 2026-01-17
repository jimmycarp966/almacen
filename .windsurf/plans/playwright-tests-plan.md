# Plan de Pruebas End-to-End con Playwright

Este plan describe las pruebas automatizadas que se ejecutarán con Playwright para verificar el flujo completo del sistema Super Aguilares.

## Usuarios de Prueba
- **Admin**: 3814011673
- **Cliente**: 3863502004

## Flujo del Sistema

### 1. Flujo de Login
- Usuario ingresa número de teléfono
- Si es 3814011673 → Admin → redirige a /admin
- Si es cualquier otro número → Cliente → redirige a /catalogo

### 2. Flujo de Cliente
- Login → Catálogo (/catalogo)
- Catálogo muestra productos con categorías
- Agregar productos al carrito (usando CartFAB)
- Carrito (/carrito) → Finalizar compra
- Checkout → Ingresar dirección, método de pago, cuotas
- Confirmar pedido → Redirige a seguimiento/[id]
- Seguimiento (/seguimiento/[id]) → Ver estado del pedido
- Historial (/historial) → Ver pedidos anteriores

### 3. Flujo de Admin
- Login → Dashboard (/admin)
- Dashboard → Ver estadísticas
- Pedidos (/admin/pedidos) → Ver y gestionar pedidos
- Productos (/admin/productos) → Ver y gestionar productos
- Caja (/admin/caja) → Gestionar caja diaria
- Reportes (/admin/reportes) → Ver reportes de ventas
- Configuración (/admin/configuracion) → Configurar negocio

## Pruebas a Ejecutar

### Prueba 1: Login como Admin
1. Navegar a http://localhost:3002
2. Ingresar número de teléfono: 3814011673
3. Click en "Ingresar"
4. Verificar redirección a /admin
5. Verificar que se muestra el panel de administración

### Prueba 2: Login como Cliente
1. Navegar a http://localhost:3002
2. Ingresar número de teléfono: 3863502004
3. Click en "Ingresar"
4. Verificar redirección a /catalogo
5. Verificar que se muestra el catálogo de productos

### Prueba 3: Navegación del Catálogo
1. Login como cliente
2. Verificar que se muestran todas las categorías
3. Click en una categoría específica
4. Verificar que se filtran los productos por categoría
5. Click en "Todos los Productos"
6. Verificar que se muestran todos los productos

### Prueba 4: Agregar Producto al Carrito
1. Login como cliente
2. Click en botón "Agregar" de un producto
3. Verificar que el contador del carrito se incrementa
4. Click en el botón flotante del carrito
5. Verificar redirección a /carrito
6. Verificar que el producto aparece en el carrito

### Prueba 5: Finalizar Compra con Efectivo
1. Login como cliente
2. Agregar un producto al carrito
3. Navegar a /carrito
4. Ingresar dirección de entrega
5. Seleccionar método de pago: efectivo
6. Click en "Confirmar Pedido"
7. Verificar redirección a /seguimiento/[id]
8. Verificar que el estado del pedido es "recibido"

### Prueba 6: Finalizar Compra con Tarjeta
1. Login como cliente
2. Agregar un producto al carrito
3. Navegar a /carrito
4. Ingresar dirección de entrega
5. Seleccionar método de pago: tarjeta
6. Seleccionar cuotas: 3
7. Verificar que se calcula el recargo correctamente
8. Click en "Confirmar Pedido"
9. Verificar redirección a /seguimiento/[id]

### Prueba 7: Seguimiento de Pedido
1. Login como cliente
2. Navegar a /seguimiento/1
3. Verificar que se muestra el timeline de estados
4. Verificar que se muestran los detalles del pedido
5. Verificar que se muestra el total pagado
6. Verificar que se muestra el método de pago
7. Verificar que se muestra la dirección de entrega

### Prueba 8: Historial de Pedidos
1. Login como cliente
2. Navegar a /historial
3. Verificar que se muestran los pedidos del cliente
4. Click en "Ver Detalle" de un pedido
5. Verificar redirección a /seguimiento/[id]

### Prueba 9: Dashboard de Admin
1. Login como admin
2. Verificar que se muestran las estadísticas
3. Verificar que se muestran los pedidos recientes
4. Verificar que se muestran las acciones rápidas

### Prueba 10: Gestión de Pedidos (Admin)
1. Login como admin
2. Navegar a /admin/pedidos
3. Verificar que se muestran todos los pedidos
4. Click en un pedido
5. Verificar que se muestran los detalles del pedido
6. Cambiar estado del pedido
7. Verificar que el estado se actualiza

### Prueba 11: Gestión de Productos (Admin)
1. Login como admin
2. Navegar a /admin/productos
3. Verificar que se muestran todos los productos
4. Click en "Agregar Producto"
5. Verificar que se muestra el formulario de agregar producto

### Prueba 12: Caja Diaria (Admin)
1. Login como admin
2. Navegar a /admin/caja
3. Verificar que se muestra el estado de la caja
4. Verificar que se muestran los ingresos y egresos

### Prueba 13: Reportes de Ventas (Admin)
1. Login como admin
2. Navegar a /admin/reportes
3. Verificar que se muestran los reportes diarios
4. Verificar que se muestran los reportes por categoría

### Prueba 14: Configuración (Admin)
1. Login como admin
2. Navegar a /admin/configuracion
3. Verificar que se muestra el formulario de configuración
4. Verificar que se pueden actualizar los datos del negocio

## Resultados Esperados
- Todas las pruebas deben pasar exitosamente
- El sistema debe funcionar sin errores
- La navegación debe ser fluida
- Los datos deben persistir correctamente
