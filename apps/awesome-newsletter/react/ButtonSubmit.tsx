import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

interface ButtonSubmitProps {
  label?: string
}

const ButtonSubmit = ({ label = 'Cadastrar' }: ButtonSubmitProps) => {
  const buttonHandles = [
    'submitContainer',
    'submitButton',
  ]

  const { handles } = useCssHandles(buttonHandles)

  return (
    <div className={handles.submitContainer}>
      <button
        type="submit"
        className={handles.submitButton}
      >
        {label}
      </button>
    </div>
  )
}

export default ButtonSubmit
