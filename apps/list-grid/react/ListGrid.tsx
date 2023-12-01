import React from 'react'
import { useListContext } from 'vtex.list-context'
import { useResponsiveValue } from 'vtex.responsive-values'

import {useCssHandles} from 'vtex.css-handles'


const CssHandles = ['container','wrapper']
interface ListGridProps {
  itemsPerRow?: {
    desktop?: number
    tablet?: number
    phone?: number
  }
  colGap?: {
    desktop?: number
    tablet?: number
    phone?: number
  }
  rowGap?: {
    desktop?: number
    tablet?: number
    phone?: number
  }
}

const ListGrid: StorefrontFunctionComponent<ListGridProps> = ({
  itemsPerRow = {
    desktop: 5,
    tablet: 3,
    phone: 1,
  },
  rowGap = {
    desktop: 4,
    tablet: 2,
    phone: 2,
  },
  colGap = {
    desktop: 2,
    tablet: 2,
    phone: 2,
  }
}) => {

  
  const list = useListContext()?.list ?? []
  const responsiveItemsPerPage = useResponsiveValue(itemsPerRow)
  const responsiveColGap = useResponsiveValue(colGap)
  const responsiveRowGap = useResponsiveValue(rowGap)
  const {handles} = useCssHandles(CssHandles)

  return (
    <div className={`${handles.container} flex flex-wrap`}>
      {list.map((item: any, index: number) => (
        <div  key={index} style={{width: `calc(100% / ${responsiveItemsPerPage})`}} className={`${handles.wrapper} pv${responsiveRowGap} ph${responsiveColGap}`}>
        {item}
        </div>
      ))}
    </div>
  )
}

ListGrid.schema = {
  title: 'editor.list-grid.title',
  description: 'editor.list-grid.description',
  type: 'object',
  properties: {},
}

export default ListGrid
