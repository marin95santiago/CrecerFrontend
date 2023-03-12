import * as React from 'react'
import { UserContextProvider } from './User/index'

export default function GlobalProvider(props: any) {
  return (
    <UserContextProvider>
      {props.children}
    </UserContextProvider>
  )
}