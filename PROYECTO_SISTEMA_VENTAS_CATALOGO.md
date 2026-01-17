# 🛒 SISTEMA DE VENTAS POR CATÁLOGO
## Especificación Completa para Desarrollo con IA

**Fecha:** 16 de Enero de 2026  
**Versión:** 1.0  
**Estado:** ✅ Listo para desarrollo

---

## 🎯 INFORMACIÓN DEL PROYECTO

### ⚠️ ANTES DE EMPEZAR - MUY IMPORTANTE ⚠️

**EXISTE UNA CARPETA CON DISEÑO E INTERFAZ YA CREADOS:**

```
📁 /stitch_seguimiento_de_pedido_cliente/
```

**REGLAS OBLIGATORIAS PARA DESARROLLO UI:**

1. ✅ **SIEMPRE revisa primero** esta carpeta antes de crear componentes
2. ✅ **Reutiliza y adapta** los componentes existentes
3. ✅ **Mantén consistencia** con el diseño ya establecido
4. ✅ **Sigue los patrones** de colores, tipografía y layout existentes
5. ❌ **NO crees componentes desde cero** si ya existen similares

**Flujo de trabajo UI:**
```
Necesitas crear UI → Revisa stitch_seguimiento_de_pedido_cliente/ → 
¿Existe algo similar? → SÍ: Reutiliza/Adapta | NO: Crea siguiendo el estilo
```

### Descripción General
Sistema web de escritorio para ventas por catálogo con dos interfaces:
- **Front-end Cliente:** Catálogo, carrito, checkout y seguimiento
- **Back-office Admin:** Gestión de pedidos, inventario, pagos y caja

### Objetivos
1. Permitir a clientes comprar productos de forma simple
2. Facilitar al dueño la gestión del negocio
3. Automatizar procesos (stock, caja, estados)
4. Mantener datos seguros con RLS

---

## 🛠 STACK TECNOLÓGICO

| Componente | Tecnología | Propósito |
|---|---|---|
| **Framework** | Next.js 15 | App Router + Server Components |
| **Frontend** | React 19 + TypeScript | UI tipada y reactiva |
| **Estado Global** | Zustand | Solo: sesión, tema, notificaciones |
| **UI** | Tailwind CSS + shadcn/ui | Diseño minimalista profesional |
| **Formularios** | React Hook Form + Zod | Validación automática |
| **Tablas** | TanStack Table | Listados con paginación |
| **Backend** | Next.js Server Actions | Toda la lógica de negocio |
| **Base de Datos** | Supabase (PostgreSQL) | Datos, Auth, Storage |
| **Autenticación** | Custom (teléfono simple) | Sin SMS/OTP |
| **Deploy** | Vercel | Hosting automático |

---

## 📐 REGLAS DE DESARROLLO OBLIGATORIAS

### ⚠️ REGLA #0: DISEÑO EXISTENTE PRIMERO (NUEVA - CRÍTICA)

**Antes de crear CUALQUIER componente de UI:**

1. **DETENTE** y ve a `/stitch_seguimiento_de_pedido_cliente/`
2. **REVISA** si existe un componente similar
3. **ANALIZA** el estilo y estructura del diseño existente
4. **REUTILIZA** o adapta los componentes encontrados
5. **SOLO crea nuevo** si no existe alternativa

**Ejemplo correcto:**
```
Usuario: "Necesito crear la card de producto"
IA: ❌ *inmediatamente genera código*
IA: ✅ [Primero revisa /stitch_seguimiento_de_pedido_cliente/]
IA: ✅ [Encuentra componente ProductCard existente]
IA: ✅ [Lo adapta manteniendo el estilo]
```

**Esta regla tiene PRIORIDAD sobre cualquier otra consideración de UI.**

---

### ⚠️ REGLA #1: DEBUGGING PRIMERO (CRÍTICO)

**NUNCA hagas cambios sin debugging:**

1. **Lee el código relevante** completo
2. **Formula 5-7 hipótesis** del problema
3. **Selecciona las 2 más probables**
4. **Pregunta al usuario** y **espera confirmación**
5. **Agrega logs mínimos** para confirmar
6. **Aplica la solución** solo cuando la causa raíz esté demostrada
7. **Prueba con logs activos**
8. **Si funciona, limpia los logs**
9. **Solo entonces** declara el problema resuelto

**Ejemplo:**
```
Usuario: "El carrito no suma bien"
IA: ❌ *inmediatamente cambia la función de suma*
IA: ✅ *lee cartStore, formula hipótesis, pregunta, agrega console.log, confirma, arregla*
```

### ⚠️ REGLA #2: DOCUMENTACIÓN OBLIGATORIA

**ANTES de escribir cualquier código:**
1. Lee todos los `.md` del proyecto
2. Si NO existe `ARCHITECTURE.md` → CRÉALO analizando todo
3. Mantén `ARCHITECTURE.md` actualizado con cambios significativos
4. Al finalizar sistema nuevo → Documenta TODO

### ⚠️ REGLA #3: PLAN ANTES DE CÓDIGO

**Antes de generar código, presenta:**
1. **¿Qué vamos a hacer?** (1 frase)
2. **¿Cómo funcionará?** (pasos simples)
3. **¿Qué podría salir mal?** (1-2 riesgos + mitigación)
4. **¿Cómo lo probamos?** (3 pasos de verificación)

> **No muestres código a menos que el usuario lo pida explícitamente.**

### ⚠️ REGLA #4: FLUJO DE DATOS ESTÁNDAR

**TODA operación sigue este patrón obligatorio:**

