import { Item } from "../../schemas/Item";

export default function itemMapper(item: any | unknown): Item {
  return {
    code: item.code ?? '',
    account: item.account ?? 0,
    description: item.description ?? '',
    price: item.price ?? undefined,
    unitMeasure: {
      code: item.unitMeasure?.code ?? '',
      description: item.unitMeasure?.description ?? ''
    } ?? undefined,
    itemType: {
      code: item.itemType?.code ?? 0,
      description: item.itemType?.description ?? ''
    } ?? undefined
  }
}
