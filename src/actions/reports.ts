'use server'

import { mockReportes } from '@/lib/mockData'

export async function getSalesReport() {
    // Usar datos mock
    return mockReportes
}
