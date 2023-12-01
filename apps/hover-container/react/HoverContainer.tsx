import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

type Props = {
  hoverItem: boolean,
  children: Element
}

function HoverContainer({ hoverItem = true, children }: Props) {
  const handles = useCssHandles(['hoverContent'])

  if(!hoverItem) return <>{children}</>

  return(
    <>
      <div className={`${handles.hoverContent}`}>{children}</div>
    </>
  )
}

export default HoverContainer

HoverContainer.schema = {
  title: "Hover items",
  type: 'object',
  properties: {
    hoverItem: {
      title: "Ativar/Desativar hover",
      type: 'boolean',
    },
  }
}
