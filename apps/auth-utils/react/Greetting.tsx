import React from 'react'
import { useQuery } from 'react-apollo'
import { IOMessageWithMarkers } from 'vtex.native-types'

import getProfile from './graphql/getUserProfile.graphql'
import styles from './styles.css'

interface Greeting {
  markers?: string[]
  unloggedText?: string
  loggedText?: string
}

const Greeting: React.FC<Greeting> = ({
  unloggedText = 'Entrar / Cadastrar',
  loggedText = 'Olá {user}',
  markers = [],
}) => {
  const { data, loading } = useQuery(getProfile, { ssr: false })

  if (loading) {
    return (
      <div className={`${styles.greeting} truncate order-1 db-l`}>
        {unloggedText}
      </div>
    )
  }
  return (
    <div className={`${styles.greeting} truncate order-1 db-l`}>
      {data?.profile ? (
        <IOMessageWithMarkers
          message={loggedText}
          markers={markers}
          handleBase="logged"
          values={{
            user: data.profile.firstName || data.profile.email,
          }}
        />
      ) : (
        <IOMessageWithMarkers
          message={unloggedText}
          markers={markers}
          handleBase="unlogged"
          values={{}}
        />
      )}
    </div>
  )
}

export default Greeting
