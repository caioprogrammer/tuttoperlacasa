const populateCart = (data: any) =>{
  const skuItem = data.sku
  return {
    additionalInfo: {
      brandName: data.brand,
      __typename: 'ItemAdditionalInfo',
    },
    availability: Boolean(skuItem.seller.commertialOffer.AvailableQuantity),
    id: skuItem.itemId,
    imageUrls: {
      at1x: skuItem.images[0].imageUrl,
      __typename: 'ImageUrls',
    },
    listPrice: skuItem.seller.commertialOffer.ListPrice,
    measurementUnit: skuItem.measurementUnit,
    name: data.productName,
    price: skuItem.seller.commertialOffer.Price,
    productId: data.productId,
    quantity: 1,
    seller: skuItem.seller.sellerId,
    sellingPrice: skuItem.bestPrice,
    skuName: skuItem.nameComplete,
    unitMultiplier: skuItem.unitMultiplier,
    uniqueId: skuItem.itemId,
    isGift: false,
    __typename: 'Item',
  }
}

export default populateCart
