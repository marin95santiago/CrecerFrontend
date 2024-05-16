import React, { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import UserContext from '../../contexts/User'
import { UserContextType } from '../../schemas/User'
import { urls } from '../../urls'

export default function ProtectRoute({ children, ...rest }: { children: ReactElement }) {
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  return (
    <div>
      {!userContext.id ? (
        <Navigate to={urls.page.login} replace={true} />
      ) : children }
    </div>
  );
}
