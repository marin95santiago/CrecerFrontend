export interface CostCenter {
  entityId?: string
  description: string
  code: string
  type: {
    code: string,
    description: string
  }
}