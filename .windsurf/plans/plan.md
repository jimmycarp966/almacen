# Plan de Actualización del Sistema - Stitch Interfaces

Este plan detalla la actualización completa del sistema basado en las 28 interfaces de la carpeta `stitch_seguimiento_de_pedido_cliente`.

## Análisis de Interfaces

### Interfaces en Stitch (28 carpetas)
1. aprobación_de_pago_manual_(admin)
2. caja_diaria_e_ingresos/egresos
3. catálogo_con_carrito_flotante
4. catálogo_con_carrito_lateral_1, 2, 3
5. comprobante_de_pago_digital_1, 2
6. configuración_del_negocio
7. confirmación_cierre_de_caja
8. confirmación_de_pedido_(éxito)
9. detalle_de_pedido_(admin)_1, 2, 3
10. formulario_agregar_producto
11. formulario_nueva_categoría
12. formulario_rechazar_pago
13. formulario_registrar_egreso
14. gestión_de_inventario_admin_1, 2
15. historial_de_pedidos_cliente
16. identificación_por_celular
17. notificación_de_pago_(admin)_1, 2
18. reportes_y_estadísticas_de_ventas
19. seguimiento_de_pedido_cliente_1, 2
20. selección_de_método_de_pago

### Rutas Existentes en el Sistema
- `/` - página principal
- `/admin` - dashboard admin
- `/admin/caja` - caja diaria
- `/admin/configuracion` - configuración
- `/admin/pagos` - pagos
- `/admin/pedidos` - pedidos
- `/admin/productos` - productos
- `/admin/reportes` - reportes
- `/carrito` - carrito
- `/historial` - historial de pedidos
- `/login` - login
- `/seguimiento/[id]` - seguimiento de pedido

## Tareas de Implementación

### 1. Interfaces Faltantes - Cliente (Alta Prioridad)
- [ ] Crear `/pedido/confirmacion` - confirmación de pedido
- [ ] Crear `/pago/metodo` - selección de método de pago
- [ ] Crear `/identificacion` - identificación por celular
- [ ] Actualizar `/historial` - según diseño stitch
- [ ] Actualizar `/seguimiento/[id]` - según diseño stitch

### 2. Interfaces Faltantes - Admin (Alta Prioridad)
- [ ] Crear `/admin/pedidos/[id]` - detalle de pedido (3 variantes)
- [ ] Crear `/admin/pagos/aprobar/[id]` - aprobación de pago manual
- [ ] Crear `/admin/pagos/rechazar/[id]` - formulario rechazar pago
- [ ] Crear `/admin/caja/egresos` - registrar egresos
- [ ] Crear `/admin/caja/cerrar` - confirmación cierre de caja

### 3. Formularios Admin (Media Prioridad)
- [ ] Crear `/admin/productos/agregar` - formulario agregar producto
- [ ] Crear `/admin/productos/categorias/nueva` - formulario nueva categoría
- [ ] Actualizar `/admin/configuracion` - según diseño stitch

### 4. Catálogo y Comprobantes (Media Prioridad)
- [ ] Crear variantes de catálogo con carrito (flotante, lateral 1, 2, 3)
- [ ] Crear comprobantes de pago digital (variantes 1, 2)
- [ ] Crear notificaciones de pago admin (variantes 1, 2)

### 5. Gestión de Inventario (Baja Prioridad)
- [ ] Crear interfaces de gestión de inventario (variantes 1, 2)
- [ ] Actualizar `/admin/reportes` - según diseño stitch

## Orden de Implementación Sugerido

1. **Fase 1**: Interfaces críticas del cliente
   - Confirmación de pedido
   - Selección de método de pago
   - Identificación por celular

2. **Fase 2**: Interfaces críticas del admin
   - Detalle de pedido
   - Aprobación de pago
   - Egresos de caja

3. **Fase 3**: Formularios y actualizaciones
   - Formularios de productos
   - Actualización de interfaces existentes

4. **Fase 4**: Interfaces complementarias
   - Catálogos
   - Comprobantes
   - Notificaciones

## Notas Importantes
- Algunas interfaces tienen múltiples variantes (1, 2, 3) que pueden ser implementadas como diferentes estados o versiones
- Las interfaces existentes pueden necesitar actualizaciones para coincidir con el diseño stitch
- Mantener consistencia en el uso de Tailwind CSS y Material Symbols
- Asegurar responsividad en todas las interfaces
