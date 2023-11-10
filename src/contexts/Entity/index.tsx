import { createContext, ReactNode, useState } from 'react'
import { Entity } from '../../schemas/Entity/index'
import Utils from '../../utils'

const Context = createContext({})

interface Props {
  children: ReactNode
}

const initialState: Entity = {
  id: '',
  name: '',
  entityTypeCode: '',
  document: '',
  dv: 0,
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
  const auth = Utils.getEntityByCookieAuth()
  const [entityContext, setEntityContext] = useState<Entity>(auth ?? initialState)
  return (
    <Context.Provider value={{ entityContext, setEntityContext }}>
      {children}
    </Context.Provider>
  )
}

export default Context
