import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useListContext } from 'vtex.list-context'

const CSS_HANDLES = [
  'wishListQuantity'
] as const

const WishListQuantity = () => {
  const { list } = useListContext()
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <p className={handles.wishListQuantity}>{list.length}</p>
  )
}

export default WishListQuantity
