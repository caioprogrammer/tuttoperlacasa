import React, { Fragment } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { blockClassModify } from '../../utils'
import { CSS_HANDLES } from './handles'

const Wrapper: StorefrontFunctionComponent<WrapperProps> = ({
  children,
  blockClass,
  wrapper,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  const vtexCenterClass = blockClassModify(blockClass, 'vtex-container-wrapper')

  return wrapper ? (
    <div className={`${vtexCenterClass} ${handles.wrapper}`}>{children}</div>
  ) : (
    <Fragment>{children}</Fragment>
  )
}

export default Wrapper
