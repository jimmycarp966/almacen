'use client'

import { useEffect, useState, useCallback } from 'react'
import { getRealtimeManager, OrderEvent } from '@/lib/realtime'
import { useSessionStore } from '@/store/sessionStore'

export function useRealtimeOrders() {
  const { user } = useSessionStore()
  const [notifications, setNotifications] = useState<OrderEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const handleOrderChange = useCallback((event: OrderEvent) => {
    setNotifications(prev => [event, ...prev].slice(0, 10)) // Mantener solo las últimas 10
    
    // Mostrar notificación del navegador si está disponible
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `Pedido ${event.order.numero}`
      const body = getOrderMessage(event.type, event.order.estado)
      
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: event.order.id,
      })
    }
  }, [])

  useEffect(() => {
    if (!user) return

    const manager = getRealtimeManager()
    
    // Conectar al cliente Realtime
    manager.connect().then(() => {
      setIsConnected(true)
    })

    // Suscribirse a cambios en los pedidos del usuario
    const channel = manager.subscribeToOrders(
      user.id,
      handleOrderChange,
      (error) => {
        console.error('Error en suscripción a pedidos:', error)
        setIsConnected(false)
      }
    )

    return () => {
      if (channel) {
        manager.unsubscribe(`orders:${user.id}`)
      }
    }
  }, [user, handleOrderChange])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const removeNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }, [])

  return {
    notifications,
    isConnected,
    clearNotifications,
    removeNotification,
  }
}

// Hook para admin - suscribirse a todos los pedidos
export function useRealtimeAllOrders() {
  const [notifications, setNotifications] = useState<OrderEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const handleOrderChange = useCallback((event: OrderEvent) => {
    setNotifications(prev => [event, ...prev].slice(0, 10))
    
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = `Nuevo Pedido ${event.order.numero}`
      const body = getOrderMessage(event.type, event.order.estado)
      
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: event.order.id,
      })
    }
  }, [])

  useEffect(() => {
    const manager = getRealtimeManager()
    
    manager.connect().then(() => {
      setIsConnected(true)
    })

    const channel = manager.subscribeToAllOrders(
      handleOrderChange,
      (error) => {
        console.error('Error en suscripción a todos los pedidos:', error)
        setIsConnected(false)
      }
    )

    return () => {
      if (channel) {
        manager.unsubscribe('orders:all')
      }
    }
  }, [handleOrderChange])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const removeNotification = useCallback((index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }, [])

  return {
    notifications,
    isConnected,
    clearNotifications,
    removeNotification,
  }
}

function getOrderMessage(type: OrderEvent['type'], estado: string): string {
  const estadoMessages: Record<string, string> = {
    recibido: 'Tu pedido ha sido recibido',
    preparacion: 'Tu pedido está en preparación',
    en_camino: 'Tu pedido está en camino',
    entregado: '¡Tu pedido ha sido entregado!',
    cancelado: 'Tu pedido ha sido cancelado',
  }

  if (type === 'created') {
    return '¡Pedido creado exitosamente!'
  }

  return estadoMessages[estado] || 'Estado de pedido actualizado'
}
