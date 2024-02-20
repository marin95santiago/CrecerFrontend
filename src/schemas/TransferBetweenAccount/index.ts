export interface TransferBetweenAccount {
  entityId?: string
  userId?: string
  date: string
  code: string
  total: number
  sourceAccount: number
  destinationAccount: number
  status: string
}