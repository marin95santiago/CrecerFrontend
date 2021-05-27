export interface InternalTransaction {
    type: string,
    date: Date,
    serial: string,
    bank: string,
    secondBank: string | undefined
    value: number
}