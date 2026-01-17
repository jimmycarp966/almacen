-- ########################################################
-- SISTEMA DE VENTAS POR CATÁLOGO - SUPER AGUILARES
-- SCRIPT DE BASE DE DATOS COMPLETO
-- ########################################################

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABLA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  telefono TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL DEFAULT 'cliente',
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_telefono ON usuarios(telefono);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- 2. TABLA: categorias
CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria_padre_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categorias_padre ON categorias(categoria_padre_id);
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- 3. TABLA: productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  stock_minimo INTEGER DEFAULT 10,
  categoria_id UUID REFERENCES categorias(id),
  imagen_url TEXT,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 4. TABLA: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT UNIQUE NOT NULL,
  cliente_id UUID REFERENCES usuarios(id) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  recargo DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago TEXT NOT NULL, -- 'efectivo', 'tarjeta', 'transferencia'
  cuotas INTEGER,
  estado TEXT NOT NULL DEFAULT 'recibido',
  pago_validado BOOLEAN DEFAULT false,
  pago_rechazado BOOLEAN DEFAULT false,
  motivo_rechazo TEXT,
  comprobante_url TEXT,
  datos_entrega JSONB NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_creacion);

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- 5. TABLA: pedido_items
CREATE TABLE IF NOT EXISTS pedido_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedido_items_pedido ON pedido_items(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_items_producto ON pedido_items(producto_id);

ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

-- 6. TABLA: pedido_historial
CREATE TABLE IF NOT EXISTS pedido_historial (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  estado TEXT NOT NULL,
  observaciones TEXT,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedido_historial_pedido ON pedido_historial(pedido_id);
ALTER TABLE pedido_historial ENABLE ROW LEVEL SECURITY;

-- 7. TABLA: caja_diaria
CREATE TABLE IF NOT EXISTS caja_diaria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha DATE UNIQUE NOT NULL,
  hora_apertura TIMESTAMP WITH TIME ZONE NOT NULL,
  hora_cierre TIMESTAMP WITH TIME ZONE,
  saldo_inicial DECIMAL(10,2) NOT NULL,
  total_ingresos DECIMAL(10,2) DEFAULT 0,
  total_egresos DECIMAL(10,2) DEFAULT 0,
  saldo_final DECIMAL(10,2),
  desglose_efectivo DECIMAL(10,2) DEFAULT 0,
  desglose_tarjeta DECIMAL(10,2) DEFAULT 0,
  desglose_transferencia DECIMAL(10,2) DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'abierta',
  observaciones TEXT
);

CREATE INDEX IF NOT EXISTS idx_caja_fecha ON caja_diaria(fecha);
ALTER TABLE caja_diaria ENABLE ROW LEVEL SECURITY;

-- 8. TABLA: caja_movimientos
CREATE TABLE IF NOT EXISTS caja_movimientos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL, -- 'ingreso', 'egreso'
  concepto TEXT NOT NULL,
  pedido_id UUID REFERENCES pedidos(id),
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago TEXT NOT NULL,
  tipo_egreso TEXT,
  notas TEXT,
  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_caja_mov_fecha ON caja_movimientos(fecha);
CREATE INDEX IF NOT EXISTS idx_caja_mov_tipo ON caja_movimientos(tipo);
ALTER TABLE caja_movimientos ENABLE ROW LEVEL SECURITY;

-- ########################################################
-- FUNCIONES Y TRIGGERS
-- ########################################################

-- Trigger para generar número automático de pedido
CREATE OR REPLACE FUNCTION generar_numero_pedido()
RETURNS TRIGGER AS $$
DECLARE
  fecha_hoy TEXT;
  contador INTEGER;
BEGIN
  fecha_hoy := TO_CHAR(NOW(), 'YYYYMMDD');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(numero FROM 13) AS INTEGER)), 0) + 1
  INTO contador
  FROM pedidos
  WHERE numero LIKE 'PED-' || fecha_hoy || '-%';
  
  NEW.numero := 'PED-' || fecha_hoy || '-' || LPAD(contador::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generar_numero ON pedidos;
CREATE TRIGGER trigger_generar_numero
  BEFORE INSERT ON pedidos
  FOR EACH ROW EXECUTE FUNCTION generar_numero_pedido();

-- RPC: crear_pedido (Transaccional)
CREATE OR REPLACE FUNCTION crear_pedido_rpc(
  p_cliente_id UUID,
  p_items JSONB,
  p_subtotal DECIMAL,
  p_recargo DECIMAL,
  p_total DECIMAL,
  p_metodo_pago TEXT,
  p_cuotas INTEGER,
  p_datos_entrega JSONB
)
RETURNS TABLE(r_pedido_id UUID, r_numero_pedido TEXT) AS $$
DECLARE
  v_pedido_id UUID;
  v_numero TEXT;
  v_item JSONB;
BEGIN
  -- Insertar pedido
  INSERT INTO pedidos (
    cliente_id, subtotal, recargo, total, metodo_pago,
    cuotas, estado, datos_entrega, fecha_creacion
  ) VALUES (
    p_cliente_id, p_subtotal, p_recargo, p_total,
    p_metodo_pago, p_cuotas, 'recibido', p_datos_entrega, NOW()
  )
  RETURNING id, numero INTO v_pedido_id, v_numero;
  
  -- Insertar items y descontar stock simultáneamente
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Insertar item
    INSERT INTO pedido_items (
      pedido_id, producto_id, cantidad, precio_unitario, subtotal
    ) VALUES (
      v_pedido_id,
      (v_item->>'producto_id')::UUID,
      (v_item->>'cantidad')::INTEGER,
      (v_item->>'precio_unitario')::DECIMAL,
      (v_item->>'cantidad')::INTEGER * (v_item->>'precio_unitario')::DECIMAL
    );

    -- Descontar stock
    UPDATE productos
    SET stock = stock - (v_item->>'cantidad')::INTEGER
    WHERE id = (v_item->>'producto_id')::UUID;
    
    -- Validar stock no negativo (opcional según requerimiento)
    IF (SELECT stock FROM productos WHERE id = (v_item->>'producto_id')::UUID) < 0 THEN
      RAISE EXCEPTION 'Stock insuficiente para el producto ID %', (v_item->>'producto_id');
    END IF;
  END LOOP;
  
  -- Registrar en historial
  INSERT INTO pedido_historial (pedido_id, estado, fecha)
  VALUES (v_pedido_id, 'recibido', NOW());
  
  RETURN QUERY SELECT v_pedido_id, v_numero;
END;
$$ LANGUAGE plpgsql;

-- RPC: registrar_ingreso_caja
CREATE OR REPLACE FUNCTION registrar_ingreso_caja_rpc(
  p_pedido_id UUID,
  p_monto DECIMAL,
  p_metodo TEXT
)
RETURNS VOID AS $$
DECLARE
  v_fecha DATE;
BEGIN
  v_fecha := CURRENT_DATE;
  
  INSERT INTO caja_movimientos (
    fecha, tipo, concepto, pedido_id, monto, metodo_pago, fecha_hora
  ) VALUES (
    v_fecha, 'ingreso', 'Venta', p_pedido_id, p_monto, p_metodo, NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- ########################################################
-- POLÍTICAS RLS (Seguridad)
-- ########################################################

-- Políticas para USUARIOS
CREATE POLICY "Lectura propia" ON usuarios FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin ve todos" ON usuarios FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);

-- Políticas para CATEGORIAS
CREATE POLICY "Lectura pública categorías" ON categorias FOR SELECT USING (activo = true);
CREATE POLICY "Admin gestiona categorías" ON categorias FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);

-- Políticas para PRODUCTOS
CREATE POLICY "Lectura pública productos" ON productos FOR SELECT USING (activo = true AND stock > 0);
CREATE POLICY "Admin gestiona productos" ON productos FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);

-- Políticas para PEDIDOS
CREATE POLICY "Clientes ven sus pedidos" ON pedidos FOR SELECT USING (cliente_id = auth.uid());
CREATE POLICY "Clientes crean pedidos" ON pedidos FOR INSERT WITH CHECK (cliente_id = auth.uid());
CREATE POLICY "Admin gestiona pedidos" ON pedidos FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);

-- Políticas para PEDIDO_ITEMS
CREATE POLICY "Clientes ven sus items" ON pedido_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM pedidos WHERE id = pedido_id AND cliente_id = auth.uid())
);
CREATE POLICY "Admin gestiona items" ON pedido_items FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);

-- Políticas para CAJA
CREATE POLICY "Admin gestiona caja" ON caja_diaria FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);
CREATE POLICY "Admin gestiona movimientos" ON caja_movimientos FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);
