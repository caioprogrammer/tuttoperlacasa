import axios from 'axios'
import React, { useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedCurrency } from 'vtex.format-currency'
import { IOMessageWithMarkers } from 'vtex.native-types'

import { useBuyTogether } from './Context'

const CSS_HANDLES = [
  'buyTogetherContainer',
  'currentProduct',
  'currentProductWrapper',
  'productList',
  'buyTogetherTitleContainer',
  'buyTogetherTitle',
  'buyTogetherInfo',
  'totalValue',
  'totalProducts',
  'buyTogetherProductList',
  'buyTogetherProductItem',
  'totalProductsCount',
  'arrowDisabled',
  'buyButton',
  'arrowNext',
  'arrowPrev',
  'arrow',
]

interface BuyTogetherValueProps {
  message: string
  markers: string[]
  applyPromotions: boolean
}

const BuyTogetherValue: React.FC<BuyTogetherValueProps> = ({
  message = 'Por apenas: {totalPrice}',
  markers,
  applyPromotions = true
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)
  const { cartItems, totalPrice , setTotalPrice, simplifiedTotalPrice} = useBuyTogether()

 useEffect(() => {
    if (!cartItems) return 

    axios
      .post(`/api/checkout/pub/orderforms/simulation?RnbBehavior=${applyPromotions ? 1 : 0}`, {
        items: [...cartItems],
      }).then(res => {
        if (!res.data) return 

        console.log(res.data)
        console.log(res.data.totals)
        const totalItem = res.data.totals.find((total: any)=> total.id === 'Items')

        const total = totalItem?.value / 100 || simplifiedTotalPrice
      
    
        setTotalPrice(total)
      })
  }, [cartItems])

  if(!totalPrice) return null

  return (
    <p className={`${handles.totalValue}`}>
      <IOMessageWithMarkers
        handleBase="totalPrice"
        message={message}
        markers={markers}
        values={{ 
          totalPrice: <FormattedCurrency value={totalPrice} key="totalPrice" />,
        }}
      />
    </p>
  )
}

export default BuyTogetherValue
