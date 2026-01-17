'use client'

import { useEffect } from 'react'
import { setupNotifications } from '@/lib/notifications'

export function NotificationSetup() {
  useEffect(() => {
    // Solicitar permisos de notificación y registrar Service Worker
    setupNotifications().then((result) => {
      console.log('Notificaciones configuradas:', result)
    }).catch((error) => {
      console.error('Error configurando notificaciones:', error)
    })
  }, [])

  return null
}
