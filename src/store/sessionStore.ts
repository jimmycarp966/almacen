import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: string
    nombre: string
    telefono: string
    rol: 'cliente' | 'admin' | 'cajero' | 'repartidor'
}

interface SessionState {
    user: User | null
    isAuthenticated: boolean
    setSession: (user: User | null) => void
    clearSession: () => void
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setSession: (user) => set({ user, isAuthenticated: !!user }),
            clearSession: () => set({ user: null, isAuthenticated: false }),
        }),
        {
            name: 'super-aguilares-session',
        }
    )
)
