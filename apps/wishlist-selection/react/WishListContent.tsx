import React, { FC, useEffect, useState } from 'react'
import { useListContext } from 'vtex.list-context'
import { useWishlistSearch } from './context/WishListSearchContext'
import { Checkbox } from 'vtex.styleguide'
import { ProductWishlisted } from './context/WishListSearchContext'
// import RemoveFromListButton from './components/RemoveFromList'
import AddAllToCart from './components/AddAllToCart'
import { useCssHandles } from 'vtex.css-handles'


type Props = {
  hasSelection: boolean
}

const CSS_HANDLES = [
  'wishlistSelectionContent',
  'wishlistSelectionNavbar',
  'wishlistSelectionCheckbox'
] as const

const WishListContent: FC<Props> = ({ hasSelection = true }) => {
  const { list } = useListContext()
  const { setState, state } = useWishlistSearch()
  const [checked, setChecked] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<ProductWishlisted[]>([])
  const handles = useCssHandles(CSS_HANDLES)

  useEffect(() => {
    setState({ ...state, hasSelection, selectAll: false, wishlisted: list.map(item => {
      return {...item.props.product, selected: !hasSelection ? true : false}
    })})
  }, [])

  useEffect(() => {
    const everyProductsSelecteds = state.wishlisted.every(wishlistedProduct => wishlistedProduct.selected)
    setChecked(everyProductsSelecteds)
    setSelectedProducts(state.wishlisted.filter(item => item.selected))

    return () => {
      setSelectedProducts([])
    }
  }, [state.wishlisted])

  return (
    <div className={handles.wishlistSelectionNavbar}>
      <nav className={`flex items-center justify-end ${handles.wishlistSelectionNavbar}`}>
        {hasSelection && <div className={handles.wishlistSelectionCheckbox}><Checkbox
          checked={checked}
          id="select-all"
          label="Selecionar todos"
          name="default-checkbox-group"
          onChange={(e: any) => {
            setChecked(e.target.checked)
            setState({ ...state, selectAll: e.target.checked, wishlisted: list.map(item => {
              return {...item.props.product, selected: e.target.checked}
            })})
          }}
        /></div>}
       {/*  <RemoveFromListButton products={selectedProducts} /> */}
        <AddAllToCart products={selectedProducts} />
      </nav>
    </div>
  )
}

export default WishListContent
