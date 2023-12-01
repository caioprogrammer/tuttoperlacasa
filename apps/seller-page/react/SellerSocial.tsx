import React from 'react'
import { StoreLink } from 'vtex.store-link'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['sellerSocial']

interface SellerSocialProps {
  InstagramIcon?: React.FC
  TwitterIcon?: React.FC
  FacebookIcon?: React.FC
  YoutubeIcon?: React.FC
  instagram: string
  twitter: string
  facebook: string
  youtube: string
  link: any
}

const SellerSocial: StorefrontFunctionComponent<SellerSocialProps> = ({
  InstagramIcon,
  TwitterIcon,
  FacebookIcon,
  YoutubeIcon,
  instagram,
  twitter,
  facebook,
  youtube,
  link,
}) => {
  const { handles } = useCssHandles(CSS_HANDLES)

  return (
    <>
      {twitter && TwitterIcon && (
        <div
          className={`${handles.sellerSocial} ${handles.sellerSocial}--twitter`}
        >
          <StoreLink
            {...link}
            href={`https://twitter.com/${twitter}`}
            className={handles.sellerSocial}
          >
            <TwitterIcon />
          </StoreLink>
        </div>
      )}
      {youtube && YoutubeIcon && (
        <div
          className={`${handles.sellerSocial} ${handles.sellerSocial}--youtube`}
        >
          <StoreLink
            key={youtube}
            {...link}
            href={`https://youtube.com/${youtube}`}
          >
            <YoutubeIcon />
          </StoreLink>
        </div>
      )}
      {facebook && FacebookIcon && (
        <div
          className={`${handles.sellerSocial} ${handles.sellerSocial}--facebook`}
        >
          <StoreLink
            key={facebook}
            {...link}
            href={`https://facebook.com/${facebook}`}
          >
            <FacebookIcon />
          </StoreLink>
        </div>
      )}
      {instagram && InstagramIcon && (
        <div
          className={`${handles.sellerSocial} ${handles.sellerSocial}--instagram`}
        >
          <StoreLink
            key={instagram}
            {...link}
            href={`https://instagram.com/${instagram}`}
          >
            <InstagramIcon />
          </StoreLink>
        </div>
      )}
    </>
  )
}

SellerSocial.schema = {
  title: 'redes sociais',
  type: 'object',
  properties: {
    twitter: { type: 'string' },
    facebook: { type: 'string' },
    youtube: { type: 'string' },
    instagram: { type: 'string' },
  },
}

export default SellerSocial
