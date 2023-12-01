import React from 'react'
import { useIntl } from 'react-intl'
import TranslateEstimate from 'vtex.shipping-estimate-translator/TranslateEstimate'
import classNames from 'classnames'
import { FormattedCurrency } from 'vtex.format-currency'

import styles from '../shippingSimulator.css'

interface ShippingTableRowProps {
  name: string
  shippingEstimate: string
  price: number
  handleCheckedInput: (e: any) => void
  checked: boolean
}

const ShippingTableRow: React.FC<ShippingTableRowProps> = ({
  name,
  shippingEstimate,
  price,
  handleCheckedInput,
  checked
}) => {


  const { formatMessage } = useIntl()
  const etaClassName = classNames(
    `${styles.shippingTableCell} ${styles.shippingTableCellDeliveryEstimate} pv1 ph3 t-small c-muted-2`,
    {
      tc: typeof shippingEstimate === 'undefined',
    }
  )

  const valueClassName = classNames(
    `${styles.shippingTableCell} ${styles.shippingTableCellDeliveryPrice} pv1 ph3 t-small c-muted-2`,
    {
      tc: typeof price === 'undefined',
    }
  )

  let valueText


  if (typeof price === 'undefined') {
    valueText = '-'
  } else if (price === 0) {
    valueText = formatMessage({ id: 'store/shipping.free' })
  } else {
    valueText = <FormattedCurrency value={price / 100} />
  }

  return (
    <tr className={`${styles.shippingTableRow} ${checked ? styles.shippingTableRowSelected : ''}`} key={name} >
      <td
        className={`${styles.shippingTableCell} ${styles.shippingTableCellDeliveryName} pv1 ph3 t-small`}
      >
        <label className={styles.shippingTableLabel}>
          <input
            className={`${styles.shippingTableRadioBtn} mr4 ${checked ? styles.checked : styles.unchecked}`}
            name="shipping-option"
            type="radio"
            value={name}
            onChange={handleCheckedInput}
          />
          {name}
        </label>
      </td>
      <td className={valueClassName}>{valueText}</td>
      <td className={etaClassName}>
        <TranslateEstimate shippingEstimate={shippingEstimate} />
      </td>
    </tr>
  )
}

export default ShippingTableRow
