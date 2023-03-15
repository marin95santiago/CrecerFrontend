import axios from 'axios'
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
}

export default ItemService
