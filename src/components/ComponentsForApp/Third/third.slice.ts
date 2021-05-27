export interface Third {
    thirdType: string,
    documentType: string,
    documentNumber: string,
    thirdName?: string,
    thirdSecondName?: string,
    thirdLastName?: string,
    companyName?: string,
    thirdClass: Array<any>,
    thirdPartyEmail?: string,
    thirdPartyAddress?: string,
    thirdPartyPhone?: string
}

export interface ThirdMigrationForm {
    lastThird: string,
    newThird: string
}