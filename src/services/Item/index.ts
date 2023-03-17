import axios from 'axios'
import itemMapper from '../../mappers/Item/item.mapper'
import { Item } from '../../schemas/Item'

class ItemService {
  async saveItem(itemData: Item, token: string) {
    try {
      const responseApi = await axios.post('/api/v2/item', itemData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getItems(token: string) : Promise<Item[]> {
    try {
      const responseApi = await axios.get('/api/v2/item', {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const items = responseApi.data.map((item:any) => {
        return itemMapper(item)
      })

      return items

    } catch (error) {
      throw error
    }
  }
}

export default ItemService
