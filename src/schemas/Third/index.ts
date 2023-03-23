export interface Third {
  entityId?: string
  document: string
  dv?: string
  documentType: {
    code: string
    description: string
  }
  organizationType: {
    code: string
    description: string
  }
  liabilityType: {
    code: string
    description: string
  }
  regimeType: {
    code: string
    description: string
  }
  name?: string
  lastname?: string
  businessName?: string
  phone: string
  address: string
  city?: {
    code: string
    description: string
  }
  email: string
}