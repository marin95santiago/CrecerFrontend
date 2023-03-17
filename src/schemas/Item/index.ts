export interface Item {
  entityId?: string
  code: string
  description: string
  price?: number
  unitMeasure?: {
    code: number
    description: string
  }
}