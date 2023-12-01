import React, { FC } from 'react'
import { Textarea as StyleguideTextarea } from 'vtex.styleguide'
import { UseTextAreaReturnType, useTextArea } from 'react-hook-form-jsonschema'
import { useCssHandles } from 'vtex.css-handles'
import { BaseInputProps } from '../typings/InputProps'
import { useFormattedError } from '../hooks/useErrorMessage'

export const TextAreaInput: FC<BaseInputProps> = props => {
  const textAreaObject = useTextArea(props.pointer)
  return (
    <TextArea
      textAreaObject={textAreaObject}
      label={props.label}
      placeholder={props.placeholder}
    />
  )
}

const CSS_HANDLES = [
  'inputTextarea',
  'inputTextareaError',
] as const

export const TextArea: FC<{
  textAreaObject: UseTextAreaReturnType
  label?: string
  placeholder?: string
}> = props => {
  const { textAreaObject, placeholder } = props
  const handles = useCssHandles(CSS_HANDLES)
  const [textAreaerror, setTextAreaerror] = React.useState(false)
  const error = textAreaObject.getError()
  const subSchema = textAreaObject.getObject()
  const label = props.label ?? subSchema.title ?? textAreaObject.name

  React.useEffect(() => {
    !!error ? setTextAreaerror(true) : setTextAreaerror(false)
    return () => {
      setTextAreaerror(false)
    }
  }, [error])

  return (
    <div className={`${handles.inputTextarea} ${textAreaerror ? handles.inputTextareaError : ``}`}>
      <StyleguideTextarea
        {...textAreaObject.getTextAreaProps()}
        label={label}
        error={!!error}
        errorMessage={useFormattedError(error)}
        placeholder={placeholder}
        required={false}
      />
    </div>
  )
}