```
UI Component (Cliente)
    ↓
Server Action ("use server")
    ↓
Validación (Zod schema)
    ↓
Operación Supabase (select/insert/update/delete/rpc)
    ↓
Transacción SQL si toca múltiples tablas (rpc())
    ↓
Response {success, message?, data?}
    ↓
revalidatePath() o revalidateTag()
    ↓
UI Update (automático por Next.js)
    ↓
Notificación al usuario (toast)
```

**Reglas del flujo:**
- ✅ Componentes UI **solo** llaman Server Actions
- ✅ Server Actions **siempre** tienen `"use server"`
- ✅ Toda validación con **Zod**
- ✅ Operaciones multi-tabla usan **`rpc()`** (transacciones)
- ✅ Siempre devolver **`{success: true/false}`**
- ✅ Usar **`revalidatePath()`** después de mutaciones
- ✅ Mostrar **notificación** (éxito o error)

### ⚠️ REGLA #5: FECHAS Y HORA

**NUNCA asumas la fecha del modelo:**
1. Usa `new Date()` en JavaScript (lado servidor)
2. En SQL usa `NOW()` o `CURRENT_TIMESTAMP`
3. Almacena en **UTC**, muestra en zona local
4. Si necesitas fecha del cliente, pásala explícitamente

### ⚠️ REGLA #6: SUPABASE SECURITY FIRST

**Seguridad obligatoria:**
1. ✅ **Toda tabla tiene RLS activado**
2. ✅ Define políticas por rol:
   - `clientes` solo ven sus datos
   - `admin` ve todo
3. ✅ Operaciones complejas → **Funciones SQL (`rpc`)**
4. ✅ Server Actions capturan errores de Supabase
5. ✅ Devuelven **mensajes amigables** al usuario

**Ejemplo de política RLS:**
```sql
-- Clientes solo ven sus pedidos
CREATE POLICY "clientes_ven_sus_pedidos" ON pedidos
  FOR SELECT USING (auth.uid() = cliente_id);

-- Admin ve todo
CREATE POLICY "admin_ve_todo" ON pedidos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id = auth.uid() AND rol = 'admin'
    )
  );
```

### ⚠️ REGLA #7: UI/UX CONSISTENTE

**Estados obligatorios:**
1. ✅ **Loading:** Botones con spinner + deshabilitados
2. ✅ **Empty State:** "No hay X aún" en lugar de vacío
3. ✅ **Error State:** Mensaje claro + acción sugerida
4. ✅ **Success:** Notificación + actualización automática

**Formularios:**
1. ✅ Errores debajo de cada campo
2. ✅ Al enviar con éxito → limpiar formulario
3. ✅ Validación en tiempo real (React Hook Form)
4. ✅ Validación en servidor (Zod)

**Permisos:**
1. ✅ Ocultar/deshabilitar UI según rol
2. ✅ Validación final **siempre** en Server Action

**Diseño:**
1. ✅ **SIEMPRE** revisar `/stitch_seguimiento_de_pedido_cliente/` primero
2. ✅ Mantener consistencia con el diseño existente

### ⚠️ REGLA #8: INSTALACIONES AUTOMÁTICAS

Si necesitas instalar algo para hacer el proyecto:
- Más seguro
- Más estable
- Mejor arquitectura

→ **Instálalo SIN preguntar**

---

## 🎨 IDENTIDAD VISUAL Y DISEÑO

### ⚠️ IMPORTANTE: REFERENCIA DE DISEÑO EXISTENTE

**El diseño completo de la interfaz ya está creado y se encuentra en:**
```
/stitch_seguimiento_de_pedido_cliente/
```

**ANTES de crear cualquier componente UI, DEBES:**

1. ✅ **Revisar la carpeta `stitch_seguimiento_de_pedido_cliente`** para ver:
   - Estructura de componentes ya creados
   - Estilos y clases CSS existentes
   - Layout y organización visual
   - Componentes reutilizables
   - Ejemplos de implementación

2. ✅ **Reutilizar y adaptar** los componentes existentes en lugar de crear nuevos desde cero

3. ✅ **Mantener consistencia** con el diseño ya establecido en esa carpeta

4. ✅ **Seguir los patrones** de diseño ya implementados

**La carpeta `stitch_seguimiento_de_pedido_cliente` es la fuente de verdad para el diseño visual.**

### Paleta de Colores (Referencia)

```css
--blanco: #FFFFFF;      /* Fondo general */
--negro: #000000;       /* Tipografía principal */
--rojo: #FF0000;        /* Acciones, alertas, estados activos */
--gris-claro: #F5F5F5;  /* Fondos secundarios */
--gris-medio: #E0E0E0;  /* Bordes */
--gris-oscuro: #757575; /* Texto secundario */
--verde: #00C853;       /* Éxito, aprobado */
--amarillo: #FFD600;    /* Advertencias */
```

> **Nota:** Verifica que estos colores coincidan con los usados en `stitch_seguimiento_de_pedido_cliente`. Si hay diferencias, los de la carpeta tienen prioridad.

### Tipografía (Referencia)
- **Familia:** Inter, system-ui, sans-serif
- **Pesos:** 400 (regular), 600 (semibold), 700 (bold)
- **Tamaños:**
  - Título Principal: 32px
  - Título Sección: 24px
  - Cuerpo: 16px
  - Pequeño: 14px

> **Nota:** Verifica la tipografía en `stitch_seguimiento_de_pedido_cliente` antes de implementar.

### Botones (Referencia Tailwind)

⚠️ **IMPORTANTE:** Revisa primero los estilos de botones en `/stitch_seguimiento_de_pedido_cliente/` antes de usar estos.

**Primario (Acción Principal):**
```tsx
className="bg-[#FF0000] text-white hover:bg-[#CC0000] px-6 py-3 rounded-md font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
```

