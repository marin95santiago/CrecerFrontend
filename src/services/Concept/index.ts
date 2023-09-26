import axios from 'axios'
// import conceptMapper from '../../mappers/Concept/concept.mapper'
import { Concept } from '../../schemas/Concept'

class ConceptService {
  async saveConcept(concept: Concept, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/concept` 
      const responseApi = await axios.post(url, concept, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }
  /*
  async getItems(token: string) : Promise<Item[]> {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/item` 
      const responseApi = await axios.get(url, {
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
  */
}

export default ConceptService
