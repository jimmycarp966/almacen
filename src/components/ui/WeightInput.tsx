'use client'

import { useState } from 'react'

interface WeightInputProps {
  value: number  // Valor en kilogramos (ej: 0.25 = 250g)
  onChange: (value: number) => void
  min?: number  // Mínimo en kg (default: 0.1 = 100g)
  max?: number  // Máximo en kg (default: 10 = 10kg)
  step?: string  // Paso para el input (default: "0.001")
  disabled?: boolean
  className?: string
  showButtons?: boolean  // Mostrar botones de preselección
}

/**
 * Componente de entrada de peso para productos de balanza.
 * Muestra botones de preselección (100g, 250g, 500g, 1kg) y un input numérico.
 * El valor se maneja internamente en kilogramos pero se muestra de forma amigable.
 */
export function WeightInput({
  value,
  onChange,
  min = 0.1,  // 100g mínimo
  max = 10,   // 10kg máximo
  step = '0.001',
  disabled = false,
  className = '',
  showButtons = true,
}: WeightInputProps) {
  const [inputValue, setInputValue] = useState(() => {
    // Convertir a string con máximo 3 decimales
    return value.toFixed(3).replace(/\.?0+$/, '')
  })

  const presets = [
    { label: '100g', value: 0.1 },
    { label: '250g', value: 0.25 },
    { label: '500g', value: 0.5 },
    { label: '1kg', value: 1 },
  ]

  const handlePresetClick = (presetValue: number) => {
    const newValue = value + presetValue
    if (newValue <= max) {
      onChange(newValue)
      setInputValue(newValue.toFixed(3).replace(/\.?0+$/, ''))
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValueStr = e.target.value
    setInputValue(newValueStr)

    const newValue = parseFloat(newValueStr)
    if (!isNaN(newValue)) {
      onChange(newValue)
    }
  }

  const handleBlur = () => {
    // Al perder foco, formatear el valor
    if (isNaN(value) || value < min) {
      onChange(min)
      setInputValue(min.toFixed(3).replace(/\.?0+$/, ''))
    } else if (value > max) {
      onChange(max)
      setInputValue(max.toFixed(3).replace(/\.?0+$/, ''))
    } else {
      setInputValue(value.toFixed(3).replace(/\.?0+$/, ''))
    }
  }

  const formatWeight = (kg: number): string => {
    if (kg < 1) {
      // Mostrar en gramos si es menos de 1kg
      const grams = Math.round(kg * 1000)
      return `${grams}g`
    }
    // Mostrar en kg con hasta 2 decimales si es necesario
    return kg.toFixed(2).replace(/\.?0+$/, '') + 'kg'
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showButtons && (
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              disabled={disabled}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold text-text-main transition-colors"
            >
              +{preset.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          step={step}
          min={min}
          max={max}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text-main font-bold"
          placeholder="0.1"
        />
        <span className="text-sm font-bold text-text-secondary min-w-[30px]">kg</span>
      </div>

      {value > 0 && (
        <div className="text-xs text-text-secondary">
          Total: <span className="font-bold">{formatWeight(value)}</span>
        </div>
      )}
    </div>
  )
}
