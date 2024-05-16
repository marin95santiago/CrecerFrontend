import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalProvider from './contexts'
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme'
import ContainerApp from './components/ComponentsForApp/ContainerApp/ContainerApp';
import Login from './components/ComponentsForPage/Login/Login';
import { urls } from './urls';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <GlobalProvider>
        <SubApp />
        <ToastContainer />
      </GlobalProvider>
    </MuiThemeProvider>
  );
}

function SubApp() {
  return (
    <Router>
      <Routes>
        <Route path={urls.page.home} element={<h1>Home</h1>} />
        <Route path={urls.page.login} element={<Login />} />

        <Route path='/app/*' element={<ContainerApp />}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
