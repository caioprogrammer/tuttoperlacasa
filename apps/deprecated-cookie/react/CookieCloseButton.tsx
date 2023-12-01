import React, { useContext } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { CookieContext } from './Cookie'
import { COOKIES_HANDLES } from './handles'
import  './styles.css'


const CookieCloseButton: React.FC = () => {
  const { closeCookie } = useContext(CookieContext)
  const { handles } = useCssHandles(COOKIES_HANDLES)

  const handleClick = () => {
    closeCookie()
  }

  return (
    <div onClick={handleClick} className={`${handles.closeButton}`}>
     X
    </div>
  )
}

export default CookieCloseButton
