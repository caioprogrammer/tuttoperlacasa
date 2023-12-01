import React, { FC } from 'react'
import { RadioGroup as StyleguideRadioGroup } from 'vtex.styleguide'
import {
  UseRadioReturnType,
  Controller,
  useRadio,
} from 'react-hook-form-jsonschema'
import { useCssHandles } from 'vtex.css-handles'
import { useFormattedError } from '../hooks/useErrorMessage'
import { BaseInputProps } from '../typings/InputProps'

const CSS_HANDLES = [
  'inputRadio',
  'inputRadioError',
] as const

export const RadioGroupInput: FC<BaseInputProps> = props => {
  const { pointer, label } = props
  const radioObject = useRadio(pointer)
  return <RadioGroup radioObject={radioObject} label={label} />
}

export const RadioGroup: FC<{
  radioObject: UseRadioReturnType
  label?: string
}> = props => {
  const { radioObject } = props
  const error = radioObject.getError()
  const handles = useCssHandles(CSS_HANDLES)
  const [inputerror, setInputerror] = React.useState(false)
  const subSchema = radioObject.getObject()
  const label = props.label ?? subSchema.title ?? radioObject.name

  React.useEffect(() => {
    !!error ? setInputerror(true) : setInputerror(false)
    return () => {
      setInputerror(false)
    }
  }, [error])

  return (
    <div className={`${handles.inputRadio} ${inputerror ? handles.inputRadioError : ``}`}>
      <Controller
        name={radioObject.pointer}
        control={radioObject.formContext.control}
        rules={radioObject.validator}
        as={
          <StyleguideRadioGroup
            name={label}
            required={radioObject.isRequired}
            hideBorder
            label={label}
            options={radioObject.getItems().map(value => {
              return { value, label: value }
            })}
            error={!!error}
            errorMessage={useFormattedError(error)}
          />
        }
      />
    </div>
  )
}
