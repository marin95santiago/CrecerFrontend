import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GlobalProvider from './contexts'
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme'
import ContainerApp from './components/ComponentsForApp/ContainerApp/ContainerApp';
import { urls } from './urls';
import ContainerPage from './components/ComponentsForPage/ContainerPage/ContainerPage';

function App() {

  return (
    <MuiThemeProvider theme={theme}>
      <GlobalProvider>
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
              <ContainerPage />
            </Route>

            {
              // the app container has all the components
              // that are part of Crecer App
            }
            <Route path={urls.app.index}>
              <ContainerApp />
            </Route>
          </Switch>
        </Router>
        <ToastContainer/>
      </GlobalProvider>
    </MuiThemeProvider>
  );
}

export default App;
