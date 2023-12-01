import React from 'react'
import { IOMessageWithMarkers } from 'vtex.native-types'
import { useQuery } from 'react-apollo'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import './styles.css'

import getStoreName from './graphql/getStoreName.gql'
import { COOKIES_HANDLES } from './handles'

interface CookieMessageProps {
  message: string
  markers: string[]
  privacyPoliceText: string
  privacyPoliceHref: string
}

const CookieMessage: React.FC<CookieMessageProps> = ({
  message = 'A {account} utiliza cookie para melhorar sua experiência, Ao continuar navegando, você concorda com a nossa {privacyPolice}',
  markers = [''],
  privacyPoliceText = 'Política de privacidade',
  privacyPoliceHref = '/institucional/privacidade',
}) => {
  const { data } = useQuery(getStoreName)
  const { handles } = useCssHandles(COOKIES_HANDLES)

  return (
    <span className={`inline white ${handles.message}`}>
      <IOMessageWithMarkers
        markers={markers}
        handleBase="cookieMessage"
        message={message}
        values={{
          account: (
            <span key="storeName" className={handles.account}>
              {data?.accountData.name}
            </span>
          ),
          privacyPolice: (
            <Link
              key="privacyPolice"
              className={handles.privacyLink}
              to={privacyPoliceHref}
            >
              {privacyPoliceText}
            </Link>
          ),
        }}
      />
    </span>
  )
}

export default CookieMessage
