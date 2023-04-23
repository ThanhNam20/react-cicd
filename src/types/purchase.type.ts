export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5

export type PurchaseListStatus = PurchaseStatus | 0

export interface Purchase {
  buy_count: number
  price: number
  price_before_discount: number
  status: number
  _id: string
  user: string
  createdAt: string
  updatedAt: string
}
