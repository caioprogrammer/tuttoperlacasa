import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { GROUPED } from '../constants/PricingMode'
import ShippingTableRow from './ShippingTableRow'
import styles from '../shippingSimulator.css'
import type { Shipping } from '../typings/index'

interface ShippingTableProps {
  shipping: Shipping
  pricingMode: 'grouped' | 'individualItems'
}

const ShippingTable: React.FC<ShippingTableProps> = ({
  shipping,
  pricingMode,
}) => {

  const [checked, setChecked] = useState('')

  const handleCheckedInput = (e: any) => {
    setChecked(e.target.value)
  }

  if ((shipping?.logisticsInfo?.length ?? 0) === 0) {
    return null
  }

  const slaList = shipping.logisticsInfo.reduce(
    (slas, info) => [...slas, ...info.slas],
    [] as any
  )

  const slaSumValuesList: any = []

  if (pricingMode === GROUPED) {
    slaList.reduce(function (res: any, value: any) {
      if (!res[value.id]) {
        res[value.id] = { id: value.id, ...value, price: 0 }
        slaSumValuesList.push(res[value.id])
      }

      res[value.id].price = Number(res[value.id].price) + Number(value.price)

      return res
    }, {} as any)
  }

  if (slaList.length === 0) {
    return (
      <FormattedMessage id="store/shipping.empty-sla">
        {(text) => (
          <span className={`${styles.shippingNoMessage} dib t-small mt4`}>
            {text}
          </span>
        )}
      </FormattedMessage>
    )
  }

  return (
    <table
      className={`${styles.shippingTable} bt bb b--muted-4 c-muted-1 ph0 pv3 mt4 w-100`}
    >
      <thead className={`${styles.shippingTableHead} dn`}>
        <tr className={styles.shippingTableRow}>
          <th className={styles.shippingTableHeadDeliveryName}>
            <FormattedMessage id="store/shipping.deliveryName" />
          </th>
          <th className={styles.shippingTableHeadDeliveryPrice}>
            <FormattedMessage id="store/shipping.deliveryPrice" />
          </th>
          <th className={styles.shippingTableHeadDeliveryEstimate}>
            <FormattedMessage id="store/shipping.deliveryEstimate" />
          </th>
    
        </tr>
      </thead>
      <tbody className={styles.shippingTableBody}>
        {(pricingMode === GROUPED ? slaSumValuesList : slaList).map(
          (shippingItem: any) => (
            <ShippingTableRow
              handleCheckedInput={handleCheckedInput}
              checked={shippingItem.friendlyName === checked}
              key={shippingItem.id}
              name={shippingItem.friendlyName}
              shippingEstimate={shippingItem.shippingEstimate}
              price={shippingItem.price}
            />
          )
        )}
      </tbody>
    </table>
  )
}

export default ShippingTable
