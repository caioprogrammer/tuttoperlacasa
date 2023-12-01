import React from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useCssHandles } from 'vtex.css-handles'
import { useMinicartCssHandles } from './CssHandlesContext'
import styles from '../styles.css'

const countCartItems = (
  countMode: MinicartTotalItemsType,
  allItems: OrderFormItem[]
) => {
  // Filter only main products, remove assembly items from the count
  const items = allItems.filter(item => item.parentItemIndex === null)

  if (countMode === 'distinctAvailable') {
    return items.reduce((itemQuantity: number, item) => {
      if (item.availability === 'available') {
        return itemQuantity + 1
      }
      return itemQuantity
    }, 0)
  }

  if (countMode === 'totalAvailable') {
    return items.reduce((itemQuantity: number, item) => {
      if (item.availability === 'available') {
        return itemQuantity + item.quantity
      }
      return itemQuantity
    }, 0)
  }

  if (countMode === 'total') {
    return items.reduce((itemQuantity: number, item) => {
      return itemQuantity + item.quantity
    }, 0)
  }

  // countMode === 'distinct'
  return items.length
}

interface Props {
  itemCountMode: MinicartTotalItemsType
  quantityDisplay: QuantityDisplayType
  alwaysTwoDigits: AlwaysTwoDigits
  showText?: Boolean
  singularText?: String
  pluralText?: String
  isOutBadge?:boolean
}

const QuantityBadge: React.FC<Props> = props => {
  const {
    itemCountMode,
    singularText = "item",
    pluralText = "itens",
    quantityDisplay = 'not-empty',
    alwaysTwoDigits = false,
    showText = false,
    isOutBadge = false
  } = props
  const { orderForm, loading }: OrderFormContext = useOrderForm()
  const quantity = countCartItems(itemCountMode, orderForm.items)
  const { handles } = useMinicartCssHandles()
  const cssHandles = useCssHandles(['minicartQuantityBadgeOut', 'minicartQuantityBadgeSingleProductOut', 'minicartQuantityBadgeText'])
  const itemQuantity = loading ? 0 : quantity

  const showQuantityBadge =
    (itemQuantity > 0 && quantityDisplay === 'not-empty') ||
    quantityDisplay === 'always'

  const showTwoItems =
    (itemQuantity > 0 && alwaysTwoDigits === 'not-empty') ||
    alwaysTwoDigits === 'always'

  return (
    <>
      {showQuantityBadge && (
        <span
          style={{ userSelect: 'none' }}
          className={`vtex-text ${handles.minicartQuantityBadge} ${isOutBadge && cssHandles.handles.minicartQuantityBadgeOut} ${
            itemQuantity === 1 && handles.minicartQuantityBadgeSingleProduct
          } ${
            (itemQuantity === 1 && isOutBadge) && cssHandles.handles.minicartQuantityBadgeSingleProductOut
          } ${isOutBadge && styles.minicartQuantityBadgeDefaultOut} ${
            styles.minicartQuantityBadgeDefault
          } c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
        >
          {showTwoItems
            ? itemQuantity.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false,
              })
            : itemQuantity}
            {showText && <span className={`${cssHandles.handles.minicartQuantityBadgeText}`}>{itemQuantity > 1 ? pluralText : singularText}</span>}
        </span>
      )}
    </>
  )
}

export default QuantityBadge
