-- ============================================
-- Migración: Categoría Balanza + Venta por Gramos
-- ============================================
-- Esta migración agrega soporte para productos que se venden por peso (balanza)
-- y la categoría "Balanza" en el sistema.

-- 1. Agregar campos a productos para ventas por peso (balanza)
ALTER TABLE productos
ADD COLUMN IF NOT EXISTS tipo_venta TEXT DEFAULT 'unidad' CHECK (tipo_venta IN ('unidad', 'peso')),
ADD COLUMN IF NOT EXISTS precio_por_kg DECIMAL(10, 2);  -- precio por KILOGRAMO (solo para tipo_venta='peso')

-- 2. Cambiar cantidad a decimal en pedido_items (para guardar gramos/kg como decimal)
ALTER TABLE pedido_items
ALTER COLUMN cantidad TYPE DECIMAL(10, 3);

-- 3. Actualizar la función crear_pedido_rpc para aceptar cantidades decimales
CREATE OR REPLACE FUNCTION crear_pedido_rpc(
    p_cliente_nombre TEXT,
    p_cliente_direccion TEXT,
    p_cliente_telefono TEXT,
    p_items JSONB,
    p_total DECIMAL,
    p_descuento_aplicado DECIMAL DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pedido_id UUID;
    v_item JSONB;
    v_producto_id UUID;
    v_cantidad DECIMAL(10, 3);
    v_producto RECORD;
BEGIN
    -- Crear el pedido
    INSERT INTO pedidos (
        cliente_nombre,
        cliente_direccion,
        cliente_telefono,
        total,
        estado,
        descuento_aplicado
    )
    VALUES (
        p_cliente_nombre,
        p_cliente_direccion,
        p_cliente_telefono,
        p_total,
        'pendiente',
        p_descuento_aplicado
    )
    RETURNING id INTO v_pedido_id;

    -- Insertar cada item del pedido
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_producto_id := (v_item->>'producto_id')::UUID;
        v_cantidad := (v_item->>'cantidad')::DECIMAL(10, 3);  -- Cambiado de INTEGER a DECIMAL

        -- Obtener datos del producto
        SELECT * INTO v_producto
        FROM productos
        WHERE id = v_producto_id;

        -- Insertar item del pedido
        INSERT INTO pedido_items (
            pedido_id,
            producto_id,
            cantidad,
            precio_unitario,
            subtotal
        )
        VALUES (
            v_pedido_id,
            v_producto_id,
            v_cantidad,
            v_producto.precio,
            v_cantidad * v_producto.precio
        );
    END LOOP;

    -- Retornar el pedido creado
    RETURN jsonb_build_object(
        'success', true,
        'pedido_id', v_pedido_id
    );
END;
$$;

-- 4. Crear categoría "Balanza"
INSERT INTO categorias (id, nombre, descripcion, activo)
VALUES (
    gen_random_uuid(),
    'Balanza',
    'Productos que se venden por peso (gramos/kilogramos)',
    true
)
ON CONFLICT DO NOTHING;

-- Comentarios para documentación
COMMENT ON COLUMN productos.tipo_venta IS 'Tipo de venta: "unidad" para venta por unidades, "peso" para venta por gramos/kilogramos';
COMMENT ON COLUMN productos.precio_por_kg IS 'Precio por kilogramo para productos de balanza. Para productos tipo_venta="peso", este campo contiene el precio por kg';
COMMENT ON COLUMN pedido_items.cantidad IS 'Cantidad del producto. Para productos por peso: en kilogramos (ej: 0.250 = 250g). Para productos por unidad: cantidad entera';
