export interface Signatory {
  name: string
  lastname: string
  document: string
  documentType: {
    code: string
    description: string
  }
}

export interface Address {
  description: string
  city: {
    code: string
    description: string
  }
}

export interface ReceiptNumbers {
  prefix: string
  lastReceiptNumber: number
}

export interface Entity {
  id: string
  name: string
  entityTypeCode: string
  document: string
  dv: number
  signatories?: Signatory[]
  address?: Address
  email?: string
  phone?: string
  apiKeyPlemsi?: string
  state: string
  resolution?: string
  resolutionText?: string
  lastElectronicBillNumber?: number
  receiptNumbers?: ReceiptNumbers[]
}

export type EntityContextType = {
  entityContext: Entity;
  setEntityContext: (value: Entity) => void;
}
