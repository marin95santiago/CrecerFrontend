import Cookies from 'js-cookie'
import jwt from 'jwt-decode'
import { ElectronicBillFormSchema, ItemComplete, Tax } from "./schemas/ElectronicBill"
import userMapper from './mappers/User/user.mapper'
import { User } from './schemas/User'
import entityMapper from './mappers/Entity/entity.mapper'
import { Entity } from './schemas/Entity'

const Utils = {
  getUserByCookieAuth: () : User | undefined => {
    type jwtDecode = {
      data: {
        user: any
      }
    }
    const token = Cookies.get('auth')

    if (token === undefined) return undefined

    const tokenData = jwt<jwtDecode>(token)
    const user = userMapper(tokenData.data.user)
    user.token = token
    return user
  },

  getEntityByCookieAuth: () : Entity | undefined => {
    type jwtDecode = {
      data: {
        entity: any
      }
    }
    const token = Cookies.get('auth')

    if (token === undefined) return undefined

    const tokenData = jwt<jwtDecode>(token)
    const entity = entityMapper(tokenData.data.entity)
    return entity
  },

  removeCookieAuth: () => {
    Cookies.remove('auth')
  },

  buildItem: (form: ElectronicBillFormSchema, applyTaxes: boolean): ItemComplete => {
    let tax = {
      code: '',
      description: '',
      percent: 0,
      taxAmount: 0,
      taxableAmount: 0
    }

    if (applyTaxes) {
      tax = {
        ...form.selectedTax,
        percent: form.currentPercentTax,
        taxAmount: ((form.currentQuantity * form.currentPrice) * form.currentPercentTax / 100),
        taxableAmount: (form.currentQuantity * form.currentPrice)
      }
    } else {
      tax = {
        code: '1',
        description: 'Iva',
        percent: 0,
        taxAmount: 0,
        taxableAmount: (form.currentQuantity * form.currentPrice)
      }
    }

    return {
      ...form.currentItem,
      itemType: form.currentItemType,
      price: form.currentPrice,
      quantity: form.currentQuantity,
      total: (form.currentQuantity * form.currentPrice),
      taxes: [
        tax
      ]
    }
  },

  buildTaxesForElectronicBill: (items: ItemComplete[]) : Tax[] | [] => {
    let res: Tax[]| any[] = []
    items.forEach(item => {
      res = res.concat(item.taxes)
    })
    return res
  },

  getIdFromUrl: (search: string) : string | undefined => {
    if (search !== undefined) {
      const regex = /=\s*(\d+)/
      const match = search.match(regex)

      if (match) {
        const document = match[1]
        return document
      }
    } else {
      return undefined
    }
  },

  getCodeFromUrl: (search: string): string | undefined => {
    if (search !== undefined) {
      const regex = /=\s*(\S+)/g;
      const match = search.match(regex);
      if (match) {
        const document = match[0].substring(1);
        return document;
      }
    } else {
      return undefined;
    }
  },

  parseQueryString: (url: string) : { [key: string]: string }[] => {
    const queryString = url.split('?')[1]
    if (!queryString) {
      return []
    }
    const params = queryString.split('&')
    const result = []
    for (const param of params) {
      const [key, value] = param.split('=')
      result.push({ [key]: decodeURIComponent(value) })
    }
    return result
  },

  formatNumber: (number: number): string => {
    return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}

export default Utils