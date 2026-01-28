-- Función RPC para insertar múltiples productos
-- Usar esto desde el panel de Supabase SQL Editor para crear productos masivamente

CREATE OR REPLACE FUNCTION insertar_producto_rpc(
    p_codigo TEXT,
    p_nombre TEXT,
    p_precio NUMERIC,
    p_stock INTEGER,
    p_categoria_id UUID,
    p_imagen_url TEXT DEFAULT NULL,
    p_descripcion TEXT DEFAULT NULL,
    p_descuento NUMERIC DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    codigo TEXT,
    nombre TEXT,
    precio NUMERIC
) AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO productos (
        codigo,
        nombre,
        precio,
        stock,
        stock_minimo,
        categoria_id,
        imagen_url,
        descripcion,
        descuento,
        activo,
        fecha_creacion,
        fecha_actualizacion
    ) VALUES (
        p_codigo,
        p_nombre,
        p_precio,
        p_stock,
        FLOOR(p_stock / 4.0),
        p_categoria_id,
        p_imagen_url,
        p_descripcion,
        p_descuento,
        true,
        NOW(),
        NOW()
    )
    RETURNING id, codigo, nombre, precio
    INTO v_id, p_codigo, p_nombre, p_precio;

    RETURN QUERY SELECT v_id, p_codigo, p_nombre, p_precio;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentar para evitar múltiples inserciones si ya existe
-- GRANT EXECUTE ON FUNCTION insertar_producto_rpc TO authenticated;

-- Política para permitir ejecutar la función
DROP POLICY IF EXISTS "Permitir insertar producto rpc" ON productos FOR INSERT;
CREATE POLICY "Permitir insertar producto rpc" ON productos FOR INSERT WITH CHECK (true);
