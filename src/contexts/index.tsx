import * as React from 'react'
import { UserContextProvider } from './User/index'
import { EntityContextProvider } from './Entity/index'
import { ThirdsContextProvider } from './Third'

export default function GlobalProvider(props: any) {
  return (
    <EntityContextProvider>
    <UserContextProvider>
    <ThirdsContextProvider>
      {props.children}
    </ThirdsContextProvider>
    </UserContextProvider>
    </EntityContextProvider>
  )
}