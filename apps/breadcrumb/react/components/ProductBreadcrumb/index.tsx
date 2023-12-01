import React, { useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import { ProductBreadcrumb as ProductBreadcrumbStructuredData } from 'vtex.structured-data'

import BaseBreadcrumb, { Props, NavigationItem } from '../BaseBreadcrumb'

const withProductContextWrapper = (
  Component: React.ComponentType<Props>
): React.FC<Props> => (props) => {
  const { product } = useContext(ProductContext) || { product: null }
  const categoryTree: NavigationItem[] = product?.categoryTree
  const categories = product?.categories ?? []

  return (
    <>
      <ProductBreadcrumbStructuredData
        categoryTree={categoryTree}
        productName={product?.productName}
        productSlug={product?.linkText}
      />
      <Component
        term={product?.productName}
        categories={categories}
        categoryTree={categoryTree}
        breadcrumb={props.breadcrumb}
        showOnMobile={props.showOnMobile}
        homeIconSize={props.homeIconSize}
        caretIconSize={props.caretIconSize}
      />
    </>
  )
}

export default withProductContextWrapper(BaseBreadcrumb)
