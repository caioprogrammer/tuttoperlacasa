import React from 'react'

export const Link = ({ children, to }) => {
  return (
    <a href={to} className="link">
      {children}
    </a>
  )
}
