import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core'
import { Cancel, NoteAdd } from '@material-ui/icons'
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import { Account } from '../../../schemas/Account'
import AccountService from '../../../services/Account'
import { useHistory, useLocation } from 'react-router-dom'
import Utils from '../../../utils'
import { urls } from '../../../urls'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '10vh auto 10vh auto',
    height: 'auto'
  },
  description: {
    fontWeight: 'bold',
    marginBottom: '1vh'
  },
  divider: {
    marginBottom: '6vh'
  },
  alignRight: {
    textAlign: 'right',
  },
  thirdClassTitle: {
    color: '#757575',
    marginBottom: '6vh'
  },
  loadingContainer: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    bottom: '0',
    right: '0',
    background: '#BFBFBFBF',
    opacity: 0.6,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '50vh'
  }
}))

// - in this part all the component texts are housed
const texts = {
  header: {
    description: 'Crear cuentas'
  },
  body: {
    field: {
      account: {
        name: 'account',
        helperText: 'Cuenta contable',
        placeholder: 'Cuenta contable',
        validationError: 'Debe ser de 10 dígitos'
      },
      description: {
        name: 'description',
        helperText: 'Escriba la descripción de la cuenta',
        placeholder: 'Descripción de cuenta'
      },
      balance: {
        name: 'balance',
        helperText: 'Escriba el saldo',
        placeholder: 'Saldo'
      }
    }
  }
}

// ------------ Init state -----------
interface State {
  form: Account,
  validations: {
    errorMinLengthAccount: boolean
  }
  isEdit: boolean
  loading: boolean
}

const initState: State = {
  form: {
    account: 0,
    description: '',
    balance: 0
  },
  validations: {
    errorMinLengthAccount: false
  },
  isEdit: false,
  loading: false
}

export default function AccountForm() {

  const classes = useStyles()
  const { search } = useLocation()
  const history = useHistory()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const account = Utils.getIdFromUrl(search)

      if (account) {
        setState({
          ...state,
          loading: true
        })
        const accountService = new AccountService()
        const accountRes = await accountService.getAccountByAccount(userContext.token ?? '', account)
        if (accountRes) {
          setState({
            ...state,
            form: accountRes,
            loading: false,
            isEdit: true
          })
        }
      }
    }
    loadData()
  }, [])

  // HandleChange is the handler to update the state
  // of the state, while the user writes on an input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let errorMinLengthAccount = state.validations.errorMinLengthAccount

    if (name === 'account') {
      errorMinLengthAccount = value.length < Number(process.env.REACT_APP_MAX_LENGTH_CONTABLE_ACCOUNT)
    }

    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value
      },
      validations: {
        errorMinLengthAccount
      }
    })
  }

  // HandleSubmit is the handler to verify and send
  // the state to redux (redux send the info to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // validations
      if (state.validations.errorMinLengthAccount) {
        throw new Error(`La cuenta debe tener ${process.env.REACT_APP_MAX_LENGTH_CONTABLE_ACCOUNT} dígitos`)
      }

      const accountService = new AccountService()
      let accountCreated

      if (state.isEdit) {
        accountCreated = await accountService.updateAccount(state.form, userContext.token ?? '')
      } else {
        accountCreated = await accountService.saveAccount(state.form, userContext.token ?? '')
      }

      setState(initState)
      history.push(urls.app.main.account.form)
      return toast.success(`La cuenta ${accountCreated.account} fue ${state.isEdit ? 'actualizado' : 'creado'} con éxito`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      } else if (error instanceof Error) {
        return toast.error(error.message)
      }
    }

  }

  const cancel = () => {
    setState(initState)
  }

  return (
    <div className={classes.root}>

      {/* ----- Header -----*/}
      <React.Fragment>
        <Typography
          variant='h5'
          className={classes.description}
        >
          {texts.header.description}
        </Typography>
      </React.Fragment>

      <Divider
        className={classes.divider}
      />

      {/* ----- Body ------*/}
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={3}>

          {/* ----- Form: account ------*/}
          <Grid item md={6} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.account.name}
              value={state.form.account}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={ state.validations.errorMinLengthAccount ? texts.body.field.account.validationError : texts.body.field.account.helperText}
              error={state.validations.errorMinLengthAccount}
              placeholder={texts.body.field.account.placeholder}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>

          {/* ----- Form: description ------*/}
          <Grid item md={6} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.description.name}
              value={state.form.description}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.description.helperText}
              placeholder={texts.body.field.description.placeholder}
            />
          </Grid>

          {/* ----- Form: balance ------*/}
          <Grid item md={6} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.balance.name}
              value={state.form.balance}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.balance.helperText}
              placeholder={texts.body.field.balance.placeholder}
            />
          </Grid>

          <Grid item md={12} sm={6} xs={12} className={classes.alignRight}>
            <IconButton
              type="submit"
            >
              <NoteAdd fontSize={"large"} color="primary" />
            </IconButton>

            <IconButton
              type="button"
              onClick={cancel}
            >
              <Cancel fontSize={"large"} color="secondary" />
            </IconButton>
          </Grid>

        </Grid>
      </form>
      {
        state.loading ?
        (
          <div className={classes.loadingContainer}>
            <Box>
              <CircularProgress/>
            </Box>
          </div>
        ) : ''
      }
    </div>
  )
}
