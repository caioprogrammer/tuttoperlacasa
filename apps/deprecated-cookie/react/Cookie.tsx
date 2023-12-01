import React, { Fragment, useEffect, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { COOKIES_HANDLES } from './handles'
import { CookieContextProps, CookieProps } from './interface'
import './styles.css'

export const CookieContext = React.createContext<CookieContextProps>({
  setCookieAut: () => {},
  closeCookie: () => {},
})

const Cookie: React.FC<CookieProps> = ({ children, backdrop }) => {
  const [cookie, setCookie] = useState<boolean>(true)
  const { handles } = useCssHandles(COOKIES_HANDLES)

  const closeCookie = () => {
    setCookie(true)
  }

  useEffect(() => {
    setCookie(Boolean(localStorage.getItem('cookieAut')))
  }, [])

  const setCookieAut = () => {
    localStorage.setItem('cookieAut', 'true')
    setCookie(true)
  }

  if (!cookie) {
    return (
      <CookieContext.Provider value={{ setCookieAut, closeCookie }}>
        <Fragment>
        {backdrop && <div onClick={closeCookie} className={handles.backdrop}></div>}
        <div className={handles.wrapper}>{children}</div>
        </Fragment>
      </CookieContext.Provider>
    )
  }

  return null
}


export default Cookie
