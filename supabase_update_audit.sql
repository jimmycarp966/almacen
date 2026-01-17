-- ########################################################
-- ACTUALIZACIÓN DE BASE DE DATOS - SUPER AGUILARES
-- AUDITORÍA DE DISEÑO STITCH (ENERO 2026)
-- ########################################################

-- 1. Crear tabla de configuración global
-- Esta tabla almacena metadatos del negocio como WhatsApp, CBU, Logo, etc.
CREATE TABLE IF NOT EXISTS configuracion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clave TEXT UNIQUE NOT NULL, -- Ej: 'contacto', 'pagos', 'apariencia'
  valor JSONB NOT NULL,
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insertar valores iniciales para los nuevos módulos
INSERT INTO configuracion (clave, valor) VALUES 
('contacto', '{"whatsapp": "543810000000", "nombre_negocio": "Super Aguilares", "email": "admin@superaguilares.com"}'),
('pagos_transferencia', '{"cbu": "0000000000000000000000", "alias": "super.aguilares.pay", "banco": "Banco Nación"}'),
('apariencia', '{"logo_url": null, "primario": "#ea2a33"}')
ON CONFLICT (clave) DO NOTHING;

-- 3. Habilitar RLS para la tabla de configuración
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
DROP POLICY IF EXISTS "Lectura pública de configuración" ON configuracion;
CREATE POLICY "Lectura pública de configuración" ON configuracion FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin gestiona configuración" ON configuracion;
CREATE POLICY "Admin gestiona configuración" ON configuracion FOR ALL USING (
  EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
);

-- ########################################################
-- NOTAS DE MANTENIMIENTO:
-- Las tablas 'pedidos' y 'usuarios' ya cuentan con los campos 
-- necesarios para el historial y seguimiento. 
-- Asegúrese de que las políticas RLS de 'pedidos' permitan 
-- que los clientes lean sus propios registros.
-- ########################################################
