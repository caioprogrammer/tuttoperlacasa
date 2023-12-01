import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useNewsletter } from '../NewsletterContext'

interface InputProps {
  fieldEntity: string
  label?: string
  type?: string
  value: string
  placeholder?: string
  errorMessage?: string
  autocomplete?: string
  onChange: (text: string) => void
}

const CSS_HANDLES = [
  'inputContainer',
  'input',
  'label',
  'error',
  'errorMessage'
]

const Input = ({
  fieldEntity,
  type = "text",
  label,
  value,
  errorMessage,
  placeholder,
  autocomplete = 'off',
  onChange
}: InputProps) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { errors, } = useNewsletter()
  const error = Object.keys(errors).some((key) => key === fieldEntity)

  return (
    <div
      className={`${handles['inputContainer']} ${handles['inputContainer']}--${fieldEntity} ${
        error ? `${handles.error} ${handles.error}--${errors[fieldEntity]}` : ''
      }`}
    >
      {label && (
        <label
          className={handles.label}
          htmlFor={fieldEntity}
        >
          {label}
        </label>
      )}
      <input
        onChange={(e) => {onChange(e.target.value)}}
        value={value}
        id={fieldEntity}
        type={type}
        className={handles.input}
        placeholder={placeholder}
        autoComplete={autocomplete}
      />
      {error ? <span className={`${handles.errorMessage} ${handles.errorMessage}-${fieldEntity}`}>{errorMessage}</span> : ''}
    </div>
  )
}

export default Input
