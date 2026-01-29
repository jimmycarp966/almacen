import { redirect } from 'next/navigation'

export default function AdminPage() {
    // Redirigir directamente a productos
    redirect('/admin/productos')
}
