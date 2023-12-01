import axios from 'axios'
import cepPromise from 'cep-promise'

interface AddressProps{
  display_name: string
  lat: string
  lon: string
}

interface DataProps {
  data: AddressProps[]
}

interface CepPromisse{
  cep: string,
  state: string,
  city: string,
  neighborhood: string,
  street: string,
  service: string
}

const geolocationsData = async (address: string, postalCode: string) => {
  return await axios({
    method: 'get',
    url: `https://nominatim.openstreetmap.org/search.php?q=${address}&format=jsonv2`,
    responseType: 'stream'
  })
  .then((response: DataProps) => {
      const { data } = response
      const mainGeolocations = data.find((item: AddressProps) => item.display_name.includes(postalCode) || item.display_name.includes(postalCode.replace(/-/g, ''))) || data[0]
      return mainGeolocations || {lat: '', lon: ''}
  }).catch((err: any) => {
      console.log(err)
      return {lat: '', lon: ''}
  })
}

const formatStringForAPI = (string: string|null) => {
  if (!string) return false

  return string.replace(/\s/g, '+')
}

export const sendGeolocations = async (data: any) => {
  const { address, city, number, postalCode } = data
  const formatedStreet = `${address ? `${formatStringForAPI(address)}+` : ''}`
  const formatedCity = `${city ? `${formatStringForAPI(city)}+` : ''}`
  const formatedNumber = `${number ? `${number}+` : ''}`
  return await geolocationsData(`${formatedStreet}${formatedNumber}${formatedCity}`, postalCode)
}

export const getAddress = async (postalCode: string) => {
  return await cepPromise(postalCode, { providers: ['brasilapi', 'viacep'] })
    .then((data: CepPromisse) => {
      return data
    })
    .catch((_err: any) => {
      console.error(_err)

      return false
    })
}
