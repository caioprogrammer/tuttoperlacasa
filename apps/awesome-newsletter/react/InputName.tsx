import React, { useEffect } from 'react'
import Input from './components/Input'
import { useNewsletter } from './NewsletterContext'

interface InputProps {
  fieldEntity?: string
  label?: string
  placeholder?: string
  errorMessage?: string
}

function InputName({
  fieldEntity="name",
  label,
  placeholder="Insira o seu nome",
  errorMessage="O valor inserido não é valido."
}: InputProps) {
  const {name, setName, setNameFieldEntity, errors, setErrors} = useNewsletter()

  useEffect(() => {
    setNameFieldEntity(fieldEntity)
  }, [])

  function handleInputChange(text: string) {
    const newErrors = errors
    if(newErrors?.hasOwnProperty('name')) delete newErrors["name"]

    setErrors(newErrors)
    setName(text)
  }

  return (
    <Input fieldEntity={fieldEntity} onChange={handleInputChange} value={name} label={label} placeholder={placeholder} errorMessage={errorMessage} />
  )
}

export default InputName
