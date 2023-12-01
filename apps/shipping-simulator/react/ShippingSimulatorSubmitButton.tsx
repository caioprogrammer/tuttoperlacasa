import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['shippingCTA', 'shippingSubmitButton', 'shippingSubmitButtonLabel'] as const

interface ShippingSimulatorSubmitButtonProps {
  text: string
}

function ShippingSimulatorSubmitButton({
  text = 'Calcular'
}: ShippingSimulatorSubmitButtonProps) {

  const handles = useCssHandles(CSS_HANDLES)

  const buttonClasses = "vtex-button bw1 ba fw5 v-mid relative pa0 lh-solid br2 min-h-regular t-action bg-action-primary b--action-primary c-on-action-primary hover-bg-action-primary hover-b--action-primary hover-c-on-action-primary pointer"
  const labelClasses = "vtex-button__label flex items-center justify-center h-100 ph6"

  return (
    <button type="submit" className={`${buttonClasses} ${handles.shippingCTA} ${handles.shippingSubmitButton}`}>
      <div className={`${labelClasses} ${handles.shippingSubmitButtonLabel}`}>
        {text}
      </div>
    </button>
  )
}

export default ShippingSimulatorSubmitButton
