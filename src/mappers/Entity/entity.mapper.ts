import { Address, Entity, Signatory } from "../../schemas/Entity";

export default function entityMapper(entity: any | unknown): Entity {
  return {
    id: entity.id ?? '',
    name: entity.name ?? '',
    entityTypeCode: entity.entityTypeCode ?? '',
    document: entity.document ?? '',
    signatories: entity.signatories ? signatoriesMapper(entity.signatories) : undefined,
    address: entity.address ? addressMapper(entity.address) : undefined,
    email: entity.email ?? '',
    phone: entity.phone ?? '',
    apiKeyPlemsi: entity.apiKeyPlemsi ?? '',
    state: entity.state ?? '',
    resolution: entity.resolution ?? '',
    resolutionText: entity.resolutionText ?? '',
    lastElectronicBillNumber: entity.lastElectronicBillNumber ?? 0
  }
}

function addressMapper(address: any): Address {
  return {
    description: address.description ?? '',
    city: {
      code: address.city.code ?? '',
      description: address.city.description ?? ''
    }
  }
}

function signatoriesMapper(signatories: any[]): Signatory[] {
  const response = signatories.map(signatory => {
    return {
      name: signatory.name ?? '',
      lastname: signatory.lastname ?? '',
      document: signatory.document ?? '',
      documentType: {
        code: signatory.documentType.code ?? '',
        description: signatory.documentType.description ?? ''
      }
    }
  })

  return response
}
