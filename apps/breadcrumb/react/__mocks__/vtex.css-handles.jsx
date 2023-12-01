import React from 'react'

export const useCssHandles = (cssHandles) => {
  const handles = {}

  cssHandles.forEach((handle) => {
    handles[handle] = handle
  })

  return handles
}

export function applyModifiers(baseClass, modifier) {
  return `${baseClass}--${modifier}`
}

export const withCssHandles = () => (Comp) => {
  const NewComponent = (props) => <Comp cssHandles={{}} {...props} />

  return NewComponent
}
