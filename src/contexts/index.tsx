import * as React from 'react'
import { UserContextProvider } from './User/index'
import { EntityContextProvider } from './Entity/index'

export default function GlobalProvider(props: any) {
  return (
    <EntityContextProvider>
    <UserContextProvider>
      {props.children}
    </UserContextProvider>
    </EntityContextProvider>
  )
}