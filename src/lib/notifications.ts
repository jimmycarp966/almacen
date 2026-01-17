// Utilidades para manejar notificaciones push

export interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

/**
 * Verifica el estado actual de los permisos de notificación
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, denied: false, default: false }
  }

  const permission = Notification.permission
  return {
    granted: permission === 'granted',
    denied: permission === 'denied',
    default: permission === 'default',
  }
}

/**
 * Solicita permiso para mostrar notificaciones
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Las notificaciones no son compatibles con este navegador')
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

/**
 * Muestra una notificación push
 */
export function showNotification(
  title: string,
  options: NotificationOptions = {}
): Notification | null {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Las notificaciones no son compatibles con este navegador')
    return null
  }

  if (Notification.permission !== 'granted') {
    console.warn('Permiso de notificación no concedido')
    return null
  }

  const defaultOptions: NotificationOptions = {
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    ...options,
  }

  try {
    return new Notification(title, defaultOptions)
  } catch (error) {
    console.error('Error mostrando notificación:', error)
    return null
  }
}

/**
 * Muestra una notificación de pedido
 */
export function showOrderNotification(
  orderNumber: string,
  status: string,
  message: string
): Notification | null {
  const statusMessages: Record<string, string> = {
    recibido: 'Tu pedido ha sido recibido',
    preparacion: 'Tu pedido está en preparación',
    en_camino: 'Tu pedido está en camino',
    entregado: '¡Tu pedido ha sido entregado!',
    cancelado: 'Tu pedido ha sido cancelado',
  }

  return showNotification(`Pedido ${orderNumber}`, {
    body: statusMessages[status] || message,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `order-${orderNumber}`,
    data: {
      orderId: orderNumber,
      status,
    },
  })
}

/**
 * Muestra una notificación de nuevo pedido (para admin)
 */
export function showNewOrderNotification(
  orderNumber: string,
  customerName: string,
  total: number
): Notification | null {
  return showNotification('Nuevo Pedido Recibido', {
    body: `Pedido ${orderNumber} de ${customerName} - $${total.toLocaleString('es-AR')}`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `order-${orderNumber}`,
    data: {
      orderId: orderNumber,
    },
  })
}

/**
 * Muestra una notificación de alerta de stock bajo
 */
export function showLowStockNotification(
  productName: string,
  currentStock: number,
  minStock: number
): Notification | null {
  return showNotification('⚠️ Stock Bajo', {
    body: `${productName} - Stock actual: ${currentStock} (Mínimo: ${minStock})`,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: `stock-${productName}`,
  })
}

/**
 * Registra el Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Worker no es compatible con este navegador')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('Service Worker registrado con éxito:', registration.scope)
    return registration
  } catch (error) {
    console.error('Error registrando Service Worker:', error)
    return null
  }
}

/**
 * Solicita permiso de notificación y registra Service Worker
 */
export async function setupNotifications(): Promise<{
  permissionGranted: boolean
  serviceWorkerRegistered: boolean
}> {
  const permissionGranted = await requestNotificationPermission()
  const serviceWorkerRegistered = await registerServiceWorker() !== null

  return {
    permissionGranted,
    serviceWorkerRegistered,
  }
}

/**
 * Suscribe al canal de push notifications
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  if (!('PushManager' in window)) {
    console.warn('Push notifications no son compatibles con este navegador')
    return null
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    console.log('Suscrito a push notifications:', subscription)
    return subscription
  } catch (error) {
    console.error('Error suscribiendo a push notifications:', error)
    return null
  }
}

/**
 * Cancela la suscripción a push notifications
 */
export async function unsubscribeFromPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      console.log('Desuscrito de push notifications')
      return true
    }
    return false
  } catch (error) {
    console.error('Error cancelando suscripción:', error)
    return false
  }
}
