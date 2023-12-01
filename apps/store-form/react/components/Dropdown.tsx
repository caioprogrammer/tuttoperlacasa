import React, { FC, useMemo } from 'react'
import { Dropdown as StyleguideDropdown, EXPERIMENTAL_Select as SelectAutocomplete } from 'vtex.styleguide'
import {
  Controller,
  UseSelectReturnType,
  useSelect,
} from 'react-hook-form-jsonschema'
import { useCssHandles } from 'vtex.css-handles'
import { useFormattedError } from '../hooks/useErrorMessage'
import { BaseInputProps } from '../typings/InputProps'

export const DropdownInput: FC<BaseInputProps> = props => {
  const selectObject = useSelect(props.pointer)
  return <Dropdown selectObject={selectObject} label={props?.label} autocomplete={props?.autocomplete} placeholder={props.placeholder}/>
}

const CSS_HANDLES = [
  'inputDropdown',
  'inputDropdownError',
] as const

export const Dropdown: FC<{
  selectObject: UseSelectReturnType
  label?: string
  autocomplete?: boolean
  placeholder?: string
}> = props => {
  const { selectObject } = props
  const handles = useCssHandles(CSS_HANDLES)
  const [inputerror, setInputerror] = React.useState(false)
  const error = selectObject.getError()
  const subSchema = selectObject.getObject()
  const label = props.label ?? subSchema.title ?? selectObject.name

  React.useEffect(() => {
    !!error ? setInputerror(true) : setInputerror(false)
    return () => {
      setInputerror(false)
    }
  }, [error])

  const items = selectObject.getItems()
  const options = useMemo(() => {
    return items.map(value => {
      return { value, label: value }
    })
  }, [items])

  const selectComponentProps = {
    name: label,
    multi: false,
    label,
    options,
    error: !!error,
    errorMessage: useFormattedError(error)
  }

  return (
    <div className={`${handles.inputDropdown} ${inputerror ? handles.inputDropdownError : ``}`}>
      <Controller
        name={selectObject.pointer}
        control={selectObject.formContext.control}
        rules={selectObject.validator}
        as={!!props.autocomplete
          ? <SelectAutocomplete {...selectComponentProps} placeholder={props.placeholder || 'Selecione...'} />
          : <StyleguideDropdown {...selectComponentProps}/>
        }
      />
    </div>
  )
}
