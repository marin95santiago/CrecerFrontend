import { createContext, ReactNode, useState } from 'react'
import { User } from '../../schemas/User/index'

const Context = createContext({})

interface Props {
  children: ReactNode
}

const initialState: User = {
  id: '',
  email: '',
  name: '',
  lastname: '',
  entityId: '',
  state: '',
  permissions: ['']
}

export function UserContextProvider({ children }: Props) {
  const [userContext, setUserContext] = useState<User>(initialState)
  return (
    <Context.Provider value={{ userContext, setUserContext }}>
      {children}
    </Context.Provider>
  )
}

export default Context