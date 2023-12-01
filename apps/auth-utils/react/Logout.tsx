import React from 'react';
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  "logoutLink"
]

const Logout: React.FC = () => {

  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <a className={handles.logoutLink} href='/logout'>Sair</a>
  )
}

export default Logout;