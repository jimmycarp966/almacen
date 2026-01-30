'use client'

import { useEffect, useState } from 'react'
import { setupNotifications } from '@/lib/notifications'
import { usePathname } from 'next/navigation'

export function NotificationSetup() {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  // No ejecutar en el admin para evitar errores de hidratación
  const isAdmin = pathname?.startsWith('/admin')

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted || isAdmin) return

    // Solicitar permisos de notificación y registrar Service Worker
    setupNotifications().then((result) => {
      console.log('Notificaciones configuradas:', result)
    }).catch((error) => {
      console.error('Error configurando notificaciones:', error)
    })
  }, [hasMounted, isAdmin])

  return null
}
