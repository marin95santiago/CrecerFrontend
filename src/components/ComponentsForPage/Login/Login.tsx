import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import UserContext from '../../../contexts/User';
import { UserContextType } from '../../../schemas/User';
import UserService from '../../../services/User/index'
import { urls } from '../../../urls';
import { ServerError } from '../../../schemas/Error'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: '#fafafa',
  },
  state: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// - in this part all the component texts are housed
const texts = {
  header: {
    title: 'Inicia sesión',
    logo: {
      path: '/images/logotipo-crecer-dmc.svg',
      alt: 'logotipo de crecer dmc'
    }
  },
  state: {
    field: {
      email: {
        name: 'email',
        label: 'Correo'
      },
      password: {
        name: 'password',
        label: 'Contraseña'
      },
      rememberCheck: {
        value: 'remember',
        label: 'Recordarme'
      },
      signinButton: {
        title: 'Entrar'
      }
    },
    footer: {
      forgotPasswordLink: 'Olvidaste tu contraseña?',
      createAccountLink: 'Aún no tienes un usuario?',
      copyright: 'CRECER DMC'
    }
  }
}

// ------------- Init state -----------
interface LoginForm {
  email: string
  password: string
}

const initState: LoginForm = {
  email: '',
  password: ''
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        {texts.state.footer.copyright}
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {

  const { userContext, setUserContext } = React.useContext(
    UserContext
  ) as UserContextType

  const history = useHistory();
  const classes = useStyles();
  const [state, setState] = useState<LoginForm>(initState);


  React.useEffect(() => {
    if (userContext?.id) {
      history.push(urls.app.main.home)
    }
  }, [])

  // HandleChange is the handler to update the state
  // of the state, while the user writes on an input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState({
      ...state,
      [name]: value
    })
  }

  // HandleSubmit is the handler to verify and send
  // the state to redux (redux send the info to backend)
  async function onLogin() {
    try {
      const userService = new UserService()
      const user = await userService.login(state.email, state.password)
      console.log(user)
      if (user) {
        setUserContext(user)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      }
    }
    history.push(urls.app.main.home)
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>

        {/* ------- *Header --------- */}
        <Avatar className={classes.avatar}>
          <img
            src={texts.header.logo.path}
            alt={texts.header.logo.alt}
          />
        </Avatar>

        <Typography component="h1" variant="h5">
          {texts.header.title}
        </Typography>

        {/* ------- *Body ----------- */}
        <form className={classes.state} noValidate>

          {/* ----- Form: item **email ------*/}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            onChange={handleChange}
            value={state.email}
            id={texts.state.field.email.name}
            label={texts.state.field.email.label}
            name={texts.state.field.email.name}
            autoFocus
          />

          {/* ----- Form: item **password ------*/}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={state.password}
            onChange={handleChange}
            name={texts.state.field.password.name}
            label={texts.state.field.password.label}
            type="password"
            id={texts.state.field.password.name}
            autoComplete="current-password"
          />

          {/* ----- Form: item **remember check ------*/}
          <FormControlLabel
            control={<Checkbox value={texts.state.field.rememberCheck.value} color="primary" />}
            label={texts.state.field.rememberCheck.label}
          />

          <Button
            onClick={onLogin}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {texts.state.field.signinButton.title}
          </Button>

          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {texts.state.footer.forgotPasswordLink}
              </Link>
            </Grid>

            <Grid item>
              <Link href="#" variant="body2">
                {texts.state.footer.createAccountLink}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>

      <Box mt={8}>
        <Copyright />
      </Box>

    </Container>
  )
}