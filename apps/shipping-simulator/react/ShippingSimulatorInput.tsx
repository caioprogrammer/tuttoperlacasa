import React, { useEffect } from 'react'
import InputMask from 'react-input-mask'
import { Input } from 'vtex.styleguide'
import { useOrderShipping } from 'vtex.order-shipping/OrderShipping'

import { useShippingSimulator } from './ShippingSimulatorContext'

import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['inputWrapper'] as const

interface ShippingSimulatorInputProps {
  useMask: boolean,
  mask: string,
  placeholder: string,
  label: string
}


function ShippingSimulatorInput({
  useMask = true,
  mask = '99999-999',
  placeholder = '00000-000',
  label = 'CEP'

}: ShippingSimulatorInputProps) {

  const handles = useCssHandles(CSS_HANDLES)

  const { postal, setPostal } = useShippingSimulator()

  const { selectedAddress } = useOrderShipping()

  useEffect(() => {
    setPostal(selectedAddress?.postalCode)
  }, [selectedAddress])

  const handlePostalChange = (e: any) => {
    setPostal(e.target.value)
  }

  if (useMask) {
    return (
      <InputMask
        mask={mask}
        maskPlaceholder={null}
        value={postal || ''}
        onChange={handlePostalChange}
      >
        {() => (
          <div className={handles.inputWrapper}>
            <Input type="text" placeholder={placeholder} label={label} />
          </div>
        )}
      </InputMask>
    )
  }

  return (
    <div className={handles.inputWrapper}>
      <Input type="text" placeholder={placeholder} label={label} />
    </div>
  )

}

export default ShippingSimulatorInput