**Secundario:**
```tsx
className="border-2 border-[#FF0000] text-black hover:bg-[#FFF5F5] px-6 py-3 rounded-md font-semibold transition-colors"
```

**Destructivo:**
```tsx
className="bg-white text-[#FF0000] border-2 border-[#FF0000] hover:bg-red-50 px-4 py-2 rounded-md font-semibold"
```

### Flujo de Trabajo para Crear UI

**SIEMPRE sigue este orden:**

1. ✅ **PRIMERO:** Revisa `/stitch_seguimiento_de_pedido_cliente/`
2. ✅ **SEGUNDO:** Identifica componentes reutilizables
3. ✅ **TERCERO:** Adapta los existentes si es necesario
4. ✅ **ÚLTIMO:** Solo crea nuevos si no existen alternativas

**Ejemplo:**
```
Usuario: "Necesito crear el formulario de checkout"
IA: [PRIMERO lee stitch_seguimiento_de_pedido_cliente/]
IA: [Busca formularios similares]
IA: [Adapta o reutiliza componentes encontrados]
IA: [Solo crea nuevo si no hay nada similar]
```

---

## 🏗 ARQUITECTURA DEL SISTEMA

### Diagrama de Flujo General

```
┌─────────────────────────────────────────────┐
│         NEXT.JS 15 (App Router)             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────┐    ┌──────────────────┐ │
│  │   CLIENTE     │    │     ADMIN        │ │
│  │  (Público)    │    │   (Protegido)    │ │
│  │               │    │                  │ │
│  │ • Catálogo    │    │ • Dashboard      │ │
│  │ • Carrito     │    │ • Pedidos        │ │
│  │ • Checkout    │    │ • Inventario     │ │
│  │ • Seguimiento │    │ • Pagos          │ │
│  │               │    │ • Caja           │ │
│  └───────────────┘    └──────────────────┘ │
│         │                      │            │
│         └──────┬───────────────┘            │
│                ▼                            │
│      ┌──────────────────┐                   │
│      │  SERVER ACTIONS  │                   │
│      │   (Lógica de     │                   │
│      │    Negocio)      │                   │
│      └──────────────────┘                   │
│                │                            │
│                ▼                            │
│      ┌──────────────────┐                   │
│      │    SUPABASE      │                   │
│      │  • PostgreSQL    │                   │
│      │  • Auth          │                   │
│      │  • Storage       │                   │
│      │  • RLS           │                   │
│      └──────────────────┘                   │
└─────────────────────────────────────────────┘
```

### Autenticación (Simple - Sin OTP/SMS)

**Sistema de identificación:**

**Primera vez:**
```
1. Cliente ingresa teléfono (10 dígitos)
2. Sistema busca en DB
3. No existe → Pide nombre
4. Crea usuario en tabla `usuarios`
5. Guarda sesión en Zustand (persistente)
```

**Próximas veces:**
```
1. Cliente ingresa teléfono
2. Sistema busca y encuentra
3. Restaura sesión automáticamente
```

**Roles disponibles:**
```typescript
type UserRole = 'cliente' | 'admin' | 'cajero' | 'repartidor';

// Actualmente se usan:
// - 'cliente': Cualquier persona que compra
// - 'admin': Dueño del negocio

// Preparado para futuro:
// - 'cajero': Solo maneja caja y pedidos
// - 'repartidor': Solo ve pedidos asignados
```

