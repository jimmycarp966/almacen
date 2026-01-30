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
                console.log('[DEBUG sessionStore] setSession llamado:', user)
                set({ user, isAuthenticated: !!user })
            },
            clearSession: () => {
                console.log('[DEBUG sessionStore] clearSession llamado')
                set({ user: null, isAuthenticated: false })
            },
            setHasHydrated: (state) => {
                console.log('[DEBUG sessionStore] setHasHydrated:', state)
                set({ _hasHydrated: state })
            },
        }),
        {
            name: 'super-aguilares-session',
            onRehydrateStorage: () => {
                console.log('[DEBUG sessionStore] onRehydrateStorage iniciado')
                return (state: SessionState | undefined) => {
                    console.log('[DEBUG sessionStore] Rehidratación completa, state:', state?.user)
                    state?.setHasHydrated(true)
                }
            }
        }
    )
)
