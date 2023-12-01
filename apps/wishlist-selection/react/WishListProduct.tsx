import React, { useState, MouseEvent, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useProduct } from 'vtex.product-context'
import { IconCheck } from 'vtex.store-icons'
import { useWishlistSearch } from './context/WishListSearchContext'

const CSS_HANDLES = [
  'wishlistProductSelect',
  'wishlistProductSelectButton'
] as const

const WishListProduct = () => {
  const { state, setState } = useWishlistSearch()
  const { wishlisted, selectAll } = state
  const product = useProduct()
  const [selected, setSelected] = useState(false)
  const [hasSelection, setHasSelection] = useState(true)
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    setHasSelection(state.hasSelection)
    const actualProduct = wishlisted.find(wishlistedProduct => wishlistedProduct?.productId === product?.product?.productId)
    setSelected(!!actualProduct?.selected)

    return () => {
      setSelected(false)
      setHasSelection(false)
    }
  }, [selectAll, wishlisted])

  useEffect(() => {
    if(wishlisted.length > 0) setState({ ...state, hasSelection, selectAll: false, wishlisted: wishlisted.map(item => {
      return item.productId === product?.product?.productId
        ? {
          ...item,
            sku: {
              ...product.selectedItem,
              seller: product.selectedItem?.sellers.find(seller => seller.sellerDefault) || product.selectedItem?.sellers[0]
            },
            selected: false
          }
        : {...item}
    })})
  }, [product?.selectedItem])

  const handlerSelectProduct = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setSelected(!selected)

    const wishlitedUpdated = wishlisted.map(wishlistedProduct => {
      if(wishlistedProduct.productId === product?.product?.productId) wishlistedProduct.selected = !selected
      return wishlistedProduct
    })

    setState({
      ...state,
      wishlisted: wishlitedUpdated
    })
  }

  if(!hasSelection) return <></>

  return (
    <div className={handles.wishlistProductSelect}>
      <button
        className={`bg--muted-4 br-pill w2 h2 bn pointer ${handles.wishlistProductSelectButton}`}
        onClick={handlerSelectProduct}
      >
        {selected ? <IconCheck type='filled' size={36}/> : <IconCheck type='line'size={20}/>}
      </button>
    </div>
  )
}

export default WishListProduct
