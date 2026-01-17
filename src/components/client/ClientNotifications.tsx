'use client'

import { useRealtimeOrders } from '@/hooks/useRealtimeOrders'
import { NotificationsContainer } from '@/components/notifications/OrderNotification'

export function ClientNotifications() {
  const {
    notifications,
    isConnected,
    clearNotifications,
    removeNotification,
  } = useRealtimeOrders()

  return (
    <>
      {/* Indicador de conexión */}
      {isConnected && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Conectado en tiempo real
        </div>
      )}

      {/* Contenedor de notificaciones */}
      <NotificationsContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearNotifications}
      />
    </>
  )
}
