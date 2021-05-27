import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme'
import store from './redux/store';
import ContainerApp from './components/ComponentsForApp/ContainerApp/ContainerApp';
import { urls } from './urls';
import ContainerPage from './components/ComponentsForPage/ContainerPage/ContainerPage';

function App() {

    return (
        <MuiThemeProvider theme={theme}>
    
        <Provider store={store}>

            {
                // This proyect uses the url.sts file to manage the urls
            }

            <Router>
                <Switch>
                    {
                        // the page container has all the components
                        // that are part of Crecer´s single page
                    }
                    <Route path={urls.page.home}>
                        <ContainerPage  />
                    </Route>

                    {
                        // the app container has all the components
                        // that are part of Crecer App
                    }
                    <Route path={urls.app.index}>
                        <ContainerApp/>
                    </Route>
                </Switch>
            </Router>
        </Provider>
        </MuiThemeProvider>
    );
}

export default App;
