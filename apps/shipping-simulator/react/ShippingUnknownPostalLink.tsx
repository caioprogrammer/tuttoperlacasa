import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['shippingUnknownPostalWrapper', "shippingUnknownPostalLink"] as const

interface ShippingUnknownPostalLinkProps {
  text: string
}

function ShippingUnknownPostalLink({
  text = "Não sei meu cep"
}: ShippingUnknownPostalLinkProps) {

  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.shippingUnknownPostalWrapper}>
      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noreferrer"
        className={handles.shippingUnknownPostalLink}
      >
        {text}
      </a>
    </div>
  )
}

export default ShippingUnknownPostalLink
