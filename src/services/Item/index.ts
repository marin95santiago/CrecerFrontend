import axios from 'axios'
import itemMapper from '../../mappers/Item/item.mapper'
import { Item } from '../../schemas/Item'

class ItemService {
  async saveItem(itemData: Item, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/item` 
      const responseApi = await axios.post(url, itemData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async updateItem(itemData: Item, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/item` 
      const responseApi = await axios.put(url, itemData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getItemByCode(token: string, code: string) : Promise<Item> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/item/${code}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const concept = itemMapper(responseApi.data) 

      return concept
    } catch (error) {
      throw error
    }
  }

  async getItems(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, items: Item[] }> {
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/item?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/item`
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const items = responseApi.data.items.map((item:any) => {
        return itemMapper(item)
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        items: items
      }

    } catch (error) {
      throw error
    }
  }
}

export default ItemService
