import { Item } from "../../schemas/Item";

export default function itemMapper(item: any | unknown): Item {
  return {
    code: item.code ?? '',
    description: item.description ?? '',
    price: item.price ?? undefined,
    unitMeasure: {
      code: item.unitMeasure?.code ?? '',
      description: item.unitMeasure?.description ?? ''
    } ?? undefined
  }
}
