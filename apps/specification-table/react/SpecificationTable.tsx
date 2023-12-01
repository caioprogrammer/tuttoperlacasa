import React from 'react'
import { useProduct } from 'vtex.product-context'
import { useCssHandles } from 'vtex.css-handles'

type Props = {
  tableGroupName: string,
  cellWidth: number
}

const CSS_HANDLES = [
  'containerTable',
  'tableContent',
  'tableContentHeader',
  'tableContentBody',
  'tableRowTitle',
  'tableRowContent',
  'titleContent',
  'itemContent',
]

function SpecificationTable({ tableGroupName }: Props) {
  const handles = useCssHandles(CSS_HANDLES)
  const productContext = useProduct()
  const tableGroupValues = productContext?.product?.specificationGroups?.find((specificationGroup) => specificationGroup.name === tableGroupName)
  const maxItemLength =  Math.max.apply(null, tableGroupValues?.specifications?.map((item) => item?.values[0]?.split('??').length))

  const tableGroupValuesSeparated = tableGroupValues?.specifications?.map((item) => {
    const itemValues = item?.values[0]?.split('??')
    if(itemValues.length < maxItemLength) itemValues.push('')
    return itemValues.map(valueItem => {
      return {
        [item.name]: valueItem
      }
    })
  })

  const tableGroupValuesFormated: any = []
  tableGroupValuesSeparated?.map((values) => {
    values.map((value, index) => {
      tableGroupValuesFormated[index] = {...tableGroupValuesFormated[index], ...value}
    })
  })

  return (
    <div className={`${handles.containerTable}`}>
      {tableGroupValues &&
        <div className={`${handles.tableContent} collapse pv2 ph3 w-100`}>
          <div className={`${handles.tableContentHeader}`}>
            <div className={`${handles.tableRowTitle} striped--light-gray flex w-100`}>
              {tableGroupValues.specifications.map(specificationItem => <p className={`${handles.titleContent} pv2 ph3 f6 fw6 tc w-4`}>{specificationItem.name}</p>)}
            </div>
          </div>
          <div className={`${handles.tableContentBody}`}>
            {tableGroupValuesFormated.map((item: any) =>
              <div className={`${handles.tableRowContent} striped--light-gray flex w-100`}>{Object.keys(item).map(tableKey =>
                <p className={`${handles.itemContent} pv2 ph3 tc w-4`}>{item[tableKey]}</p>)}
              </div>
            )}
          </div>
        </div>}
    </div>
  )
}

export default SpecificationTable

