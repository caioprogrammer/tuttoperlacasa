/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Fragment, MouseEvent } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { useListContext } from 'vtex.list-context'

import { blockClassModify } from '../../utils'
import { ContainerListProps } from './types'
import { ABOUT_HANDLES } from './handles'
import Wrapper from '../Wrapper'

export const ContainerList: StorefrontFunctionComponent<ContainerListProps> = ({
  children,
  blockClass = '',
  stopPropagation = false,
  htmlId,
  renderIfNoChildren = true,
  wrapper = false,
  itemElement = 'Fragment',
  containerElement = 'div',
}) => {
  const { handles } = useCssHandles(ABOUT_HANDLES)
  const list = useListContext()?.list ?? []

  const items =
    React.Children.count(children) > 0
      ? React.Children.toArray(children).concat(list)
      : list

  const handleClick = (e: MouseEvent) => {
    if (!stopPropagation) return
    e.preventDefault()
    e.stopPropagation()
  }

  const vtexClass = blockClassModify(blockClass, 'vtex-container')
  const vtexListItemClass = blockClassModify(
    blockClass,
    'vtex-container-listItem'
  )

  const ItemElement = itemElement === 'Fragment' ? Fragment : itemElement
  const ContainerElement =
    containerElement === 'Fragment' ? Fragment : containerElement

  const itemProps =
    itemElement === 'Fragment'
      ? {}
      : { className: `${handles.listItem} ${vtexListItemClass}` }

  const containerProps =
    containerElement === 'Fragment'
      ? {}
      : {
          id: htmlId,
          onClick: handleClick,
          className: `${vtexClass} ${handles.container}`,
        }

  if (renderIfNoChildren && !items.length) return null

  return (
    <Wrapper wrapper={wrapper} blockClass={blockClass}>
      <ContainerElement {...containerProps}>
        {items.map((item, idx) => (
          <ItemElement {...itemProps} key={idx}>
            {item}
          </ItemElement>
        ))}
      </ContainerElement>
    </Wrapper>
  )
}
