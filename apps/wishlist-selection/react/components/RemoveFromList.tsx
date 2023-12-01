import React, { RefObject, useEffect, useRef, useState } from 'react'
import { useLazyQuery, useMutation } from 'react-apollo'
import removeFromList from '../queries/removeFromList.gql'
import checkItem from '../queries/checkItem.gql'
import { localStore, saveToLocalStorageItem } from '../utils/storage'
import { useRuntime } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'
import { addWishlisted, getIdFromList } from '../utils/wishlistHelpers'

type RemoveFromListButtonProps = {
  products: any[]
}

type RemoveFromListProps = {
  product: any
  useRefs: any
}

const RemoveFromList = ({ product, useRefs }: RemoveFromListProps) => {
  const { route, account } = useRuntime()
  const [handleCheck, { data }] = useLazyQuery(checkItem)
  const { push } = usePixel()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const [state, setState] = useState<any>({
    isLoading: true,
    isWishlistPage: null,
  })

  const productCheck: {
    [key: string]: { isWishlisted: boolean; wishListId: string; sku: string }
  } = {}

  const defaultValues = {
    LIST_NAME: 'Wishlist',
    WISHLISTED: JSON.parse(localStore.getItem('wishlist_wishlisted')) ?? [],
    SHOPPER_ID: localStore.getItem('wishlist_shopperId') ?? null
  }

  const sku = product?.sku?.itemId
  const [productId] = String(product?.productId).split('-')

  const [removeProduct] = useMutation(
    removeFromList,
    {
      onCompleted: () => {
        const [productId] = String(product.productId).split('-')

        if (productCheck[productId]) {
          productCheck[productId] = {
            isWishlisted: false,
            wishListId: '',
            sku: '',
          }
        }
        defaultValues.WISHLISTED = defaultValues.WISHLISTED.filter(
          (item: any) => !(item.productId === productId && item.sku === sku)
        )
        saveToLocalStorageItem(defaultValues.WISHLISTED)
        setState({
          ...state,
          isWishlistPage: false,
        })
      },
    }
  )

  useEffect(() => {
    handleCheck({
      variables: {
        shopperId: String(defaultValues.SHOPPER_ID),
        productId,
        sku,
      },
    })
    useRefs((refs: RefObject<HTMLButtonElement>[]) => [...refs, buttonRef])

    return () => {
      useRefs([])
    }

  }, [product])

  const handlerClick = () => {
    const selectedItem = product?.sku

    const pixelEvent: any = {
      list: route?.canonicalPath?.replace('/', ''),
      items: {
        product,
        selectedItem,
        account,
      },
    }

    if (
      data?.checkList?.inList &&
      (!productCheck[productId] || productCheck[productId].wishListId === null)
    ) {
      const itemWishListId = getIdFromList(
        defaultValues.LIST_NAME,
        data.checkList
      )
       productCheck[productId] = {
        isWishlisted: data.checkList.inList,
        wishListId: itemWishListId,
        sku,
      }
      if (
        data.checkList.inList &&
        defaultValues.WISHLISTED.find(
          (item: any) => item.productId === productId && item.sku === sku
        ) === undefined
      ) {
        addWishlisted(productId, sku, defaultValues.WISHLISTED)
      }
    }
    removeProduct({
      variables: {
        id: productCheck[productId].wishListId,
        shopperId: defaultValues.SHOPPER_ID,
        name: defaultValues.LIST_NAME,
      },
    })
    pixelEvent.event = 'removeToWishlist'
    push(pixelEvent)

    //location.reload();
  }
  /* <button ref={buttonRef} className='dn' onClick={handlerClick}></button> */
  // { sku, handler: handlerClick }
  return <button ref={buttonRef} className='dn' data-sku={sku} onClick={handlerClick}></button>
}

const RemoveFromListButton = (({ products }: RemoveFromListButtonProps) => {
    const [refs, useRefs] = useState<RefObject<HTMLButtonElement>[]>([])

    return (
      <>
        <div>
          <button
            onClick={(e: any) => {
              e.preventDefault()
              e.stopPropagation()
              //useRefs([])
              console.log('buttonRefs', refs)
              refs.map(ref => {
                ref?.current?.click()
                ref?.current?.remove()
              })

            }}
          >
            Remover todos
          </button>
          {products.map((product: any, index: number) => <RemoveFromList product={product} key={index} useRefs={useRefs}/>)}
        </div>
      </>
    )
})

export default RemoveFromListButton
