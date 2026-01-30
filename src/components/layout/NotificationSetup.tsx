'use client'

import { useEffect, useState } from 'react'
import { setupNotifications } from '@/lib/notifications'
import { usePathname } from 'next/navigation'

export function NotificationSetup() {
  const pathname = usePathname()
  const [hasMounted, setHasMounted] = useState(false)

  // No ejecutar en el admin para evitar errores de hidratación
  const isAdmin = pathname?.startsWith('/admin')

  console.log('[DEBUG NotificationSetup] pathname:', pathname, 'isAdmin:', isAdmin)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    console.log('[DEBUG NotificationSetup] useEffect - hasMounted:', hasMounted, 'isAdmin:', isAdmin)

    if (!hasMounted || isAdmin) {
      console.log('[DEBUG NotificationSetup] SALTANDO registro SW - isAdmin:', isAdmin, 'hasMounted:', hasMounted)
      return
    }

    console.log('[DEBUG NotificationSetup] Registrando Service Worker...')
    // Solicitar permisos de notificación y registrar Service Worker
    setupNotifications().then((result) => {
      console.log('Notificaciones configuradas:', result)
    }).catch((error) => {
      console.error('Error configurando notificaciones:', error)
    })
  }, [hasMounted, isAdmin])

  return null
}
