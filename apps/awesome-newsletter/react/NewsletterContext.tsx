import React, { Dispatch, ReactNode, SetStateAction, useState, createContext, useContext, useEffect } from "react";

interface NewsletterContextProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  nameFieldEntity: string;
  setNameFieldEntity: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  emailFieldEntity: string;
  setEmailFieldEntity: Dispatch<SetStateAction<string>>;
  state: NewsletterState;
  setState: Dispatch<SetStateAction<NewsletterState>>;
  errors: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>
}

interface Errors {
  [key: string]: string
}

type NewsletterState = "initial" | "error" | "success"

export const NewsletterContext = createContext({} as NewsletterContextProps)

export function NewsleterContextProvider({ children }: {children: ReactNode}) {
  const [name, setName] = useState('')
  const [nameFieldEntity, setNameFieldEntity] = useState('')
  const [emailFieldEntity, setEmailFieldEntity] = useState('')
  const [email, setEmail] = useState('')
  const [state, setState] = useState<NewsletterState>('initial')
  const [errors, setErrors] = useState<Errors>({})


  // useEffect(() => {
  //   console.log(errors)
  // }, [errors])

  useEffect(() => {
      setState("initial")
  }, [name, email])

  return (
    <NewsletterContext.Provider
      value={{
          name,
          setName,
          nameFieldEntity,
          setNameFieldEntity,
          emailFieldEntity,
          setEmailFieldEntity,
          email,
          setEmail,
          state,
          setState,
          errors,
          setErrors
        }}
      >
      {children}
    </NewsletterContext.Provider>
  )
}

export function useNewsletter() {
  const newsletterContext = useContext(NewsletterContext)

  return newsletterContext
}
