import React, { useEffect } from 'react'
import Input from './components/Input'
import { useNewsletter } from './NewsletterContext'

interface InputProps {
  fieldEntity?: string
  label?: string
  placeholder?: string
  errorMessage?: string

}

function InputEmail({
  fieldEntity="email",
  label,
  placeholder="Insira o seu e-mail",
  errorMessage="O e-mail inserido parece estar incorreto."
}: InputProps) {
  const {email, setEmail, setEmailFieldEntity, errors, setErrors} = useNewsletter()

  useEffect(() => {
    setEmailFieldEntity(fieldEntity)
  }, [])

  function handleInputChange(text: string) {
    const newErrors = errors
    if(newErrors?.hasOwnProperty('email')) delete newErrors["email"]

    setErrors(newErrors)
    setEmail(text)
  }

  return (
    <Input fieldEntity={fieldEntity} onChange={handleInputChange} value={email} label={label} placeholder={placeholder} errorMessage={errorMessage} />
  )
}

export default InputEmail
