import React, { useContext } from 'react'
import { Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

import { CookieContext } from './Cookie'
import './styles.css'
import { COOKIES_HANDLES } from './handles'

type Props = {
  value: string
}

const AutorizeButton: React.FC<Props> = ({ value = 'Entendi' }) => {
  const { setCookieAut } = useContext(CookieContext)
  const { handles } = useCssHandles(COOKIES_HANDLES)

  return (
    <div className={`${handles.autorizeButton} pa3`}>
      <Button onClick={setCookieAut}>{value}</Button>
    </div>
  )
}

export default AutorizeButton
