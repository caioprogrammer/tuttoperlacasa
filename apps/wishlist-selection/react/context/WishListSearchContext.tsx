import React from 'react'
import { createContext, useContext, useState } from "react"
import { ProductTypes } from 'vtex.product-context'

export interface ProductWishlisted extends ProductTypes.Product {
  selected: boolean
  sku: ProductTypes.Item
}

interface StateProps {
  wishlisted: ProductWishlisted[]
  selectAll: boolean
  hasSelection: boolean
  updateList: boolean
}

interface Props {
  state: StateProps
  setState: any
}

const defaultProps = {
  state: {
    wishlisted: [],
    selectAll: false,
    hasSelection: true,
    updateList: false
  },
  setState: () => {}
}

export const WishListSearchContext = createContext({} as Props)

export const WishListSearchProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(defaultProps.state)

  return (
    <WishListSearchContext.Provider value={{ state, setState }}>{children}</WishListSearchContext.Provider>
  )
}

export const useWishlistSearch = () => useContext(WishListSearchContext)
