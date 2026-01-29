'use client'

import { useState, useEffect } from 'react'
import { ejecutarMigraciones, verificarEstadoMigracion } from '@/actions/migrations'

export default function MigracionesAdminPage() {
  const [estado, setEstado] = useState<any>(null)
  const [ejecutando, setEjecutando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cargarEstado()
  }, [])

  async function cargarEstado() {
    try {
      const data = await verificarEstadoMigracion()
      setEstado(data)
    } catch (e) {
      setError('Error al verificar estado')
    }
  }

  async function handleEjecutar() {
    setEjecutando(true)
    setError(null)
    setResultado(null)

    try {
      const res = await ejecutarMigraciones()
      setResultado(res)
      // Recargar estado
      await cargarEstado()
    } catch (e: any) {
      setError(e.message || 'Error al ejecutar migraciones')
    } finally {
      setEjecutando(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-text-main mb-2">Migraciones de Base de Datos</h1>
          <p className="text-text-secondary">
            Ejecuta las migraciones pendientes para actualizar el sistema
          </p>
        </div>

        {/* Estado Actual */}
        {estado && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-text-main mb-4">Estado Actual</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Categoría Balanza:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${estado.categoriaBalanzaExiste ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {estado.categoriaBalanzaExiste ? '✅ Creada' : '❌ No existe'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Resultado */}
        {resultado && (
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-text-main mb-4">Resultado de la Ejecución</h2>
            <div className="space-y-2">
              {resultado.balanzaCreada && (
                <p className="text-sm text-text-secondary">
                  • ✅ Categoría Balanza creada
                </p>
              )}
              {resultado.errores && resultado.errores.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-bold text-red-600 mb-2">Errores:</p>
                  <ul className="text-sm text-red-500 list-disc list-inside">
                    {resultado.errores.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!resultado.balanzaCreada && resultado.errores.length === 0 && (
                <p className="text-sm text-text-secondary">
                  • ℹ️ La categoría Balanza ya existía, no se creó nada nuevo.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 font-bold">{error}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-text-main mb-4">Acciones</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleEjecutar}
              disabled={ejecutando}
              className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ejecutando ? '⏳ Ejecutando...' : '🚀 Ejecutar Migraciones'}
            </button>
            <button
              onClick={cargarEstado}
              disabled={ejecutando}
              className="px-6 py-3 bg-gray-100 text-text-main rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Refrescar Estado
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800 font-bold mb-2">📋 Qué hace esta migración:</p>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Crea la categoría <strong>Balanza</strong> para productos por peso</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              <strong>Importante:</strong> Los cambios en la estructura de la tabla (ALTER TABLE) deben ejecutarse
              manualmente en el SQL Editor de Supabase usando el archivo <code>supabase_migration_balanza.sql</code>
            </p>
          </div>

          {/* Instrucciones SQL */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-sm text-amber-800 font-bold mb-2">📝 Instrucciones SQL:</p>
            <ol className="text-sm text-amber-700 space-y-2 list-decimal list-inside">
              <li>Ve a tu panel de Supabase</li>
              <li>Abre el SQL Editor</li>
              <li>Copia y ejecuta el contenido del archivo <code>supabase_migration_balanza.sql</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
