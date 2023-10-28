import { CostCenter } from "../../schemas/CostCenter";

export default function costCenterMapper(costCenter: any | unknown): CostCenter {
  return {
    entityId: costCenter.entityId ?? '',
    code: costCenter.code ?? '',
    description: costCenter.description ?? '',
    type: {
      code: costCenter.type?.code ?? '',
      description: costCenter.type?.description ?? ''
    } ?? undefined
  }
}