### Protección de Rutas (Middleware)

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Rutas de admin requieren rol 'admin'
  if (pathname.startsWith('/admin')) {
    const user = await getUserFromSession();
    
    if (!user || user.rol !== 'admin') {
      return NextResponse.redirect(new URL('/catalogo', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
```

---

## 📊 BASE DE DATOS (SUPABASE)

### Principios de Diseño

1. **Row Level Security (RLS)** activado en TODAS las tablas
2. Relaciones con integridad referencial
3. Timestamps en todas las tablas
4. Índices en columnas frecuentemente consultadas
5. Funciones `rpc()` para operaciones transaccionales

### Esquema Completo

#### Tabla: `usuarios`

```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  telefono TEXT UNIQUE NOT NULL,
  rol TEXT NOT NULL DEFAULT 'cliente',
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usuarios_telefono ON usuarios(telefono);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "usuarios_lectura_propia" ON usuarios
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "usuarios_admin_all" ON usuarios
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `categorias`

```sql
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  categoria_padre_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  activo BOOLEAN DEFAULT true,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categorias_padre ON categorias(categoria_padre_id);
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categorias_lectura_publica" ON categorias
  FOR SELECT USING (activo = true);

CREATE POLICY "categorias_admin" ON categorias
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `productos`

```sql
CREATE TABLE productos (
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
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_productos_activo ON productos(activo);

ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "productos_lectura_publica" ON productos
  FOR SELECT USING (activo = true AND stock > 0);

CREATE POLICY "productos_admin" ON productos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `pedidos`

```sql
CREATE TABLE pedidos (
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
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_pedidos_fecha ON pedidos(fecha_creacion);

-- Trigger para generar número automático
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

CREATE TRIGGER trigger_generar_numero
  BEFORE INSERT ON pedidos
  FOR EACH ROW EXECUTE FUNCTION generar_numero_pedido();

ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pedidos_cliente_propios" ON pedidos
  FOR SELECT USING (cliente_id = auth.uid());

CREATE POLICY "pedidos_cliente_crear" ON pedidos
  FOR INSERT WITH CHECK (cliente_id = auth.uid());

CREATE POLICY "pedidos_admin" ON pedidos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `pedido_items`

```sql
CREATE TABLE pedido_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pedido_items_pedido ON pedido_items(pedido_id);
CREATE INDEX idx_pedido_items_producto ON pedido_items(producto_id);

ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pedido_items_cliente" ON pedido_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pedidos 
      WHERE pedidos.id = pedido_items.pedido_id 
      AND pedidos.cliente_id = auth.uid()
    )
  );

CREATE POLICY "pedido_items_admin" ON pedido_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `pedido_historial`

```sql
CREATE TABLE pedido_historial (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pedido_id UUID REFERENCES pedidos(id) ON DELETE CASCADE,
  estado TEXT NOT NULL,
  observaciones TEXT,
  fecha TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pedido_historial_pedido ON pedido_historial(pedido_id);
ALTER TABLE pedido_historial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pedido_historial_lectura" ON pedido_historial
  FOR SELECT USING (true);

CREATE POLICY "pedido_historial_admin" ON pedido_historial
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `caja_diaria`

```sql
CREATE TABLE caja_diaria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha DATE UNIQUE NOT NULL,
  hora_apertura TIMESTAMP NOT NULL,
  hora_cierre TIMESTAMP,
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

CREATE INDEX idx_caja_fecha ON caja_diaria(fecha);
ALTER TABLE caja_diaria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "caja_admin_only" ON caja_diaria
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

#### Tabla: `caja_movimientos`

```sql
CREATE TABLE caja_movimientos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fecha DATE NOT NULL,
  tipo TEXT NOT NULL, -- 'ingreso', 'egreso'
  concepto TEXT NOT NULL,
  pedido_id UUID REFERENCES pedidos(id),
  monto DECIMAL(10,2) NOT NULL,
  metodo_pago TEXT NOT NULL,
  tipo_egreso TEXT,
  notas TEXT,
  fecha_hora TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_caja_mov_fecha ON caja_movimientos(fecha);
CREATE INDEX idx_caja_mov_tipo ON caja_movimientos(tipo);
ALTER TABLE caja_movimientos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "caja_mov_admin_only" ON caja_movimientos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id = auth.uid() AND rol = 'admin')
  );
```

### Funciones SQL Importantes

#### Función: Crear Pedido (Transacción)

```sql
CREATE OR REPLACE FUNCTION crear_pedido(
  p_cliente_id UUID,
  p_items JSONB,
  p_subtotal DECIMAL,
  p_recargo DECIMAL,
  p_total DECIMAL,
  p_metodo_pago TEXT,
  p_cuotas INTEGER,
  p_datos_entrega JSONB
)
RETURNS TABLE(pedido_id UUID, numero_pedido TEXT) AS $$
DECLARE
  v_pedido_id UUID;
  v_numero TEXT;
  item JSONB;
BEGIN
  -- Crear pedido
  INSERT INTO pedidos (
    cliente_id, subtotal, recargo, total, metodo_pago,
    cuotas, estado, datos_entrega, fecha_creacion
  ) VALUES (
    p_cliente_id, p_subtotal, p_recargo, p_total,
    p_metodo_pago, p_cuotas, 'recibido', p_datos_entrega, NOW()
  )
  RETURNING id, numero INTO v_pedido_id, v_numero;
  
  -- Insertar items
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO pedido_items (
      pedido_id, producto_id, cantidad, precio_unitario, subtotal
    ) VALUES (
      v_pedido_id,
      (item->>'producto_id')::UUID,
      (item->>'cantidad')::INTEGER,
      (item->>'precio_unitario')::DECIMAL,
      (item->>'cantidad')::INTEGER * (item->>'precio_unitario')::DECIMAL
    );
  END LOOP;
  
  -- Registrar en historial
  INSERT INTO pedido_historial (pedido_id, estado, fecha)
  VALUES (v_pedido_id, 'recibido', NOW());
  
  RETURN QUERY SELECT v_pedido_id, v_numero;
END;
$$ LANGUAGE plpgsql;
```

#### Función: Descontar Stock

```sql
CREATE OR REPLACE FUNCTION descontar_stock(
  p_producto_id UUID,
  p_cantidad INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE productos
  SET stock = stock - p_cantidad
  WHERE id = p_producto_id;
  
  IF (SELECT stock FROM productos WHERE id = p_producto_id) < 0 THEN
    RAISE EXCEPTION 'Stock insuficiente';
  END IF;
END;
$$ LANGUAGE plpgsql;
```

#### Función: Registrar Ingreso en Caja

```sql
CREATE OR REPLACE FUNCTION registrar_ingreso_caja(
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
```

---

## 📱 MÓDULOS DEL SISTEMA

### ⚠️ RECORDATORIO: Antes de implementar cualquier módulo visual

**PRIMERO revisa `/stitch_seguimiento_de_pedido_cliente/` para:**
- Ver la estructura de componentes ya creados
- Identificar patrones de diseño establecidos
- Reutilizar componentes existentes
- Mantener consistencia visual

---

### MÓDULO CLIENTE

#### 1. Autenticación (`/auth/login`)

**⚠️ Revisa primero:** `/stitch_seguimiento_de_pedido_cliente/` para ver si existe un componente de login

**Componente:** `ClientLoginForm.tsx`

**Funcionalidad:**
- Input de teléfono (10 dígitos)
- Si existe → Login automático
- Si no existe → Pide nombre y crea cuenta

**Server Action:**
```typescript
// src/actions/authActions.ts
'use server'

export async function loginOrRegisterClient(data: {
  telefono: string;
  nombre?: string;
}) {
  const schema = z.object({
    telefono: z.string().regex(/^\d{10}$/, 'Teléfono inválido'),
    nombre: z.string().min(3).optional()
  });
  
  const validated = schema.parse(data);
  
  const { data: user } = await supabase
    .from('usuarios')
    .select('*')
    .eq('telefono', validated.telefono)
    .eq('rol', 'cliente')
    .single();
  
  if (user) {
    return { success: true, user };
  }
  
  if (!validated.nombre) {
    return { success: false, needsName: true };
  }
  
  const { data: newUser } = await supabase
    .from('usuarios')
    .insert({
      telefono: validated.telefono,
      nombre: validated.nombre,
      rol: 'cliente'
    })
    .select()
    .single();
  
  return { success: true, user: newUser };
}
```

**Store Zustand:**
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  nombre: string;
  telefono: string;
  rol: 'cliente' | 'admin';
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

#### 2. Catálogo (`/catalogo`)

**Layout:**
```
┌──────────────────────────────────────────────┐
│  [Buscar...]  [Categoría ▼]                  │
├───────────────────────────────┬──────────────┤
│                               │   CARRITO    │
│  [Producto] [Producto]        │  ┌────────┐  │
│  [Producto] [Producto]        │  │Item 1  │  │
│  [Producto] [Producto]        │  │Item 2  │  │
│                               │  └────────┘  │
│                               │  Total: $X   │
│                               │  [COMPRAR]   │
└───────────────────────────────┴──────────────┘
```

**Componentes:**
- `ProductGrid.tsx`: Cuadrícula de productos
- `ProductCard.tsx`: Tarjeta individual
- `SideCart.tsx`: Carrito lateral fijo
- `ProductModal.tsx`: Detalle en modal

**Server Action:**
```typescript
export async function getProducts(filters?: {
  search?: string;
  categoria_id?: string;
}) {
  let query = supabase
    .from('productos')
    .select('*, categoria:categorias(id, nombre)')
    .eq('activo', true)
    .gt('stock', 0);
  
  if (filters?.search) {
    query = query.ilike('nombre', `%${filters.search}%`);
  }
  
  if (filters?.categoria_id) {
    query = query.eq('categoria_id', filters.categoria_id);
  }
  
  const { data, error } = await query;
  
  if (error) return { success: false, message: 'Error al cargar' };
  return { success: true, data };
}
```

**Store del Carrito:**
```typescript
// src/store/cartStore.ts
interface CartItem extends Producto {
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (producto: Producto) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (producto) => {
        const items = get().items;
        const existing = items.find(i => i.id === producto.id);
        
        if (existing) {
          set({
            items: items.map(i =>
              i.id === producto.id
                ? { ...i, cantidad: i.cantidad + 1 }
                : i
            )
          });
        } else {
          set({ items: [...items, { ...producto, cantidad: 1 }] });
        }
        
        get().calculateTotal();
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(i => i.id !== id) });
        get().calculateTotal();
      },
      
      clearCart: () => set({ items: [], total: 0 }),
      
      calculateTotal: () => {
        const total = get().items.reduce(
          (sum, item) => sum + (item.precio * item.cantidad),
          0
        );
        set({ total });
      }
    }),
    { name: 'cart-storage' }
  )
);
```

#### 3. Checkout (`/checkout`)

**Flujo:**
1. Mostrar resumen del carrito
2. Formulario de datos de entrega
3. Selector de método de pago
4. Confirmación

**Selector de Pago:**
```typescript
// Recargos por cuotas
const recargos = {
  1: 0,      // Sin recargo
  3: 0.10,   // 10%
  6: 0.15,   // 15%
  12: 0.20   // 20%
};

function calcularTotal(subtotal: number, metodo: string, cuotas?: number) {
  if (metodo === 'tarjeta' && cuotas) {
    return subtotal * (1 + recargos[cuotas]);
  }
  return subtotal;
}
```

**Server Action:**
```typescript
export async function createOrder(data: {
  cliente_id: string;
  items: CartItem[];
  datos_entrega: DatosEntrega;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  cuotas?: number;
}) {
  const validated = orderSchema.parse(data);
  
  const subtotal = validated.items.reduce(
    (sum, item) => sum + (item.precio * item.cantidad),
    0
  );
  
  let recargo = 0;
  if (validated.metodo_pago === 'tarjeta' && validated.cuotas) {
    recargo = subtotal * getRecargoByCuotas(validated.cuotas);
  }
  
  const total = subtotal + recargo;
  
  const { data: pedido, error } = await supabase.rpc('crear_pedido', {
    p_cliente_id: validated.cliente_id,
    p_items: validated.items,
    p_subtotal: subtotal,
    p_recargo: recargo,
    p_total: total,
    p_metodo_pago: validated.metodo_pago,
    p_cuotas: validated.cuotas || null,
    p_datos_entrega: validated.datos_entrega
  });
  
  if (error) {
    return { success: false, message: 'Error al crear pedido' };
  }
  
  revalidatePath('/admin/pedidos');
  revalidatePath('/mis-pedidos');
  
  return { success: true, data: pedido };
}
```

#### 4. Seguimiento de Pedido (`/pedidos/[id]`)

**Timeline de Estados:**
```
Estado: recibido → preparando → en_camino → entregado
```

**Componente Timeline:**
```typescript
interface TimelineProps {
  estado: EstadoPedido;
  historial: { estado: EstadoPedido; fecha: string }[];
}

export function OrderTimeline({ estado, historial }: TimelineProps) {
  const estados = ['recibido', 'preparando', 'en_camino', 'entregado'];
  const currentIndex = estados.indexOf(estado);
  
  return (
    <div className="flex justify-between items-center">
      {estados.map((est, index) => {
        const isActive = index <= currentIndex;
        const fecha = historial.find(h => h.estado === est)?.fecha;
        
        return (
          <div key={est} className="flex flex-col items-center flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isActive ? 'bg-[#FF0000]' : 'bg-gray-300'
            } text-white font-bold`}>
              {isActive ? '✓' : index + 1}
            </div>
            <p className="mt-2 font-semibold">{est}</p>
            {fecha && <p className="text-xs text-gray-600">
              {new Date(fecha).toLocaleTimeString()}
            </p>}
          </div>
        );
      })}
    </div>
  );
}
```

---

### MÓDULO ADMIN

#### 1. Dashboard (`/admin`)

**Componentes:**
- Resumen del día (pedidos nuevos, ventas, pagos pendientes)
- Últimos pedidos
- Productos con stock bajo
- Acciones rápidas

**Server Action:**
```typescript
export async function getDashboardStats() {
  const hoy = new Date().toISOString().split('T')[0];
  
  const { count: pedidosNuevos } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'recibido')
    .gte('fecha_creacion', `${hoy}T00:00:00`);
  
  const { data: ventas } = await supabase
    .from('pedidos')
    .select('total')
    .eq('estado', 'entregado')
    .gte('fecha_creacion', `${hoy}T00:00:00`);
  
  const totalVentas = ventas?.reduce((sum, p) => sum + p.total, 0) || 0;
  
  const { count: pagosPendientes } = await supabase
    .from('pedidos')
    .select('*', { count: 'exact', head: true })
    .eq('metodo_pago', 'transferencia')
    .eq('pago_validado', false);
  
  const { data: stockBajo } = await supabase
    .from('productos')
    .select('*')
    .lt('stock', 10)
    .eq('activo', true);
  
  return {
    success: true,
    data: { pedidosNuevos, totalVentas, pagosPendientes, stockBajo }
  };
}
```

#### 2. Gestión de Pedidos (`/admin/pedidos`)

**Funcionalidades:**
- Listado con filtros (estado, fecha, método de pago)
- Búsqueda por número o cliente
- Cambio de estado
- Botón WhatsApp: `https://wa.me/54${telefono}?text=Hola...`
- Impresión de ticket térmico

