import React from 'react'
import { useProduct } from 'vtex.product-context'
import { ProductBreadcrumb as ProductBreadcrumbStructuredData } from 'vtex.structured-data'

import BaseBreadcrumb, { Props } from './components/BaseBreadcrumb'

const withProductContextWrapper = (
  Component: React.ComponentType<Props>
): React.FC<Props> => (props) => {
  const { product } = useProduct() || { product: null }
  const term = props.term ?? product?.productName
  const categoryTree = props.categoryTree ?? product?.categoryTree
  const categories = props.categories ?? product?.categories ?? []

  return (
    <>
      {product?.linkText && (
        <ProductBreadcrumbStructuredData
          categoryTree={categoryTree}
          productName={product?.productName}
          productSlug={product?.linkText}
        />
      )}
      <Component
        term={term}
        categories={categories}
        categoryTree={categoryTree}
        breadcrumb={props.breadcrumb}
        showOnMobile={props.showOnMobile}
        homeIconSize={props.homeIconSize}
        caretIconSize={props.caretIconSize}
        homeType={props.homeType}
        homeLinkText={props.homeLinkText}
      />
    </>
  )
}

export default withProductContextWrapper(BaseBreadcrumb)
