// Configuración centralizada de métodos de pago
// Ajustado para Super Aguilares - El pago se realiza al recibir el pedido

export interface MetodoPago {
    id: string
    nombre: string
    descripcion: string
    icono: string
    imagen?: string
    cuotasDisponibles: number[]
    recargos: Record<number, number> // cuotas -> porcentaje recargo
    activo: boolean
}

// Métodos de pago con tarjeta de crédito
export const TARJETAS_CREDITO: MetodoPago[] = [
    {
        id: 'visa',
        nombre: 'Visa',
        descripcion: 'Tarjeta de crédito Visa',
        icono: 'credit_card',
        imagen: '/cards/visa.svg',
        cuotasDisponibles: [1, 2, 3],
        recargos: { 1: 0.20, 2: 0.30, 3: 0.40 },
        activo: true
    },
    {
        id: 'mastercard',
        nombre: 'Mastercard',
        descripcion: 'Tarjeta de crédito Mastercard',
        icono: 'credit_card',
        imagen: '/cards/mastercard.svg',
        cuotasDisponibles: [1, 2, 3],
        recargos: { 1: 0.20, 2: 0.30, 3: 0.40 },
        activo: true
    },
    {
        id: 'cabal',
        nombre: 'Cabal',
        descripcion: 'Tarjeta de crédito Cabal',
        icono: 'credit_card',
        imagen: '/cards/cabal.svg',
        cuotasDisponibles: [1, 2, 3],
        recargos: { 1: 0.20, 2: 0.30, 3: 0.40 },
        activo: true
    },
    {
        id: 'maestro',
        nombre: 'Maestro',
        descripcion: 'Tarjeta Maestro',
        icono: 'credit_card',
        imagen: '/cards/maestro.svg',
        cuotasDisponibles: [1, 2, 3],
        recargos: { 1: 0.20, 2: 0.30, 3: 0.40 },
        activo: true
    },
    {
        id: 'naranja',
        nombre: 'Naranja',
        descripcion: 'Tarjeta Naranja',
        icono: 'credit_card',
        imagen: '/cards/naranja.svg',
        cuotasDisponibles: [1],
        recargos: { 1: 0.20 },
        activo: true
    },
    {
        id: 'zeta',
        nombre: 'Zeta (Z)',
        descripcion: 'Tarjeta Zeta',
        icono: 'credit_card',
        imagen: '/cards/zeta.svg',
        cuotasDisponibles: [1],
        recargos: { 1: 0.20 },
        activo: true
    },
    {
        id: 'credicash',
        nombre: 'Credicash',
        descripcion: 'Tarjeta Credicash',
        icono: 'credit_card',
        imagen: '/cards/credicash.svg',
        cuotasDisponibles: [1],
        recargos: { 1: 0.20 },
        activo: true
    }
]

// Métodos sin recargo
export const METODOS_SIN_RECARGO: MetodoPago[] = [
    {
        id: 'transferencia_qr',
        nombre: 'Transferencia / QR',
        descripcion: 'Pago con transferencia o QR al momento de la entrega',
        icono: 'qr_code_2',
        imagen: '/cards/qr.svg',
        cuotasDisponibles: [1],
        recargos: { 1: 0 },
        activo: true
    },
    {
        id: 'debito',
        nombre: 'Débito',
        descripcion: 'Tarjeta de débito',
        icono: 'account_balance',
        imagen: '/cards/debito.svg',
        cuotasDisponibles: [1],
        recargos: { 1: 0 },
        activo: true
    },
    {
        id: 'alimentar',
        nombre: 'Tarjeta Alimentar',
        descripcion: 'Tarjeta Alimentar del Estado',
        icono: 'restaurant',
        imagen: '/cards/alimentar.svg',
        cuotasDisponibles: [1],
        recargos: { 1: 0 },
        activo: true
    }
]

// Todos los métodos de pago
export const TODOS_METODOS_PAGO = [...TARJETAS_CREDITO, ...METODOS_SIN_RECARGO]

// Función para obtener recargo
export function calcularRecargo(metodoPagoId: string, cuotas: number, subtotal: number): number {
    const metodo = TODOS_METODOS_PAGO.find(m => m.id === metodoPagoId)
    if (!metodo) return 0
    const porcentaje = metodo.recargos[cuotas] || 0
    return Math.round(subtotal * porcentaje)
}

// Función para obtener cuotas disponibles
export function getCuotasDisponibles(metodoPagoId: string): number[] {
    const metodo = TODOS_METODOS_PAGO.find(m => m.id === metodoPagoId)
    return metodo?.cuotasDisponibles || [1]
}

// Función para obtener nombre del método
export function getNombreMetodo(metodoPagoId: string): string {
    const metodo = TODOS_METODOS_PAGO.find(m => m.id === metodoPagoId)
    return metodo?.nombre || metodoPagoId
}

// Función para verificar si tiene recargo
export function tieneRecargo(metodoPagoId: string): boolean {
    const metodo = TODOS_METODOS_PAGO.find(m => m.id === metodoPagoId)
    if (!metodo) return false
    return Object.values(metodo.recargos).some(r => r > 0)
}
