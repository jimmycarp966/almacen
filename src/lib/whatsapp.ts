// Utilidad para generar URLs de WhatsApp con mensajes formateados

export interface WhatsAppOrderData {
    items: Array<{
        nombre: string
        cantidad: number
        precio: number
        subtotal: number
    }>
    tipoEntrega: 'domicilio' | 'retiro'
    costoEntrega: number
    metodoPago: string
    cuotas?: number
    recargo?: number
    subtotal: number
    total: number
}

/**
 * Genera una URL de WhatsApp con el mensaje del pedido formateado
 */
export function generateWhatsAppUrl(phoneNumber: string, orderData: WhatsAppOrderData): string {
    const message = formatOrderMessage(orderData)
    // Remover caracteres especiales del número
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Formatea el mensaje del pedido para WhatsApp
 */
export function formatOrderMessage(orderData: WhatsAppOrderData): string {
    const { items, tipoEntrega, costoEntrega, metodoPago, cuotas, recargo, subtotal, total } = orderData

    // Header
    let message = `🛒 *NUEVO PEDIDO*\n`
    message += `━━━━━━━━━━━━━━━━━\n\n`

    // Productos
    message += `📦 *PRODUCTOS:*\n`
    items.forEach(item => {
        message += `• ${item.nombre}\n`
        message += `   ${item.cantidad}x $${item.precio.toLocaleString('es-AR')} = $${item.subtotal.toLocaleString('es-AR')}\n`
    })
    message += `\n`

    // Entrega
    message += `🚚 *ENTREGA:*\n`
    if (tipoEntrega === 'domicilio') {
        message += `• Entrega a domicilio (+$${costoEntrega.toLocaleString('es-AR')})\n`
    } else {
        message += `• Retiro en local (sin cargo)\n`
    }
    message += `\n`

    // Método de pago
    message += `💳 *MÉTODO DE PAGO:*\n`
    message += `• ${metodoPago}`
    if (cuotas && cuotas > 1) {
        message += ` en ${cuotas} cuotas`
    }
    message += `\n`
    if (recargo && recargo > 0) {
        message += `• Recargo: +$${recargo.toLocaleString('es-AR')}\n`
    }
    message += `\n`

    // Totales
    message += `━━━━━━━━━━━━━━━━━\n`
    message += `📝 Subtotal: $${subtotal.toLocaleString('es-AR')}\n`
    if (costoEntrega > 0) {
        message += `🚚 Envío: +$${costoEntrega.toLocaleString('es-AR')}\n`
    }
    if (recargo && recargo > 0) {
        message += `💳 Recargo: +$${recargo.toLocaleString('es-AR')}\n`
    }
    message += `💰 *TOTAL: $${total.toLocaleString('es-AR')}*\n`
    message += `━━━━━━━━━━━━━━━━━\n\n`

    // Mensaje de confianza
    message += `🛡️ *IMPORTANTE:*\n`
    message += `El pago se realizará al momento de la entrega.\n`
    message += `Pagás cuando recibís y controlás tu pedido.\n\n`

    message += `¡Gracias por tu pedido! 🙏`

    return message
}
