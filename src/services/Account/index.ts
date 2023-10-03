import axios from 'axios'
import accountMapper from '../../mappers/Account/account.mapper'
import { Account } from '../../schemas/Account'

class AccountService {
  async saveAccount(account: Account, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/account` 
      const responseApi = await axios.post(url, account, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async updateAccount(accountData: Account, token: string) {
    try {
      const url = `${process.env.REACT_APP_API}/api/v2/account` 
      const responseApi = await axios.put(url, accountData, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return responseApi.data
    } catch (error) {
      throw error
    }
  }

  async getAccountByAccount(token: string, accountId: string) : Promise<Account> {
    try {
      let url = `${process.env.REACT_APP_API}/api/v2/account/${accountId}`
  
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        } 
      })

      const account = accountMapper(responseApi.data) 

      return account
    } catch (error) {
      throw error
    }
  }

  async getAccounts(token: string, params?: { limit: number, lastEvaluatedKey?: string }) : Promise<{ lastEvaluatedKey: string, accounts: Account[] }>{
    try {
      let url = params !== undefined ? `${process.env.REACT_APP_API}/api/v2/account?limit=${params.limit}` : `${process.env.REACT_APP_API}/api/v2/account`
      if (params !== undefined && params.lastEvaluatedKey !== undefined) url = `${url}&lastEvaluatedKey=${params.lastEvaluatedKey}`
      
      const responseApi = await axios.get(url, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })

      const accounts = responseApi.data.accounts.map((item:any) => {
        return accountMapper(item)
      })

      return {
        lastEvaluatedKey: JSON.stringify(responseApi.data.lastEvaluatedKey),
        accounts: accounts
      }

    } catch (error) {
      throw error
    }
  }
}

export default AccountService
