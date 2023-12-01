import React, { useContext } from 'react'
import { defineMessages } from 'react-intl'
import { Button, Alert } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { IOMessage } from 'vtex.native-types'

import { SubmitContext } from './logic/formState'

export type FormSubmitProps = {
  label?: string
  showMessageSuccess?: boolean
  messageSuccess?: string
}

const CSS_HANDLES = [
  'formSubmitContainer',
  'formSubmitButton',
  'successFormSubmitButton',
  'successFormSubmitButtonLabel',
  'formErrorServer',
  'formErrorUserInput',

] as const

const messages = defineMessages({
  submitButton: {
    id: 'store/form.submit.buttonLabel',
    defaultMessage: '',
  },
  userInputError: {
    id: 'store/form.submit.error.userInputError',
    defaultMessage: '',
  },
  serverError: {
    id: 'store/form.submit.error.serverError',
    defaultMessage: '',
  },
})

export default function FormSubmit({
  label = messages.submitButton.id,
  showMessageSuccess = false,
  messageSuccess = 'Dados enviados com sucesso'
}: FormSubmitProps) {
  const { loading, userInputError, serverError, success } = useContext(SubmitContext)
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.formSubmitContainer}>
      <div className={`${handles.formSubmitButton} ${success ? handles.successFormSubmitButton : ``}`}>
        <Button type="submit" isLoading={loading} disabled={success && showMessageSuccess}>
          {(success && showMessageSuccess) ? <span className={handles.successFormSubmitButtonLabel}>{messageSuccess}</span> : <IOMessage id={label} />}
        </Button>
      </div>
      <div className={handles.formErrorUserInput}>
        {userInputError && (
          <Alert type="error">
            <IOMessage id={messages.userInputError.id} />
          </Alert>
        )}
      </div>
      <div className={handles.formErrorServer}>
        {serverError && (
          <Alert type="error">
            <IOMessage id={messages.serverError.id} />
          </Alert>
        )}
      </div>
    </div>
  )
}
