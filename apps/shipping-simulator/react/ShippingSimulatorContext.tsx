import React, {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useQuery } from 'react-apollo'
import { useProduct } from 'vtex.product-context'
import { Seller } from 'vtex.product-context/react/ProductTypes'
import { ApolloQueryResult } from 'apollo-client'

import getShippingInfo from './graphql/getShippingInfo.gql'
import ShippingSimulatorLoader from './Loader'

const getSeller = (sellers: Seller[]) => {
  return sellers.find(
    ({ commertialOffer = {} }) =>
      commertialOffer.AvailableQuantity != null &&
      commertialOffer.AvailableQuantity > 0
  )
}

type CorporateContextData = {
  postal: string
  setPostal: Dispatch<SetStateAction<string>>
  data: any
  pricingMode: 'grouped' | 'individualItems'
  shippingInfoLoading: boolean,
  handleGetShipping: (e: any) => void
  refetch: (
    variables?:
      | {
          country: string
          postalCode: string
          shippingItems: {
            id: any
            seller: string | undefined
            quantity: any
          }
        }
      | undefined
  ) => Promise<ApolloQueryResult<any>>
}

type CorporateProviderProps = {
  pricingMode: 'grouped' | 'individualItems'
}

export const ShippingSimulatorContext = createContext(
  {} as CorporateContextData
)

export const ShippingSimulatorProvider: StorefrontFunctionComponent<CorporateProviderProps> = ({
  children,
  pricingMode = 'individualItems',
}) => {
  const { loading } = useOrderForm()

  const { selectedItem, selectedQuantity } = useProduct() as any
  const [postal, setPostal] = useState<string>('')

  const seller = getSeller(selectedItem.sellers)

  const { data, loading: shippingInfoLoading, refetch } = useQuery(getShippingInfo, {
    variables: {
      country: 'BRA',
      postalCode: postal,
      shippingItems: {
        id: selectedItem.itemId,
        seller: seller?.sellerId,
        quantity: selectedQuantity,
      },
    },
  })

  if (loading) return <ShippingSimulatorLoader />

  const handleGetShipping = (e: any) => {
    e.preventDefault()
    refetch()
  }

  const ShippingSimulatorState = {
    postal,
    setPostal,
    refetch,
    data,
    pricingMode,
    handleGetShipping,
    shippingInfoLoading
  }

  return (
    <ShippingSimulatorContext.Provider value={ShippingSimulatorState}>
      {children}
    </ShippingSimulatorContext.Provider>
  )
}

export const useShippingSimulator = () => useContext(ShippingSimulatorContext)

export default ShippingSimulatorProvider
