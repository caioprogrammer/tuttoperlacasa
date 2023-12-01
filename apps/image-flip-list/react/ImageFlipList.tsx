import React from 'react'
import { SliderLayout } from 'vtex.slider-layout'
import { Container } from 'vtex.store-components'
import { SliderLayoutProps } from 'vtex.slider-layout/react/components/SliderContext'
import { useCssHandles } from 'vtex.css-handles'

import './styles.css'
import ImageFlip from './components/ImageFlip'
export interface Image {
  title?: string;
  link: string
  imgURL: string;
  imgFlipURL?: string;
  target?: string;
}

type Props = {
  images: Image[],
  layoutMode: "slider" | "default",
  showTitles: boolean,
  sliderProps: SliderLayoutProps
}

const CSS_HANDLES = ["itemContainer", "imageLink", "imageContainer", "image", "imageFlip", "title", "imagesContainer"]

function ImageFlipList({ images, layoutMode, showTitles = true, sliderProps }: Props) {

  const {handles} = useCssHandles(CSS_HANDLES)

  const imagesEl = images.map((image, index) => <ImageFlip key={`${image.imgURL}-${index}`} image={image} showTitles={showTitles} />)

  if(layoutMode === "slider") {
    return (
      <SliderLayout  infinite={true} {...sliderProps}>
        {imagesEl}
      </SliderLayout>
    )
  }

  return (
    <Container className={handles.imagesContainer}>
      {imagesEl}
    </Container>
  )
}

export default ImageFlipList

ImageFlipList.schema = {
  title: "Carrosel de imagens-vira",
  type: 'object',
  properties: {
    showTitles: {
      title: "Mostrar títulos",
      type: 'boolean',
    },
    images: {
      title: 'Imagens',
      type: 'array',
      minItems: 1,
      items: {
        title: 'Imagem',
        type: 'object',
        properties: {
          link: {
            title: 'Link',
            type: 'string',
          },
          imgURL: {
            title: 'Imagem pricipal',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          imgFlipURL: {
            title: 'Imagem que será mostrada quando houver o hover',
            type: 'string',
            widget: {
              'ui:widget': 'image-uploader',
            },
          },
          title: {
            title: "Descrição da imagem",
            type: 'string'
          }
        },
      },
    }
  }
}
