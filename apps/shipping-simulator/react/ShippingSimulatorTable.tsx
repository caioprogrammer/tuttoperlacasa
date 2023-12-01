import React from 'react'

import type { Shipping } from './typings/index'
import ShippingTable from './components/ShippingTable'
import { useShippingSimulator } from './ShippingSimulatorContext'

function ShippingSimulatorTable() {
  const { data, postal, pricingMode } = useShippingSimulator()
  const shipping: Shipping = data?.shipping


  const postalFilled = () => {
    return /[0-9]{5}?(-)?[0-9]{3}/.test(postal)
  }

  return (
    <>
      {postalFilled() && (
        <ShippingTable shipping={shipping} pricingMode={pricingMode} />
      )}
    </>
  )
}

export default ShippingSimulatorTable