**Server Action - Cambiar Estado:**
```typescript
export async function updateOrderStatus(
  pedido_id: string,
  nuevo_estado: EstadoPedido
) {
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('*, pedido_items(*)')
    .eq('id', pedido_id)
    .single();
  
  if (!pedido) {
    return { success: false, message: 'Pedido no encontrado' };
  }
  
  // Si cambia a "preparando" → descontar stock
  if (nuevo_estado === 'preparando' && pedido.estado === 'recibido') {
    for (const item of pedido.pedido_items) {
      await supabase.rpc('descontar_stock', {
        p_producto_id: item.producto_id,
        p_cantidad: item.cantidad
      });
    }
  }
  
  // Si cambia a "entregado" → registrar en caja
  if (nuevo_estado === 'entregado' && pedido.estado !== 'entregado') {
    await supabase.rpc('registrar_ingreso_caja', {
      p_pedido_id: pedido_id,
      p_monto: pedido.total,
      p_metodo: pedido.metodo_pago
    });
  }
  
  // Actualizar estado
  await supabase
    .from('pedidos')
    .update({ estado: nuevo_estado })
    .eq('id', pedido_id);
  
  // Guardar en historial
  await supabase
    .from('pedido_historial')
    .insert({ pedido_id, estado: nuevo_estado });
  
  revalidatePath('/admin/pedidos');
  revalidatePath(`/pedidos/${pedido_id}`);
  
  return { success: true };
}
```

