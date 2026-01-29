'use client'

import { useState, useRef, useEffect } from 'react'

interface NumberInputProps {
  value: number | string
  onChange: (value: number | null) => void
  min?: number
  max?: number
  step?: number | string
  placeholder?: string
  className?: string
  disabled?: boolean
  id?: string
  name?: string
  required?: boolean
}

/**
 * Componente de input numérico que permite borrar completamente el valor.
 * Soluciona el problema de los inputs type="number" nativos que no permiten vaciar el campo.
 */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = '1',
  placeholder = '0',
  className = '',
  disabled = false,
  id,
  name,
  required = false
}: NumberInputProps) {
  // Estado interno como string para permitir valor vacío
  const [internalValue, setInternalValue] = useState(() => {
    if (value === null || value === undefined || value === '') return ''
    return String(value)
  })

  const inputRef = useRef<HTMLInputElement>(null)

  // Sincronizar valor externo con estado interno
  useEffect(() => {
    if (value === null || value === undefined || value === '') {
      setInternalValue('')
    } else {
      setInternalValue(String(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Permitir valor vacío o string vacío
    if (newValue === '' || newValue === '-') {
      setInternalValue(newValue)
      return
    }

    // Validar que sea un número válido
    const numValue = parseFloat(newValue)
    if (!isNaN(numValue)) {
      setInternalValue(newValue)
      onChange(numValue)
    }
  }

  const handleBlur = () => {
    if (internalValue === '' || internalValue === '-') {
      // Al perder foco, si está vacío, enviar null
      setInternalValue('')
      onChange(null)
    } else {
      const numValue = parseFloat(internalValue)
      if (!isNaN(numValue)) {
        // Aplicar restricciones min/max
        let finalValue = numValue
        if (min !== undefined && finalValue < min) finalValue = min
        if (max !== undefined && finalValue > max) finalValue = max

        setInternalValue(String(finalValue))
        onChange(finalValue)
      }
    }
  }

  return (
    <input
      ref={inputRef}
      type="number"
      id={id}
      name={name}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      step={step}
      min={min}
      max={max}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={className}
    />
  )
}
