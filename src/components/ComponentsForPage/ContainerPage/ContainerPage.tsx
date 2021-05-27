import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { urls } from '../../../urls';
import { CssBaseline } from '@material-ui/core';
import Login from '../Login/Login';

export default function ContainerApp() {

    return (
        <div>
            <CssBaseline/>
            <div>
                <div>
                    {
                        // This proyect uses the url.sts file to manage the urls
                    }
                    <Switch>
                        <Route exact path={urls.page.home} >
                            {/* here will be the home component */}
                            <h1>Home</h1>
                        </Route>
                        <Route path={urls.page.login}>
                            <Login />
                        </Route>
                    </Switch>
              
                </div>
            </div>
        </div>
    );
}
