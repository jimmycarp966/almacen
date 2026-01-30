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
    _hasHydrated: boolean
    setSession: (user: User | null) => void
    clearSession: () => void
    setHasHydrated: (state: boolean) => void
}

console.log('[DEBUG sessionStore] Creando store')

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setSession: (user) => {
                set({ user, isAuthenticated: !!user })
            },
            clearSession: () => {
                set({ user: null, isAuthenticated: false })
            },
            setHasHydrated: (state) => {
                set({ _hasHydrated: state })
            },
        }),
        {
            name: 'super-aguilares-session',
            onRehydrateStorage: () => {
                return (state: SessionState | undefined) => {
                    state?.setHasHydrated(true)
                }
            }
        }
    )
)
