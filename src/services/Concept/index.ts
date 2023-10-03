import axios from 'axios'
import conceptMapper from '../../mappers/Concept/concept.mapper'
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

  async updateConcept(conceptData: Concept, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/concept` 
      const responseApi = await axios.put(url, conceptData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getConceptByAccount(token: string, account: string) : Promise<Concept> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/concept/${account}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const concept = conceptMapper(responseApi.data) 

      return concept
    } catch (error) {
      throw error
    }
  }

  async getConcepts(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, concepts: Concept[] }>{
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/concept?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/concept`
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
      
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const concepts = responseApi.data.concepts.map((item:any) => {
        return conceptMapper(item)
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        concepts: concepts
      }

    } catch (error) {
      throw error
    }
  }
}

export default ConceptService
