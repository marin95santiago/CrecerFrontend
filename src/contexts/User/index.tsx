import { createContext, ReactNode, useState } from 'react'
import { User } from '../../schemas/User/index'
import Utils from '../../utils'

const Context = createContext({})

interface Props {
  children: ReactNode
}

export const initialContextUserState: User = {
  id: '',
  email: '',
  name: '',
  lastname: '',
  entityId: '',
  state: '',
  permissions: ['']
}

export function UserContextProvider({ children }: Props) {
  const auth = Utils.getUserByCookieAuth()

  const [userContext, setUserContext] = useState<User>(auth ?? initialContextUserState)

  return (
    <Context.Provider value={{ userContext, setUserContext }}>
      {children}
    </Context.Provider>
  )
}

export default Context