#### 3. Validación de Pagos (`/admin/pagos`)

**Funcionalidad:**
- Lista pedidos con transferencia sin validar
- Muestra imagen del comprobante
- Aprobar o rechazar

**Server Actions:**
```typescript
export async function approvePayment(pedido_id: string) {
  await supabase
    .from('pedidos')
    .update({ 
      pago_validado: true,
      estado: 'preparando'
    })
    .eq('id', pedido_id);
  
  revalidatePath('/admin/pagos');
  return { success: true };
}

export async function rejectPayment(pedido_id: string, motivo: string) {
  await supabase
    .from('pedidos')
    .update({ 
      pago_rechazado: true,
      motivo_rechazo: motivo
    })
    .eq('id', pedido_id);
  
  revalidatePath('/admin/pagos');
  return { success: true };
}
```

#### 4. Inventario (`/admin/inventario`)

**Funcionalidades:**
- CRUD de productos
- CRUD de categorías (con subcategorías)
- Alertas de stock bajo

**Server Actions:**
```typescript
export async function createProduct(data: ProductFormData) {
  const validated = productSchema.parse(data);
  
  const { error } = await supabase
    .from('productos')
    .insert(validated);
  
  if (error) return { success: false, message: 'Error al crear' };
  
  revalidatePath('/admin/inventario');
  return { success: true };
}

export async function updateProduct(id: string, data: ProductFormData) {
  const validated = productSchema.parse(data);
  
  await supabase
    .from('productos')
    .update(validated)
    .eq('id', id);
  
  revalidatePath('/admin/inventario');
  return { success: true };
}

export async function deleteProduct(id: string) {
  // No borrar, solo marcar como inactivo
  await supabase
    .from('productos')
    .update({ activo: false })
    .eq('id', id);
  
  revalidatePath('/admin/inventario');
  return { success: true };
}
```

#### 5. Caja Diaria (`/admin/caja`)

**Funcionalidades:**
- Apertura manual con saldo inicial
- Registro automático de ingresos (al entregar)
- Registro manual de egresos
- Cierre con resumen y PDF

