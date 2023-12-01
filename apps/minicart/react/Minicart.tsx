import React, { FC } from 'react'
import { IconCart } from 'vtex.store-icons'
import { BackdropMode } from 'vtex.store-drawer'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { ResponsiveValuesTypes } from 'vtex.responsive-values'
import { useCheckoutURL } from 'vtex.checkout-resources/Utils'
import { PixelEventTypes } from 'vtex.pixel-manager'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'

import PopupMode, {
  CSS_HANDLES as PopupModeCssHandles,
} from './components/Popup'
import DrawerMode, {
  CSS_HANDLES as DrawerModeCssHandles,
} from './components/DrawerMode'
import MinicartIconButton, {
  CSS_HANDLES as MinicartIconButtonCssHandles,
} from './components/MinicartIconButton'
import useCartIdPixel from './modules/useCartIdPixel'
import { MinicartCssHandlesProvider } from './components/CssHandlesContext'
import { MinicartContextProvider, useMinicartState } from './MinicartContext'

export const CSS_HANDLES = [
  ...PopupModeCssHandles,
  ...DrawerModeCssHandles,
  ...MinicartIconButtonCssHandles,
  'minicartWrapperContainer',
  'minicartContainer',
] as const

interface MinicartProps {
  variation?: MinicartVariationType
  openOnHover?: boolean
  linkVariationUrl?: string
  maxDrawerWidth?: number | string
  MinicartIcon?: React.ComponentType
  drawerSlideDirection?: SlideDirectionType
  quantityDisplay?: QuantityDisplayType
  itemCountMode?: MinicartTotalItemsType
  alwaysTwoDigits?: AlwaysTwoDigits
  backdropMode?: ResponsiveValuesTypes.ResponsiveValue<BackdropMode>
  customPixelEventId?: string
  customPixelEventName?: PixelEventTypes.EventName
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
}

const Minicart: FC<MinicartProps> = ({
  children,
  backdropMode,
  linkVariationUrl,
  maxDrawerWidth = 400,
  MinicartIcon = IconCart,
  quantityDisplay = 'not-empty',
  itemCountMode = 'distinct',
  drawerSlideDirection = 'rightToLeft',
  customPixelEventId,
  customPixelEventName,
  alwaysTwoDigits = 'never',
  classes,
}) => {
  const { handles, withModifiers } = useCssHandles(CSS_HANDLES, { classes })
  const { variation } = useMinicartState()
  const { url: checkoutUrl } = useCheckoutURL()

  if (variation === 'link') {
    return (
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          <a href={linkVariationUrl ?? checkoutUrl}>
            <MinicartCssHandlesProvider
              handles={handles}
              withModifiers={withModifiers}
            >
              <MinicartIconButton
                Icon={MinicartIcon}
                itemCountMode={itemCountMode}
                quantityDisplay={quantityDisplay}
                alwaysTwoDigits={alwaysTwoDigits}
              />
            </MinicartCssHandlesProvider>
          </a>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
    >
      <div className={`${handles.minicartContainer} flex flex-column`}>
        <MinicartCssHandlesProvider
          handles={handles}
          withModifiers={withModifiers}
        >
          {variation === 'drawer' ? (
            <DrawerMode
              Icon={MinicartIcon}
              backdropMode={backdropMode}
              itemCountMode={itemCountMode}
              alwaysTwoDigits={alwaysTwoDigits}
              maxDrawerWidth={maxDrawerWidth}
              quantityDisplay={quantityDisplay}
              drawerSlideDirection={drawerSlideDirection}
              customPixelEventId={customPixelEventId}
              customPixelEventName={customPixelEventName}
            >
              {children}
            </DrawerMode>
          ) : (
            <PopupMode
              Icon={MinicartIcon}
              itemCountMode={itemCountMode}
              quantityDisplay={quantityDisplay}
              alwaysTwoDigits={alwaysTwoDigits}
              customPixelEventId={customPixelEventId}
              customPixelEventName={customPixelEventName}
            >
              {children}
            </PopupMode>
          )}
        </MinicartCssHandlesProvider>
      </div>
    </aside>
  )
}

const CartIdPixel = () => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()

  const orderFormId = !loading && orderForm ? orderForm.id : undefined

  useCartIdPixel(orderFormId)

  return null
}

const EnhancedMinicart = (props: MinicartProps) => (
  <MinicartContextProvider
    variation={props.variation}
    openOnHover={props.openOnHover}
  >
    <CartIdPixel />
    <Minicart {...props} />
  </MinicartContextProvider>
)

export default EnhancedMinicart
