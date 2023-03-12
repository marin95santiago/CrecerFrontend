import React, { ReactElement } from 'react'
import { Route, Redirect } from 'react-router-dom'
import UserContext from '../../contexts/User'
import { UserContextType } from '../../schemas/User'
import { urls } from '../../urls'

export default function ProtectRoute({ children, ...rest }: { children: ReactElement }) {

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  return (
    <Route
      {...rest}
      render={() =>
        userContext.id ? children : <Redirect to={urls.page.login} />
      }
    />
  )
}