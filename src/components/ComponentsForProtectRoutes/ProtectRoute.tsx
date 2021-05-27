import React, { ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useAppSelector } from '../../redux/store.hooks';
import { loginSelector } from '../ComponentsForPage/Login/login.splice';
import { urls } from '../../urls';

export default function ProtectRoute({children, ...rest}: { children: ReactElement}) {

    const user = useAppSelector(loginSelector);

    return (
        <Route
            {...rest}
            render={() => 
                user ? children : <Redirect to={urls.page.login}/>
            }
        />
    )
}