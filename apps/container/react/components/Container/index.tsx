/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Fragment, MouseEvent } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { blockClassModify } from '../../utils'
import Wrapper from '../Wrapper'
import { CSS_HANDLES } from './handles'
import { ContainerProps } from './types'

const Container: StorefrontFunctionComponent<ContainerProps> = ({
  children,
  stopPropagation = false,
  htmlId,
  blockClass = '',
  renderIfNoChildren = true,
  wrapper = false,
  containerElement = 'div',
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const vtexClass = blockClassModify(blockClass, 'vtex-container')

  const handleClick = (e: MouseEvent) => {
    if (!stopPropagation) return
    e.preventDefault()
    e.stopPropagation()
  }

  const ContainerElement =
    containerElement === 'Fragment' ? Fragment : containerElement

  const containerProps =
    containerElement === 'Fragment'
      ? {}
      : {
          id: htmlId,
          onClick: handleClick,
          className: `${vtexClass} ${handles.container}`,
        }

  if (renderIfNoChildren && !children) return null

  return (
    <Wrapper wrapper={wrapper} blockClass={blockClass}>
      <ContainerElement {...containerProps}>{children}</ContainerElement>
    </Wrapper>
  )
}

export default Container
