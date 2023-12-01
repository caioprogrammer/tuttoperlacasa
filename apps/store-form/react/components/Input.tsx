import React, { FC, useState } from 'react'
import { Input as StyleguideInput } from 'vtex.styleguide'
import InputMask from 'react-input-mask'
import {
  UseRawInputReturnType,
  useInput,
  usePassword,
  useHidden,
} from 'react-hook-form-jsonschema'
import { useCssHandles } from 'vtex.css-handles'
import { useFormattedError } from '../hooks/useErrorMessage'
import { FormRawInputProps } from '../typings/InputProps'
import { cpfCnpjMask } from '../logic/documentMask'
import { getAddress } from '../utils/helpers'

export const HiddenInput: FC<FormRawInputProps> = props => {
  const { pointer, value } = props
  const inputObject = useHidden(pointer)
  return <input {...inputObject.getInputProps()} value={value} />
}

export const PasswordInput: FC<FormRawInputProps> = props => {
  const { pointer, label, placeholder, mask } = props
  const inputObject = usePassword(pointer)
  return (
    <Input inputObject={inputObject} label={label} placeholder={placeholder} mask={mask}/>
  )
}

export const RawInput: FC<FormRawInputProps> = props => {
  const { pointer, label, placeholder, mask } = props
  const inputObject = useInput(pointer)
  return (
    <Input inputObject={inputObject} label={label} placeholder={placeholder} mask={mask}/>
  )
}

const CSS_HANDLES = [
  'inputText',
  'inputTextError',
] as const

export const Input: FC<{
  inputObject: UseRawInputReturnType
  label?: string
  placeholder?: string
  mask?: string
}> = props => {
  const handles = useCssHandles(CSS_HANDLES)
  const { inputObject, placeholder, mask } = props
  const error = inputObject.getError()
  const [inputerror, setInputerror] = React.useState(false)
  const subSchema = inputObject.getObject()
  const label = props.label ?? subSchema.title ?? inputObject.name
  const otherProps = {...inputObject.getInputProps()}
  const [value, setValue] = useState('')
  const [documentValue, setDocumentValue] = useState('')
  const isDocumentInput = mask === 'CPF/CNPJ'
  const isDateInput = otherProps?.type === 'date'

  delete otherProps?.pattern
  delete otherProps?.required
  delete otherProps?.minLength
  delete otherProps?.maxLength

  const inputName = inputObject.pointer.replace('#/properties/', '')
  const isPostalCode = /postalcode/i.test(inputName)

  const handlerSendPostalCode = async () => {
    if(isPostalCode){
      const postalCodeValue = String(inputObject.getCurrentValue())?.replace(/[-_]/g, '')
      if(postalCodeValue.length === 8){
        try {
          const address = await getAddress(postalCodeValue)
          for (const key in address) {
            inputObject.formContext.setValue(`#/properties/${key}`, address[key])
            if(key === 'state'){
              inputObject.formContext.setValue(`#/properties/uf`, address[key])
            }
            if(key === 'street'){
              inputObject.formContext.setValue(`#/properties/address`, address[key])
            }
          }
          inputObject.formContext.triggerValidation()
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  if(isDateInput) otherProps.max = "9999-12-31";

  const handleDocumentChange = (e: any) => {
    const { value } = e.target;
    setDocumentValue(cpfCnpjMask(value))
  };

  React.useEffect(() => {
    !!error ? setInputerror(true) : setInputerror(false)
    return () => {
      setInputerror(false)
    }
  }, [error])

  const errorMessage = error?.message === '__form_error_notInEnum' ? 'Deve ser algum dos seguintes valores' : useFormattedError(error)

  return (
    <div className={`${handles.inputText} ${inputerror ? handles.inputTextError : ``}`}>
      {!mask || isDocumentInput
        ? <StyleguideInput
            {...otherProps}
            label={label}
            {...isDocumentInput
              ? {
                  value: documentValue,
                  onChange: handleDocumentChange
                }
              : {}
            }
            onBlur={handlerSendPostalCode}
            error={!!error}
            errorMessage={errorMessage}
            placeholder={placeholder}
          />
        :
          <InputMask
            mask={mask}
            maskPlaceholder={null}
            onChange={(e: any) => setValue(e.target.value)}
            onBlur={handlerSendPostalCode}
            value={value}
          >
            {() => (
              <StyleguideInput
              {...otherProps}
              label={label}
              error={!!error}
              errorMessage={errorMessage}
              placeholder={placeholder}
            />
            )}
          </InputMask>
        }
    </div>
  )
}
