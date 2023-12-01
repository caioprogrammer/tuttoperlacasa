import React, { FC } from 'react'
import { WishListSearchProvider } from './context/WishListSearchContext'

const WishListSearch: FC = ({ children }) => {
  return <WishListSearchProvider>{children}</WishListSearchProvider>
}

export default WishListSearch
