import React from 'react'
import { OrderFormProvider } from 'vtex.order-manager/OrderForm'
import { OrderQueueProvider } from 'vtex.order-manager/OrderQueue'
import { OrderShippingProvider } from 'vtex.order-shipping/OrderShipping'
import { useCssHandles } from 'vtex.css-handles'

import {
  ShippingSimulatorProvider,
  useShippingSimulator,
} from './ShippingSimulatorContext'

const CSS_HANDLES = [
  'shippingContainer',
  'shippingFormContainer',
  'shippingForm',
] as const

interface ShippingSimulatorWrapperProp {
  pricingMode: 'grouped' | 'individualItems'
}

const ShippingSimulatorWrapper: React.FC<ShippingSimulatorWrapperProp> = ({
  children,
  pricingMode,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { refetch } = useShippingSimulator()

  const handleGetShipping = (e: any) => {
    e.preventDefault()
    refetch()
  }

  return (
    <OrderQueueProvider>
      <OrderFormProvider>
        <OrderShippingProvider>
          <ShippingSimulatorProvider pricingMode={pricingMode}>
            <div className={handles.shippingContainer}>
              <div className={handles.shippingFormContainer}>
                <form
                  onSubmit={handleGetShipping}
                  className={`flex ${handles.shippingForm}`}
                >
                  {children}
                </form>
              </div>
            </div>
          </ShippingSimulatorProvider>
        </OrderShippingProvider>
      </OrderFormProvider>
    </OrderQueueProvider>
  )
}

export default ShippingSimulatorWrapper
