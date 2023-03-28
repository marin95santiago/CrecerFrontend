import { createContext, ReactNode, useState } from 'react'
import { Entity } from '../../schemas/Entity/index'

const Context = createContext({})

interface Props {
  children: ReactNode
}

const initialState: Entity = {
  id: '',
  name: '',
  entityTypeCode: '',
  document: '',
  signatories: undefined,
  address: undefined,
  email: undefined,
  phone: undefined,
  apiKeyPlemsi: undefined,
  state: '',
  resolution: undefined,
  resolutionText: undefined,
  lastElectronicBillNumber: undefined
}

export function EntityContextProvider({ children }: Props) {
  const [entityContext, setEntityContext] = useState<Entity>(initialState)
  return (
    <Context.Provider value={{ entityContext, setEntityContext }}>
      {children}
    </Context.Provider>
  )
}

export default Context
