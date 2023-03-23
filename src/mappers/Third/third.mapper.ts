import { Third } from "../../schemas/Third";

export default function thirdMapper(third: any | unknown): Third {
  return {
    entityId: third.entityId ?? '',
    document: third.document ?? '',
    dv: third.dv ?? '',
    documentType: third.documentType ?? { code: '', description: '' },
    organizationType: third.organizationType ?? { code: '', description: '' },
    liabilityType: third.liabilityType ?? { code: '', description: '' },
    regimeType: third.regimeType ?? { code: '', description: '' },
    name: third.name ?? undefined,
    lastname: third.lastname ?? undefined,
    businessName: third.businessName ?? undefined,
    phone: third.phone ?? '',
    address: third.address ?? '',
    city: third.city ?? undefined,
    email: third.email ?? ''
  }
}
