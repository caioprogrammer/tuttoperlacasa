import React from 'react';
import { useCssHandles } from 'vtex.css-handles';
import { Image } from '../ImageFlipList';

// import { Container } from './styles';

const CSS_HANDLES = ["itemContainer", "imageLink", "imageContainer", "image", "imageFlip", "title"]


interface ImageFlipProps {
  image: Image;
  showTitles: boolean
}

const ImageFlip: React.FC<ImageFlipProps> = ({image, showTitles}) => {
  const {title, imgFlipURL, imgURL, link, target} = image
  const {handles} = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.itemContainer}>
      <a href={link} className={handles.imageLink} target={target}>
        <figure  className={handles.imageContainer}>
            <img src={imgURL} alt={title} className={handles.image} />
            {imgFlipURL ? (
              <img src={imgFlipURL} alt={title} className={`${handles.image} ${handles.imageFlip}`} />
            ) : ''}
        </figure>
        {showTitles ? (<h4 className={handles.title}>{title ? title : ''}</h4>) : ''}
      </a>
    </div>
  )
}

export default ImageFlip;
