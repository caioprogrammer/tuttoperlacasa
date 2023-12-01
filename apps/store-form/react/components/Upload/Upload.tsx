import * as React from 'react'
import { useMutation } from 'react-apollo'
import { useDropzone } from 'react-dropzone'
import { useIntl, defineMessages } from 'react-intl'
import { IOMessage } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'
import {
  Button,
  Input,
  Spinner,
} from 'vtex.styleguide'

import StyleButton from './StyleButton'
import UploadFileMutation from '../../graphql/uploadFile.graphql'
import { FormRawInputProps, InputTypes } from '../../typings/InputProps'
import { HiddenInput } from '../Input'
import { useInput } from 'react-hook-form-jsonschema'
import { useFormattedError } from '../../hooks/useErrorMessage'

interface MutationData {
  uploadFile: { fileUrl: string }
}

const MAX_SIZE = 4 * 1024 * 1024

const messages = defineMessages({
  titleLabel: {
    id: 'store/form.operating.agreement',
    defaultMessage: '',
  },
  add: {
    id: 'store/form.add-button',
    defaultMessage: '',
  },
  uploadLabel: {
    id: 'store/form.upload-document-label',
    defaultMessage: '',
  },
  uploadButton: {
    id: 'store/form.upload-button',
    defaultMessage: '',
  },
})

const CSS_HANDLES = [
  'inputUpload',
  'inputUploadError',
  'inputUploadContent',
  'inputUploadLabel',
  'inputUploadFileLoaded',
  'inputUploadTriggerDisabled',
  'inputUploadTriggerLoaded',
  'inputUploadTrigger',
  'inputUploadWrapper',
  'inputUploadUrlInput',
  'inputUploadButtonWrapper',
  'inputUploadButtonLabel',
  'inputUploadButton',
  'inputUploadFileName',
] as const

const InputUpload = (props: FormRawInputProps & { accept?: string, label?: string, multiple?: boolean }) => {
  const intl = useIntl()
  const [uploadFile] = useMutation<MutationData>(UploadFileMutation)
  const handles = useCssHandles(CSS_HANDLES)
  const ref = React.useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [fileName, setFileName] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState<string | undefined>()
  const [imageUrls, setImagesUrls] = React.useState<any[]>()
  const [error, setError] = React.useState<string | null>()
  const { inputType = InputTypes.input, accept, pointer, multiple, ...rest } = props
  const inputObject = useInput(pointer)
  const subSchema = inputObject.getObject()
  const label = props.label ?? subSchema.title ?? inputObject.name ?? intl.formatMessage({ id: messages.titleLabel.id })
  const inputError = inputObject.getError()
  const inputErrorMessage = useFormattedError(inputError)

  React.useEffect(() => {
    imageUrl?.length ? setError(null) : setError(inputErrorMessage)
    return () => {
      setError(null)
    }
  }, [imageUrl, inputError])

  React.useEffect(() => {
  if(isLoading){
    setTimeout(()=>{
      setIsLoading(false)
    },10000)
  }
  }, [isLoading])

  const onDropImage = async (files: File[]) => {
    setError(null)

    try {
      if (!!multiple && files?.length) {
       const imagesData: (MutationData | undefined)[] = []
       setImagesUrls([])

       
       files.map(async (file) => {

         setIsLoading(true)

         const { data, errors } = await uploadFile({
           variables: { file },
         })

         if (errors) {
           setError(
             intl.formatMessage({
               id: 'store/form.document-uploader.error.file-size',
             })
           )
           return
         }

         setIsLoading(false)
         setIsOpen(false)
         setFileName(file?.name)
         setImageUrl(data?.uploadFile.fileUrl)
         imagesData.push(data)
         setImagesUrls((images: any) => [...images, data?.uploadFile.fileUrl || ''])
       })
        return imagesData
      }
      if (!multiple && files?.[0]) {
        setIsLoading(true)

        const { data, errors } = await uploadFile({
          variables: { file: files[0] },
        })

        if (errors) {
          setError(
            intl.formatMessage({
              id: 'store/form.document-uploader.error.file-size',
            })
          )
          return
        }

        setIsLoading(false)
        setIsOpen(false)
        setFileName(files?.[0].name)
        setImageUrl(data?.uploadFile.fileUrl)
        return data
      }
      return setError(
        intl.formatMessage({
          id: 'store/form.document-uploader.error.file-size',
        })
      )
    } catch (err) {
      setError(
        intl.formatMessage({ id: 'store/form.document-uploader.error.generic' })
      )
      setIsLoading(false)
    }
  }

  const { getInputProps, getRootProps } = useDropzone({
    accept: accept ?? '.pdf, image/*',
    maxSize: MAX_SIZE,
    multiple: !!multiple,
    onDrop: onDropImage,
  })

  const handleAddImage = () => {
    setIsOpen(false)
  }

  return (
    <div className={`vtex-styleguide-9-x-dropdown vtex-dropdown ${handles.inputUpload} ${!!error ? handles.inputUploadError : ``} ${fileName ? handles.inputUploadFileLoaded : ``}`} ref={ref}>
      <div className={`${handles.inputUploadContent} flex items-center w-100`}>
        <span className={`${handles.inputUploadLabel} db mb3 w-100 c-on-base t-small`}>{label}</span>
        <StyleButton
          title={intl.formatMessage({ id: 'store/form.add-document.title' })}
          active={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          style={null}
          label={
            <div className={`${handles.inputUploadTrigger} ${fileName ? handles.inputUploadTriggerLoaded : handles.inputUploadTriggerDisabled} flex flex-row justify-between items-center w-100 pa4`}>
              {fileName ? 'Arquivo Carregado' : 'Escolher arquivo'}
            </div>
          }
        />
      </div>

      {isOpen && (
        <div className={`${handles.inputUploadWrapper} absolute pa5 bg-white b--solid b--muted-4 bw1 br2 w5 z-1`}>
          {isLoading && (
            <div className="absolute flex justify-center items-center top-0 left-0 h-100 w-100 br2 z-1 bg-black-05">
              <Spinner />
            </div>
          )}

          <div className={`${handles.inputUploadUrlInput} flex flex-column ${isLoading && 'o-20'}`}>
            <div className="mb4">
              <Input
                label={intl.formatMessage({
                  id: 'store/form.add-document.label',
                })}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setImageUrl(e.target.value)
                }}
                placeholder={intl.formatMessage({
                  id: 'store/form.add-document.placeholder',
                })}
              />
            </div>

            <Button onClick={handleAddImage} size="small" disabled={!!multiple ? !imageUrls?.length : !imageUrl}>
              <IOMessage id={messages.add.id} />
            </Button>

            <div className={`${handles.inputUploadButtonWrapper} flex flex-column`}>
              <span className={`${handles.inputUploadButtonLabel} db mb3 w-100 c-on-base t-small`}>
                <IOMessage id={messages.uploadLabel.id} />
              </span>
              <div {...getRootProps()} className={`${handles.inputUploadButton} flex flex-column`}>
                <input {...getInputProps()} />
                <Button size="small">
                  <IOMessage id={messages.uploadButton.id} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <div className={`${handles.inputUploadFileName}`}>{fileName}</div> */}

      {inputType && (
        <HiddenInput pointer={pointer} {...rest} value={!!multiple ? imageUrls?.join(', ') : imageUrl} />
      )}

      {error && <div className="vtex-input__error c-danger t-small mt3 lh-title">{error}</div>}
    </div>
  )
}

export default InputUpload
