export interface Concept {
  entityId?: string
  description: string
  account: number
  type: {
    code: string,
    description: string
  }
}