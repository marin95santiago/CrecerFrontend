export interface CashReceipt {
    type: string,
    date: Date,
    serial: string,
    third: string,
    classThird: string,
    valueText: string,
    valueNumber: number,
    wayPay: Array<WayPay>,
    conceptTable: Array<Concept>,
}

export type WayPay = {
    wayPay: string,
    bank: string
}

export type Concept = {
    concept: string,
    detail: string,
    value: string
}