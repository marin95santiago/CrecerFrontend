export interface Item {
  entityId?: string
  code: string
  account: number
  description: string
  price?: number
  unitMeasure?: {
    code: number
    description: string
  }
  itemType?: {
    code: number
    description: string
  } 
}