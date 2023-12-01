import React, { useEffect, useState } from 'react'
import { AddToCartButton } from 'vtex.add-to-cart-button'
import { IconCart } from 'vtex.store-icons'
import { useCssHandles } from 'vtex.css-handles'

import populateCart from '../utils/populateCart'

type Props = {
  products: any[]
}

const CSS_HANDLES = ['wishlistAddToCart', 'wishlistAddToCartDisabled'] as const

const AddAllToCart = ({ products }: Props) => {
  const [cartProducts, setCartProducts] = useState<any>([])
  const handles = useCssHandles(CSS_HANDLES)

  const productLink = {
    linkText: '',
    productId: '',
  }

  useEffect(() => {
    setCartProducts(products.map((product) => populateCart(product)))

    // .filter(product => Boolean(product.sku.seller.commertialOffer.AvailableQuantity))
    return () => {
      setCartProducts([])
    }
  }, [products])

  return (
    <div
      className={`flex items-center ${handles.wishlistAddToCart} ${
        cartProducts.length < 1 ? handles.wishlistAddToCartDisabled : ''
      }`}
    >
      <IconCart />
      <AddToCartButton
        skuItems={cartProducts}
        available
        isOneClickBuy={false}
        productLink={productLink}
        text="Adicionar itens ao carrinho"
        disabled={cartProducts.length < 1}
        multipleAvailableSKUs={false}
        showToast={() => {}}
        allSkuVariationsSelected
        onClickBehavior="add-to-cart"
        onClickEventPropagation="disabled"
      />
    </div>
  )
}

export default AddAllToCart
