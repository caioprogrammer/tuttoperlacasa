import axios, { AxiosError } from 'axios'

type ErrorData = {
  Message?: string
}

export async function submitEmail(data: any, app: string) {
  return await axios({
    url: `api/dataentities/${app}/documents`,
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.vtex.ds.v10+json',
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data)
  })
    .then((_response: any) => {
      return {type: 'success', message: 'Inscrição enviada com sucesso :)'}
    })
    .catch((err: AxiosError) => {
      const errorData = err.response?.data
      if(typeof errorData === 'object' && errorData?.hasOwnProperty('Message') && (errorData as ErrorData)?.Message === 'duplicated entry'){
        return {type: 'error', message: 'Dados já cadastrados'}
      }
      return {type: 'error', message: 'Ocorreu um erro, tente novamente mais tarde'}
    })
}

