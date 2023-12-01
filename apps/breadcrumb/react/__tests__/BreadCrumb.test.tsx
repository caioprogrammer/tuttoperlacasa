import React from 'react'
import { render } from '@vtex/test-tools/react'
import { useProduct } from 'vtex.product-context'

import Breadcrumb from '../Breadcrumb'
import { Props } from '../components/BaseBreadcrumb'

describe('<BreadCrumb /> component', () => {
  const defaultCategories = ['/Eletrônicos/Smartphones/', '/Eletrônicos/']
  const renderComponent = (customProps?: Partial<Props>) => {
    const props = {
      categories: defaultCategories,
      ...customProps,
    }

    return render(<Breadcrumb {...props} />)
  }

  it('should match the snapshot', () => {
    expect(renderComponent({ term: 'term' }).asFragment()).toMatchSnapshot()
  })

  it('should render links', () => {
    const { queryByText, asFragment } = renderComponent()

    expect(asFragment().querySelectorAll('a')).toHaveLength(3)
    expect(queryByText('eletrônicos')).toBeDefined()
    expect(queryByText('smartphones')).toBeDefined()
  })

  it('should render term', () => {
    const { rerender, queryByText } = renderComponent({
      term: 'term',
    })

    expect(queryByText('term')).toBeDefined()

    rerender(<Breadcrumb categories={defaultCategories} />)

    expect(queryByText('term')).toBeNull()
  })

  it('should render structured data', () => {
    useProduct.mockImplementationOnce(() => ({
      product: { linkText: 'classic-shoes' },
    }))

    const { getByText } = renderComponent({})

    expect(getByText('Structured Data')).toBeDefined()
  })
})
