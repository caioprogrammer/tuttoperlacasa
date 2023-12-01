export type Shipping = {
  logisticsInfo: LogisticInfo[]
  messages: Message[]
}

export type LogisticInfo = {
  itemIndex: string
  selectedSla: string
  slas: Slas[]
}

export type Message = {
  code: string
  text: string
  status: string
}

export type Slas = {
  id: string
  name: string
  price: string
  shippingEstimate: string
  shippingEstimateDate: string
  deliveryIds: {
    courierId: string
    warehouseId: string
    dockId: string
    courierName: string
    quantity: string
  }
  deliveryChannel: string
  friendlyName: string
}
