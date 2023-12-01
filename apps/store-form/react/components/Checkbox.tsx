import React, { FC } from 'react'
import { Checkbox as StyleguideCheckbox } from 'vtex.styleguide'
import { UseCheckboxReturnType, useCheckbox } from 'react-hook-form-jsonschema'
import { useCssHandles } from 'vtex.css-handles'
import { BaseInputProps } from '../typings/InputProps'
import { useFormattedError } from '../hooks/useErrorMessage'

export const CheckboxInput: FC<BaseInputProps> = props => {
  const checkboxObject = useCheckbox(props.pointer)
  return <Checkbox checkboxObject={checkboxObject} label={props.label} />
}

const CSS_HANDLES = [
  'inputCheckbox',
  'inputCheckboxError',
  'inputCheckboxes',
  'inputCheckboxesError'
] as const

export const Checkbox: FC<{
  checkboxObject: UseCheckboxReturnType
  label?: string
}> = props => {
  const { checkboxObject } = props
  const subSchema = checkboxObject.getObject()
  const label = props.label ?? subSchema.title ?? checkboxObject.name
  const [error, setError] = React.useState('')
  const [checkboxChecked, setCheckboxChecked] = React.useState(false)
  const handles = useCssHandles(CSS_HANDLES)
  const inputError = checkboxObject.getError()
  const [hasInputerror, setHasInputerror] = React.useState(false)
  const inputErrorMessage = useFormattedError(inputError)

  React.useEffect(() => {
    if (checkboxObject.isSingle) {
      const checked = checkboxObject.formContext.watch(checkboxObject.pointer)
      setCheckboxChecked(checked)
    }else{
      const checked = checkboxObject.formContext.watch(
        `${checkboxObject.pointer}[${0}]`
      )
      setCheckboxChecked(checked)
    }
    return () => {
      setCheckboxChecked(false)
    }
  }, [checkboxObject])

  React.useEffect(() => {
    checkboxChecked ? setError('') : setError(inputErrorMessage)
    !!inputError ? setHasInputerror(true) : setHasInputerror(false)
    return () => {
      setError('')
      setHasInputerror(false)
    }
  }, [checkboxChecked, inputError])

  if (checkboxObject.isSingle) {
    const checked = checkboxObject.formContext.watch(checkboxObject.pointer)

    return (
      <div className={`${handles.inputCheckbox} ${hasInputerror ? handles.inputCheckboxError : ``}`}>
        <StyleguideCheckbox
          {...checkboxObject.getItemInputProps(0)}
          label={label}
          checked={Boolean(checked)}
          value="true"
          onChange={() => {
            const { pointer } = checkboxObject
            checkboxObject.formContext.setValue(pointer, !checked)
          }}
          />
          {error?.length > 0 && <span className='vtex-input__error c-danger t-small mt3 lh-title'>{error}</span>}
      </div>
    )
  }

  return (
    <div className={`${handles.inputCheckboxes} ${hasInputerror ? handles.inputCheckboxesError : ``}`}>
      {checkboxObject.getItems().map((value, index) => {
        const checked = checkboxObject.formContext.watch(
          `${checkboxObject.pointer}[${index}]`
        )

        return (
          <StyleguideCheckbox
            {...checkboxObject.getItemInputProps(index)}
            key={`${value}${index}`}
            label={label}
            value={value}
            {...(checked ? { checked: true } : { checked: false })}
            onChange={() => {
              const { pointer } = checkboxObject
               checkboxObject.formContext.setValue(pointer, !checked)
            }}
            checked={Boolean(checked)}
          />
        )
      })}
      {error?.length > 0 && <span className='vtex-input__error c-danger t-small mt3 lh-title'>{error}</span>}
    </div>
  )
}
