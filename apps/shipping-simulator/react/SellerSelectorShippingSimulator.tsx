import React, { useState, useEffect } from 'react'
import { OrderFormProvider, useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderQueueProvider } from 'vtex.order-manager/OrderQueue'
import { useUpdateSessionInline } from 'vtex.session-client'
import { useRuntime } from 'vtex.render-runtime'
import { Spinner, Button, Input } from 'vtex.styleguide'
import {
  OrderShippingProvider,
  useOrderShipping,
} from 'vtex.order-shipping/OrderShipping'
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { Seller } from 'vtex.product-context/react/ProductTypes'
import InputMask from 'react-input-mask'
// import { addValidation } from 'vtex.address-form/helpers'
import { useSellerContext } from 'vtex.seller-selector/SellerContext'

// import { getNewAddress } from './utils'
import getShippingInfo from './graphql/getShippingInfo.gql'
import styles from './shippingSimulator'
import ShippingSimulatorLoader from './Loader'
import StatusIndicator from './components/StatusIndicator'

const SellerShippingSimulator: React.FC<ShippingSimulatorProps> = ({
  activeTime,
  failMessage,
  successMessage,
  markers,
}) => {
  const { loading } = useOrderForm()
  const { selectedAddress, insertAddress } = useOrderShipping()
  const [updateSession] = useUpdateSessionInline()
  const { setShippingQuotes } = useSellerContext()
  const { selectedItem, selectedQuantity } = useProduct() as any
  const [postal, setPostal] = useState('')
  const [postalToSearch, setPostalToSearch] = useState('')

  const runtime = useRuntime()
  const {
    culture: { country },
  } = runtime

  let shippingItems = null

  if (selectedItem) {
    shippingItems = selectedItem.sellers.map((current: Seller) => ({
      id: selectedItem.itemId,
      quantity: selectedQuantity?.toString() ?? '1',
      seller: current.sellerId,
    }))
  }

  const { data, refetch, loading: queryLoading } = useQuery(getShippingInfo, {
    variables: {
      country,
      postalCode: postalToSearch,
      shippingItems,
    },
  })

  if (data) {
    setShippingQuotes(data.shipping)
  }

  useEffect(() => {
    console.log('queryLoading', queryLoading)
  }, [queryLoading])

  useEffect(() => {
    if (postalToSearch === '') return

    insertAddress({
      country: 'BRA',
      postalCode: postalToSearch,
    })

    updateSession({
      variables: {
        fields: {
          country: 'BRA',
          postalCode: postalToSearch,
        },
      },
    })
  }, [postalToSearch])

  useEffect(() => {
    setPostal(selectedAddress?.postalCode)

    if (!selectedAddress?.postalCode) return

    const postalNumber = selectedAddress?.postalCode.replace(/\D/g, '')

    if (postalNumber.length < 8) return

    setPostalToSearch(selectedAddress?.postalCode)
  }, [selectedAddress])

  if (loading) return <ShippingSimulatorLoader />

  const handlePostalChange = (e: any) => {
    setPostal(e.target.value)

    if (!postal) return

    const postalNumber = e.target.value.replace(/\D/g, '')

    if (postalNumber.length < 8) return

    setPostalToSearch(e.target.value)
  }

  const handleGetShipping = (e: any) => {
    e.preventDefault()

    refetch()
  }

  return (
    <div className={styles.shippingContainer}>
      <div className={styles.shippingFormContainer}>
        <form
          onSubmit={handleGetShipping}
          className={`flex ${styles.shippingForm}`}
        >
          <InputMask
            mask="99999-999"
            maskPlaceholder={null}
            value={postal || ''}
            onChange={handlePostalChange}
          >
            {() => <Input type="text" placeholder="00000-000" label="CEP" />}
          </InputMask>
          <Button type="submit" className={styles.shippingCTA}>
            {queryLoading ? <Spinner size={24} /> : 'Calcular Frete'}
          </Button>
        </form>
        <div className={styles.shippingUnknownPostalWrapper}>
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noreferrer"
            className={styles.shippingUnknownPostalLink}
          >
            Não sei meu cep
          </a>
        </div>
      </div>
      <StatusIndicator
        successMessage={successMessage}
        failMessage={failMessage}
        activeTime={activeTime}
        markers={markers}
        data={data}
        postalCode={postalToSearch}
        loading={queryLoading}
      />
    </div>
  )
}

interface ShippingSimulatorProps {
  successMessage: string
  failMessage: string
  markers: string[]
  activeTime: number
}

function MainComponent({
  successMessage = 'Frete calculado!',
  failMessage = 'Não foi possivel calcular o frete',
  markers,
  activeTime = 3000,
}: ShippingSimulatorProps) {
  return (
    <OrderQueueProvider>
      <OrderFormProvider>
        <OrderShippingProvider>
          <SellerShippingSimulator
            successMessage={successMessage}
            failMessage={failMessage}
            activeTime={activeTime}
            markers={markers}
          />
        </OrderShippingProvider>
      </OrderFormProvider>
    </OrderQueueProvider>
  )
}

MainComponent.schema = {
  title: 'Indicador do status do calculo de frete',
  type: 'Object',
  properties: {
    successMessage: {
      title: 'Mensagem de sucesso',
      type: 'String',
    },
    failureMessage: {
      title: 'Mensagem de falha',
      type: 'String',
    },
  },
}

export default MainComponent
