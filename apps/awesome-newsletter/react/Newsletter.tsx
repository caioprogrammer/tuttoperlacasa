import React, { useEffect, useState } from 'react'
import { ComponentType } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { NewsleterContextProvider, useNewsletter } from './NewsletterContext'
import { submitEmail } from './utils'

interface FormProps {
  entity?: string
  resetAfterSuccess?: boolean,
  Success?: ComponentType
}

interface DataToSend {
  [key: string]: string
}

const CSS_HANDLES = [
  "form",
  "formSuccess",
  "formContainer",
  "formError",
  'errorMessage',
  'successMessage',
  'messageContent'
] as const

const Form: React.FC<FormProps> = ({ resetAfterSuccess = false, entity = "NL", Success, children }) => {
  const {
    name,
    setName,
    nameFieldEntity,
    email,
    setEmail,
    emailFieldEntity,
    errors,
    setErrors,
    state,
    setState
  } = useNewsletter()

  const { handles } = useCssHandles(CSS_HANDLES)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [successMessage, setSuccessMessage] = useState<string | undefined>()

  useEffect(() => {
    if(state === 'initial'){
      setErrorMessage(undefined)
    }
  }, [state])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let dataToSend: DataToSend = {}

    if(nameFieldEntity !== undefined && isNameValid()) {
      dataToSend[nameFieldEntity] = name
    }

    if(emailFieldEntity !== undefined && isEmailValid()) {
      dataToSend[emailFieldEntity] = email
    }

    if(Object.keys(dataToSend).length === 0) return

    const suceeded = await submitEmail(dataToSend,entity)

    if (suceeded.type === 'error') {
      setState("error")
      setErrorMessage(suceeded.message)
      setSuccessMessage(undefined)
      return
    }

    setErrors({})
    setState("success")
    setSuccessMessage(suceeded.message)
    setErrorMessage(undefined)

    if(!resetAfterSuccess) return

    setName('')
    setEmail('')
  }

  function isNameValid() {

    if(name.length < 3) {
      setErrors((errors) => ({...errors, [nameFieldEntity]: "lenght"}))

      return false
    }

    return true
  }

  function isEmailValid() {
    if(email.length === 0) {
      setErrors((errors) => ({...errors, [emailFieldEntity]: "lenght"}))

      return false
    }

    const emailRegex = /^.+@[a-z0-9]+\.[a-z]+(\.[a-z]+)*$/i

    if(!email.match(emailRegex)) {
      setErrors({...errors, email: "invalid"})

      return false
    }

    return true
  }

  if(state === 'success' && Success) {
    return <Success />
  }

  return (
    <div className={handles.formContainer}>
      <form onSubmit={handleFormSubmit} className={`${handles.form} ${handles.form}--${state}`}>
        {children}
      </form>
      <div className={handles.messageContent}>
        {errorMessage && <p className={`${handles.errorMessage}`}>{errorMessage}</p>}
        {successMessage && <p className={`${handles.successMessage}`}>{successMessage}</p>}
      </div>
    </div>
  )
}

const Newsletter: React.FC<FormProps> = (props) => {
  return (
    <NewsleterContextProvider>
      <Form {...props}>{props.children}</Form>
    </NewsleterContextProvider>
  )
}

export default Newsletter
