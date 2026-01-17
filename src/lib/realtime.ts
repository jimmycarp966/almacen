import { RealtimeChannel, RealtimeClient } from '@supabase/realtime-js'
import { supabase } from './supabase'

// Tipos de eventos de pedidos
export type OrderEventType = 'created' | 'updated' | 'cancelled' | 'delivered'

// Interfaz para evento de pedido
export interface OrderEvent {
  type: OrderEventType
  order: {
    id: string
    numero: string
    estado: string
    cliente_id?: string
  }
  timestamp: string
}

// Clase para gestionar conexiones Realtime
export class RealtimeManager {
  private client: RealtimeClient | null = null
  private channels: Map<string, RealtimeChannel> = new Map()

  constructor() {
    this.initialize()
  }

  private initialize() {
    if (typeof window === 'undefined') return

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found for Realtime')
      return
    }

    this.client = new RealtimeClient(supabaseUrl, {
      params: {
        apikey: supabaseKey,
      },
    })
  }

  // Suscribirse a cambios en pedidos
  subscribeToOrders(
    userId: string,
    onOrderChange: (event: OrderEvent) => void,
    onError?: (error: Error) => void
  ): RealtimeChannel | null {
    if (!this.client) {
      console.warn('Realtime client not initialized')
      return null
    }

    const channelName = `orders:${userId}`
    
    // Si ya existe un canal con ese nombre, cerrarlo primero
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName)
    }

    const channel = this.client.channel(channelName)

    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos',
        filter: `cliente_id=eq.${userId}`,
      }, (payload) => {
        const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
        
        let orderType: OrderEventType = 'updated'
        if (eventType === 'INSERT') orderType = 'created'
        if (eventType === 'DELETE') orderType = 'cancelled'
        
        const event: OrderEvent = {
          type: orderType,
          order: payload.new as any,
          timestamp: new Date().toISOString(),
        }
        
        onOrderChange(event)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to orders for user ${userId}`)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to orders')
          onError?.(new Error('Failed to subscribe to orders'))
        }
      })

    this.channels.set(channelName, channel)
    return channel
  }

  // Suscribirse a todos los pedidos (para admin)
  subscribeToAllOrders(
    onOrderChange: (event: OrderEvent) => void,
    onError?: (error: Error) => void
  ): RealtimeChannel | null {
    if (!this.client) {
      console.warn('Realtime client not initialized')
      return null
    }

    const channelName = 'orders:all'
    
    if (this.channels.has(channelName)) {
      this.unsubscribe(channelName)
    }

    const channel = this.client.channel(channelName)

    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedidos',
      }, (payload) => {
        const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE'
        
        let orderType: OrderEventType = 'updated'
        if (eventType === 'INSERT') orderType = 'created'
        if (eventType === 'DELETE') orderType = 'cancelled'
        
        const event: OrderEvent = {
          type: orderType,
          order: payload.new as any,
          timestamp: new Date().toISOString(),
        }
        
        onOrderChange(event)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to all orders (admin)')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to all orders')
          onError?.(new Error('Failed to subscribe to all orders'))
        }
      })

    this.channels.set(channelName, channel)
    return channel
  }

  // Desuscribirse de un canal
  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      this.client?.removeChannel(channel)
      this.channels.delete(channelName)
      console.log(`Unsubscribed from ${channelName}`)
    }
  }

  // Desuscribirse de todos los canales
  unsubscribeAll() {
    this.channels.forEach((channel, name) => {
      this.unsubscribe(name)
    })
  }

  // Conectar el cliente Realtime
  async connect() {
    if (!this.client) return

    try {
      await this.client.connect()
      console.log('Realtime client connected')
    } catch (error) {
      console.error('Error connecting Realtime client:', error)
    }
  }

  // Desconectar el cliente Realtime
  disconnect() {
    this.unsubscribeAll()
    this.client?.disconnect()
    console.log('Realtime client disconnected')
  }
}

// Instancia singleton del manager
let realtimeManager: RealtimeManager | null = null

export function getRealtimeManager(): RealtimeManager {
  if (!realtimeManager) {
    realtimeManager = new RealtimeManager()
  }
  return realtimeManager
}

// Hook para usar notificaciones de pedidos
export function useOrderNotifications(
  userId: string | null,
  onOrderChange: (event: OrderEvent) => void,
  enabled: boolean = true
) {
  const manager = getRealtimeManager()

  React.useEffect(() => {
    if (!userId || !enabled) return

    const channel = manager.subscribeToOrders(userId, onOrderChange)

    return () => {
      if (channel) {
        manager.unsubscribe(`orders:${userId}`)
      }
    }
  }, [userId, enabled, onOrderChange])
}

import React from 'react'
