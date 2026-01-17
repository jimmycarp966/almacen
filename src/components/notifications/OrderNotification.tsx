'use client'

import { OrderEvent } from '@/lib/realtime'
import { useState } from 'react'

interface OrderNotificationProps {
  event: OrderEvent
  onClose: () => void
}

export function OrderNotification({ event, onClose }: OrderNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const getNotificationIcon = () => {
    switch (event.type) {
      case 'created':
        return <span className="material-symbols-outlined text-green-500">add_circle</span>
      case 'updated':
        return <span className="material-symbols-outlined text-blue-500">update</span>
      case 'cancelled':
        return <span className="material-symbols-outlined text-red-500">cancel</span>
      case 'delivered':
        return <span className="material-symbols-outlined text-green-600">check_circle</span>
      default:
        return <span className="material-symbols-outlined text-gray-500">info</span>
    }
  }

  const getNotificationTitle = () => {
    switch (event.type) {
      case 'created':
        return 'Nuevo Pedido'
      case 'updated':
        return 'Pedido Actualizado'
      case 'cancelled':
        return 'Pedido Cancelado'
      case 'delivered':
        return 'Pedido Entregado'
      default:
        return 'Notificación'
    }
  }

  const getNotificationMessage = () => {
    const estadoMessages: Record<string, string> = {
      recibido: 'Tu pedido ha sido recibido',
      preparacion: 'Tu pedido está en preparación',
      en_camino: 'Tu pedido está en camino',
      entregado: '¡Tu pedido ha sido entregado!',
      cancelado: 'Tu pedido ha sido cancelado',
    }

    if (event.type === 'created') {
      return `Pedido ${event.order.numero} creado exitosamente`
    }

    return estadoMessages[event.order.estado] || 'Estado de pedido actualizado'
  }

  const getTimeAgo = () => {
    const now = new Date()
    const eventTime = new Date(event.timestamp)
    const diffMs = now.getTime() - eventTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Ahora mismo'
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
    
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        bg-white rounded-lg shadow-lg border border-gray-200
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icono */}
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon()}
          </div>

          {/* Contenido */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {getNotificationTitle()}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {getNotificationMessage()}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Información adicional */}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="font-medium text-gray-600">
                #{event.order.numero}
              </span>
              <span>•</span>
              <span>{getTimeAgo()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso para auto-dismiss */}
      <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-[5000ms] ease-linear"
          style={{
            animation: 'shrink 5s linear forwards',
          }}
        />
      </div>
    </div>
  )
}

// Componente contenedor para todas las notificaciones
interface NotificationsContainerProps {
  notifications: OrderEvent[]
  onRemoveNotification: (index: number) => void
  onClearAll: () => void
}

export function NotificationsContainer({
  notifications,
  onRemoveNotification,
  onClearAll,
}: NotificationsContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((event, index) => (
        <OrderNotification
          key={`${event.order.id}-${event.timestamp}`}
          event={event}
          onClose={() => onRemoveNotification(index)}
        />
      ))}
      
      {notifications.length > 1 && (
        <button
          onClick={onClearAll}
          className="fixed top-4 right-4 mt-2 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          style={{ marginTop: `${notifications.length * 140}px` }}
        >
          Limpiar todas ({notifications.length})
        </button>
      )}
    </div>
  )
}

// Estilos para la animación de la barra de progreso
const style = document.createElement('style')
style.textContent = `
  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`
document.head.appendChild(style)
