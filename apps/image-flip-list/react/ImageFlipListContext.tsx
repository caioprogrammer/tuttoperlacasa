import React, { ReactChildren } from 'react';
import { ListContextProvider } from "vtex.list-context"
import ImageFlip from './components/ImageFlip';
import { Image } from './ImageFlipList';

interface ImageFlipListContextProps {
  images: Image[],
  showTitles: boolean,
  children: ReactChildren
}

function ImageFlipListContext({children, showTitles, images}: ImageFlipListContextProps) {
  const imagesList = images.map(
    (image, index) => <ImageFlip key={`${image.imgURL}-${index}`} image={image} showTitles={showTitles} />
  )

  return (
    <ListContextProvider list={imagesList}>
      {children}
    </ListContextProvider>
  );
}

ImageFlipListContext.schema = {
  title: "Carrosel de imagens",
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

export default ImageFlipListContext;