**Server Actions:**
```typescript
export async function openCashRegister(saldo_inicial: number) {
  const hoy = new Date().toISOString().split('T')[0];
  
  const { data: existente } = await supabase
    .from('caja_diaria')
    .select('id')
    .eq('fecha', hoy)
    .eq('estado', 'abierta')
    .single();
  
  if (existente) {
    return { success: false, message: 'Caja ya abierta hoy' };
  }
  
  await supabase.from('caja_diaria').insert({
    fecha: hoy,
    hora_apertura: new Date().toISOString(),
    saldo_inicial,
    estado: 'abierta'
  });
  
  revalidatePath('/admin/caja');
  return { success: true };
}

export async function registerExpense(data: {
  concepto: string;
  monto: number;
  tipo_egreso: string;
  metodo_pago: string;
}) {
  const validated = expenseSchema.parse(data);
  const hoy = new Date().toISOString().split('T')[0];
  
  await supabase.from('caja_movimientos').insert({
    fecha: hoy,
    tipo: 'egreso',
    ...validated
  });
  
  revalidatePath('/admin/caja');
  return { success: true };
}

export async function closeCashRegister() {
  const hoy = new Date().toISOString().split('T')[0];
  
  const { data: caja } = await supabase
    .from('caja_diaria')
    .select('*')
    .eq('fecha', hoy)
    .single();
  
  const { data: movimientos } = await supabase
    .from('caja_movimientos')
    .select('*')
    .eq('fecha', hoy);
  
  const ingresos = movimientos
    ?.filter(m => m.tipo === 'ingreso')
    .reduce((sum, m) => sum + m.monto, 0) || 0;
  
  const egresos = movimientos
    ?.filter(m => m.tipo === 'egreso')
    .reduce((sum, m) => sum + m.monto, 0) || 0;
  
  const saldo_final = caja.saldo_inicial + ingresos - egresos;
  
  await supabase
    .from('caja_diaria')
    .update({
      hora_cierre: new Date().toISOString(),
      total_ingresos: ingresos,
      total_egresos: egresos,
      saldo_final,
      estado: 'cerrada'
    })
    .eq('id', caja.id);
  
  revalidatePath('/admin/caja');
  return { success: true, data: { saldo_final, ingresos, egresos } };
}
```

---

## 🔄 FLUJOS DE TRABAJO PRINCIPALES

### Flujo 1: Cliente Realiza Pedido

```
1. Login simple (teléfono)
   ↓
2. Navega catálogo
   ↓
3. Agrega productos al carrito (Zustand)
   ↓
4. Va a checkout
   ↓
5. Completa datos de entrega
   ↓
6. Selecciona método de pago
   • Efectivo → Sin recargo
   • Tarjeta → Cuotas + Recargo
   • Transferencia → QR + Comprobante
   ↓
7. Confirma pedido
   ↓
8. Server Action: crear_pedido (transacción)
   ↓
9. Pedido en estado "recibido"
   ↓
10. Redirige a /pedidos/[id] (seguimiento)
```

### Flujo 2: Admin Gestiona Pedido

```
1. Notificación de nuevo pedido (⚠️ rojo)
   ↓
2. Revisa detalles
   ↓
3. Si es transferencia → Valida pago en /admin/pagos
   ↓
4. Cambia estado a "Preparando"
   • Sistema descuenta stock automáticamente
   ↓
5. Imprime ticket térmico
   ↓
6. Cambia estado a "En Camino"
   ↓
7. Repartidor entrega
   ↓
8. Admin cambia a "Entregado"
   • Sistema registra ingreso en caja automáticamente
   ↓
9. Cliente ve actualización en tiempo real
```

### Flujo 3: Ciclo de Caja

```
1. Apertura manual (saldo inicial)
   ↓
2. Durante el día:
   • Ingresos automáticos (pedidos entregados)
   • Egresos manuales (gastos, retiros)
   ↓
3. Cierre manual
   • Calcula totales
   • Genera PDF
   • Guarda historial
```

---

## 📁 ESTRUCTURA DE CARPETAS

```
/
├── stitch_seguimiento_de_pedido_cliente/    ⭐ DISEÑO EXISTENTE - REVISAR PRIMERO
│   └── (componentes UI ya creados y estilos)
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/page.tsx
│   │   ├── (cliente)/
│   │   │   ├── catalogo/page.tsx
│   │   │   ├── checkout/page.tsx
│   │   │   ├── mis-pedidos/page.tsx
│   │   │   └── pedidos/[id]/page.tsx
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── page.tsx (dashboard)
│   │   │       ├── pedidos/page.tsx
│   │   │       ├── inventario/page.tsx
│   │   │       ├── pagos/page.tsx
│   │   │       └── caja/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx (landing)
│   │   └── middleware.ts
│   ├── components/
│   │   ├── ui/ (shadcn) ← Revisar stitch_seguimiento_de_pedido_cliente primero
│   │   ├── shared/
│   │   ├── catalogo/
│   │   ├── checkout/
│   │   ├── pedidos/
│   │   └── admin/
│   ├── actions/
│   │   ├── authActions.ts
│   │   ├── productActions.ts
│   │   ├── orderActions.ts
│   │   ├── paymentActions.ts
│   │   ├── inventoryActions.ts
│   │   └── cashActions.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── notificationStore.ts
│   └── types/
│       ├── database.ts
│       └── models.ts
├── public/
│   ├── logo.svg
│   ├── qr-pago.png
│   └── placeholder.png
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

### ⚠️ Notas Importantes sobre la Estructura:

1. **La carpeta `stitch_seguimiento_de_pedido_cliente/` es prioritaria** para todo lo relacionado con diseño UI
2. Antes de crear cualquier componente en `src/components/`, revisa si ya existe algo similar en `stitch_seguimiento_de_pedido_cliente/`
3. Los componentes de `shadcn/ui` pueden complementar pero no reemplazar el diseño existente
4. Mantén consistencia visual entre el diseño existente y las nuevas funcionalidades

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Funcionalidades Core

**Autenticación:**
- [ ] Login con teléfono funciona
- [ ] Registro automático funciona
- [ ] Sesión persiste en Zustand

**Catálogo:**
- [ ] Productos se muestran correctamente
- [ ] Búsqueda en tiempo real funciona
- [ ] Filtro por categoría funciona
- [ ] Carrito suma correctamente
- [ ] No se agregan productos sin stock

**Checkout:**
- [ ] Formulario valida campos
- [ ] Recargo de tarjeta se calcula bien
- [ ] Pedido se crea correctamente
- [ ] Carrito se vacía después
- [ ] Redirección funciona

**Seguimiento:**
- [ ] Timeline muestra estados
- [ ] Actualización en tiempo real
- [ ] Detalles son precisos

**Admin - Pedidos:**
- [ ] Lista muestra todos
- [ ] Filtros funcionan
- [ ] Cambio de estado funciona
- [ ] Stock se descuenta al "Preparando"
- [ ] Ingreso a caja al "Entregar"
- [ ] Impresión funciona
- [ ] Notificación roja en nuevos

**Admin - Pagos:**
- [ ] Lista transferencias pendientes
- [ ] Visualiza comprobante
- [ ] Aprobar/Rechazar funciona

**Admin - Inventario:**
- [ ] CRUD productos completo
- [ ] CRUD categorías completo
- [ ] Alertas de stock bajo
- [ ] Validaciones funcionan

**Admin - Caja:**
- [ ] Apertura/Cierre funciona
- [ ] Ingresos automáticos se registran
- [ ] Egresos manuales se guardan
- [ ] Cálculos son correctos

**Seguridad:**
- [ ] RLS activado en todas las tablas
- [ ] Clientes solo ven sus datos
- [ ] Admin ve todo
- [ ] Middleware protege rutas admin

---

## 🚀 GUÍA DE INICIO

### 1. Instalación

```bash
# Crear proyecto
npx create-next-app@latest sistema-ventas --typescript --tailwind --app
cd sistema-ventas

