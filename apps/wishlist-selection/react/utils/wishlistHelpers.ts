import { saveToLocalStorageItem } from "./storage"

export const getIdFromList = (list: string, item: any) => {
  const pos = item.listNames.findIndex((listName: string) => {
    return list === listName
  })
  return item.listIds[pos]
}

export const addWishlisted = (productId: any, sku: any, wishListed: any[]) => {
  if (
    wishListed.find(
      (item: any) =>
        item.productId &&
        item.sku &&
        item.productId === productId &&
        item.sku === sku
    ) === undefined
  ) {
    wishListed.push({
      productId,
      sku,
    })
  }
  saveToLocalStorageItem(wishListed)
}
