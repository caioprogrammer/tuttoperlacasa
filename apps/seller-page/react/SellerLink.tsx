import React from 'react'
import { Link } from 'vtex.render-runtime'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['sellerLink']

const SellerLink: React.FC = ({ children }) => {
  const { selectedItem } = useProduct()
  const { handles } = useCssHandles(CSS_HANDLES)

  const { sellerId } = selectedItem?.sellers[0].sellerDefault
    ? selectedItem?.sellers[0]
    : ''

  return (
    <Link className={handles.sellerLink} to={`/seller/${sellerId}`}>
      {children}
    </Link>
  )
}

export default SellerLink
