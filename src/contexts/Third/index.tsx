import { createContext, ReactNode, useState } from 'react'
import { Third } from '../../schemas/Third/index'

const Context = createContext({})

interface Props {
  children: ReactNode
}

export const initialContextThirdsState: Third[] = []

export function ThirdsContextProvider({ children }: Props) {
  const thirdsLocal = localStorage.getItem('thirds')
  let thirds
  if (thirdsLocal) {
    thirds = JSON.parse(thirdsLocal)
  }
  const [thirdsContext, setThirdsContext] = useState<Third[]>(thirds ?? initialContextThirdsState)

  return (
    <Context.Provider value={{ thirdsContext, setThirdsContext }}>
      {children}
    </Context.Provider>
  )
}

export default Context