# Instalar dependencias
npm install @supabase/supabase-js zustand
npm install react-hook-form zod @hookform/resolvers/zod
npm install @tanstack/react-table date-fns sonner

# shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input select textarea label card table
```

### 2. Configurar Supabase

1. Crear proyecto en https://supabase.com
2. Crear `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
```
3. Ejecutar scripts SQL del esquema

### 3. Crear Cliente Supabase

```typescript
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### 4. Orden de Implementación

**PASO 0 (CRÍTICO):**
```bash
# ANTES DE CUALQUIER COSA:
# Revisa completamente la carpeta stitch_seguimiento_de_pedido_cliente/
# Documenta qué componentes ya existen
# Identifica patrones de diseño
# Haz un inventario de componentes reutilizables
```

**Pasos de implementación:**

1. ✅ **Revisión de diseño existente** (`stitch_seguimiento_de_pedido_cliente/`)
2. ✅ Base de datos (ejecutar SQL)
3. ✅ Cliente Supabase + tipos
4. ✅ Auth Store (Zustand)
5. ✅ Autenticación simple (reutilizando UI existente)
6. ✅ Cart Store (Zustand)
7. ✅ Catálogo de productos (adaptando componentes existentes)
8. ✅ Checkout (reutilizando formularios existentes)
9. ✅ Seguimiento (usando componentes de la carpeta existente)
10. ✅ Dashboard admin
11. ✅ Gestión de pedidos
12. ✅ Inventario
13. ✅ Validación de pagos
14. ✅ Caja diaria

**Nota:** En cada paso de UI, primero busca componentes similares en `stitch_seguimiento_de_pedido_cliente/`

### 5. Deploy

```bash
# Build local
npm run build

# Deploy en Vercel
vercel deploy
```

---

## 📝 NOTAS FINALES

### Variables de Entorno

```env
# Obligatorias
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Opcionales (futuro)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
```

### Mejoras Futuras (Fuera de Scope)

1. Notificaciones push
2. SMS/Email automáticos
3. WhatsApp Business API
4. Dashboard de métricas avanzadas
5. Roles adicionales (cajero, repartidor)
6. Multi-tenant
7. App móvil
8. Integración con MercadoPago

### Consideraciones de Seguridad

1. ✅ RLS activado en TODAS las tablas
2. ✅ Validación en cliente Y servidor
3. ✅ HTTPS obligatorio (Vercel lo maneja)
4. ✅ Variables de entorno nunca en el código
5. ✅ Transacciones para operaciones críticas

### Performance

1. ✅ Server Components por defecto
2. ✅ Client Components solo cuando necesario
3. ✅ Índices en columnas consultadas frecuentemente
4. ✅ Paginación en listados grandes
5. ✅ Imágenes optimizadas con Next.js Image

---

## 🎯 REGLA DE ORO FINAL

**Si algo no está claro o puede comprometer datos:**

1. ❌ NO asumas
2. ❌ NO improvises
3. ✅ **PREGUNTA** al usuario
4. ✅ **ESPERA** confirmación
5. ✅ **DOCUMENTA** en ARCHITECTURE.md

---

## 📞 CONTACTOS Y RECURSOS

**Documentación:**
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Zustand: https://docs.pmnd.rs/zustand
- shadcn/ui: https://ui.shadcn.com
- React Hook Form: https://react-hook-form.com
- Zod: https://zod.dev

---

**ESTE DOCUMENTO ES LA FUENTE ÚNICA DE VERDAD PARA EL PROYECTO**

✅ Listo para ser usado por una IA  
✅ Incluye todas las reglas de desarrollo  
✅ Incluye toda la arquitectura  
✅ Incluye todos los flujos  
✅ Incluye toda la base de datos  
✅ Incluye guía de inicio completa  

**Versión:** 1.0  
**Fecha:** 16/01/2026  
**Estado:** 🚀 PRODUCCIÓN

---

