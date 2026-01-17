'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getCajaActual() {
    const { data, error } = await supabase
        .from('caja_diaria')
        .select('*')
        .eq('estado', 'abierta')
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current caja:', error)
    }
    return data
}

export async function getMovimientosCaja(fecha: string) {
    const { data, error } = await supabase
        .from('caja_movimientos')
        .select('*')
        .eq('fecha', fecha)
        .order('fecha_hora', { ascending: false })

    if (error) {
        console.error('Error fetching movements:', error)
        return []
    }
    return data
}

export async function abrirCaja(montoInicial: number, usuarioId: string) {
    const hoy = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('caja_diaria')
        .insert([{
            fecha: hoy,
            hora_apertura: new Date().toISOString(),
            saldo_inicial: montoInicial,
            saldo_actual: montoInicial,
            usuario_apertura_id: usuarioId, // Nota: asumimos que esto es un UUID válido de usuario admin
            estado: 'abierta'
        }])
        .select()
        .single()

    if (!error) revalidatePath('/admin/caja')
    return { data, error }
}

export async function registrarEgreso(monto: number, concepto: string, notas?: string) {
    const hoy = new Date().toISOString().split('T')[0]

    const { error } = await supabase
        .from('caja_movimientos')
        .insert([{
            fecha: hoy,
            tipo: 'egreso',
            concepto,
            monto,
            metodo_pago: 'efectivo', // Generalmente egresos son en efectivo
            notas,
            fecha_hora: new Date().toISOString()
        }])

    if (!error) {
        // Actualizar saldo_actual en caja_diaria
        const { data: caja } = await supabase.from('caja_diaria').select('id, saldo_actual').eq('fecha', hoy).eq('estado', 'abierta').single()
        if (caja) {
            await supabase.from('caja_diaria').update({ saldo_actual: Number(caja.saldo_actual) - monto }).eq('id', caja.id)
        }
        revalidatePath('/admin/caja')
    }

    return { error }
}

export async function cerrarCaja(cajaId: string) {
    const { data: movements } = await supabase.from('caja_movimientos').select('*').eq('fecha', new Date().toISOString().split('T')[0])

    const ingresos = movements?.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + Number(m.monto), 0) || 0
    const egresos = movements?.filter(m => m.tipo === 'egreso').reduce((acc, m) => acc + Number(m.monto), 0) || 0

    // Desgloses
    const desgloseEfectivo = movements?.filter(m => m.tipo === 'ingreso' && m.metodo_pago === 'efectivo').reduce((acc, m) => acc + Number(m.monto), 0) || 0
    const desgloseTarjeta = movements?.filter(m => m.tipo === 'ingreso' && m.metodo_pago === 'tarjeta').reduce((acc, m) => acc + Number(m.monto), 0) || 0
    const desgloseTransferencia = movements?.filter(m => m.tipo === 'ingreso' && m.metodo_pago === 'transferencia').reduce((acc, m) => acc + Number(m.monto), 0) || 0

    const { data: caja } = await supabase.from('caja_diaria').select('*').eq('id', cajaId).single()
    const saldoFinal = Number(caja.saldo_inicial) + ingresos - egresos

    const { error } = await supabase
        .from('caja_diaria')
        .update({
            estado: 'cerrada',
            hora_cierre: new Date().toISOString(),
            total_ingresos: ingresos,
            total_egresos: egresos,
            saldo_final: saldoFinal,
            saldo_actual: saldoFinal,
            desglose_efectivo: desgloseEfectivo,
            desglose_tarjeta: desgloseTarjeta,
            desglose_transferencia: desgloseTransferencia
        })
        .eq('id', cajaId)

    if (!error) revalidatePath('/admin/caja')
    return { error }
}
