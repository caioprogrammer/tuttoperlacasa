declare module 'vtex.styleguide' {
  import { ComponentType } from 'react'

  export const Input: ComponentType<InputProps>
  export const Button: ComponentType<ButtonProps>

  interface InputProps {
    [key: string]: any
  }

  interface ButtonProps {
    [key: string]: any
  }
}
