// conceptMapper.ts mappers/Concept
import { Concept } from "../../schemas/Concept";

export default function conceptMapper(concept: any | unknown): Concept {
  return {
    entityId: concept.entityId ?? '',
    account: concept.account ?? 0,
    description: concept.description ?? '',
    type: {
      code: concept.type?.code ?? '',
      description: concept.type?.description ?? ''
    } ?? undefined
  }
}
