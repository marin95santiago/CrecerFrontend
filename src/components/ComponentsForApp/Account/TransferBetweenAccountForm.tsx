/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import {
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core'
import { Cancel, NoteAdd } from '@material-ui/icons'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import { TransferBetweenAccount } from '../../../schemas/TransferBetweenAccount'
import { Account } from '../../../schemas/Account'
import AccountService from '../../../services/Account'
import { urls } from '../../../urls'
import { ServerError } from '../../../schemas/Error'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '10vh auto 10vh auto',
    height: 'auto'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '1vh'
  },
  divider: {
    marginBottom: '6vh'
  },
  alignRight: {
    textAlign: 'right',
  }
}))

// - in this part all the component texts are housed
const texts = {
  header: {
    title: 'Transacciones entre cuentas'
  },
  body: {
    field: {
      date: {
        name: 'date',
        helperText: 'Ingrese la fecha del movimiento',
        placeholder: 'Fecha *'
      },
      code: {
        name: 'code',
        helperText: 'Ingrese el código de transacción',
        placeholder: 'Serial *'
      },
      sourceAccount: {
        name: 'sourceAccount',
        helperText: 'Escoja la cuenta de origen'
      },
      destinationAccount: {
        name: 'destinationAccount',
        helperText: 'Escoja la cuenta de destino'
      },
      total: {
        name: 'total',
        helperText: 'Ingrese el valor a transferir',
        placeholder: 'Total *'
      }
    }
  }
}

interface State {
  form: TransferBetweenAccount
  accounts: Account[]
  accountsDestination: Account[]
  loading: boolean
}

// ------------- Init state -----------
const initState: State = {
  form: {
    date: '',
    code: '',
    total: 0,
    sourceAccount: 0,
    destinationAccount: 0,
    status: 'VALID'
  },
  accounts: [],
  accountsDestination: [],
  loading: false
}

export default function TransferBetweenAccountForm() {
  const classes = useStyles()
  const [state, setState] = useState<State>(initState)

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      try {
        setState({
          ...state,
          loading: true
        })

        // get accounts
        const accountService = new AccountService()
        const accountRes = await accountService.getAccounts(userContext.token || '')
        const accounts = accountRes.accounts

        setState({
          ...state,
          accounts: accounts,
          loading: false
        })
      } catch (error) {
        setState({
          ...state,
          loading: false
        })
  
        if (axios.isAxiosError(error)) {
          const serverError = error as AxiosError<ServerError>
          if (serverError && serverError.response) {
            return toast.error(serverError.response.data.message || error.toString())
          }
        }
      }
    }
  
    loadData()
  }, [])

  // HandleChange is the handler to update the state
  // of the state, while the user writes on an input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value
      }
    })
  }

  const handleChangeSelect = (name: string, value: string | number) => {
    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value
      },
      accountsDestination: name === 'sourceAccount' ? state.accounts.filter(acc => acc.account !== value) : state.accountsDestination
    })
  }

  // HandleSubmit is the handler to verify and send
  // the form to redux (redux send the info to backend)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // validations
      if (!state.form.sourceAccount || state.form.sourceAccount === 0) throw new Error('Debe seleccionar una cuenta de origen')
      if (!state.form.destinationAccount || state.form.destinationAccount === 0) throw new Error('Debe seleccionar una cuenta de destino')

      const accountService = new AccountService()
      const transferCreated = await accountService.transferBetweenAccount(state.form, userContext.token ?? '')

      setState({
        ...initState,
        accounts: state.accounts
      })

      redirect(urls.app.main.account.transferForm)
      return toast.success(`La transferencia ${transferCreated.code} fue creada con éxito`)
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

      {/* ----- Header ------*/}
      <React.Fragment>
        <Typography
          variant='h5'
          className={classes.title}
        >
          {texts.header.title}
        </Typography>
      </React.Fragment>

      <Divider
        className={classes.divider}
      />

      {/* ----- Body ------*/}
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={3}>

          {/* ----- Form: item **date ------*/}
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              required={true}
              name={texts.body.field.date.name}
              value={state.form.date}
              id='outlined-helperText'
              variant='outlined'
              fullWidth
              type='date'
              onChange={handleChange}
              helperText={texts.body.field.date.helperText}
            />
          </Grid>

          {/* ----- Form: item **code ------*/}
          <Grid item md={8} sm={6} xs={12}>
            <TextField
              required={true}
              name={texts.body.field.code.name}
              value={state.form.code}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.code.helperText}
              placeholder={texts.body.field.code.placeholder}
            />
          </Grid>

          {/* ----- Form: item **source account ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.sourceAccount.name}
              value={state.form.sourceAccount}
              variant="outlined"
              fullWidth
            >
              {
                state.accounts.map((account: Account) =>
                  <MenuItem
                    key={account.account}
                    value={account.account}
                    onClick={() => handleChangeSelect(texts.body.field.sourceAccount.name, account.account)}
                  >
                    {account.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.sourceAccount.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item **destination account ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.destinationAccount.name}
              value={state.form.destinationAccount}
              variant="outlined"
              fullWidth
            >
              {
                state.accountsDestination.map((account: Account) =>
                  <MenuItem
                    key={account.account}
                    value={account.account}
                    onClick={() => handleChangeSelect(texts.body.field.destinationAccount.name, account.account)}
                  >
                    {account.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.destinationAccount.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item **total ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              required={true}
              name={texts.body.field.total.name}
              value={state.form.total}
              fullWidth
              variant="outlined"
              type="number"
              onChange={handleChange}
              helperText={texts.body.field.total.helperText}
              placeholder={texts.body.field.total.placeholder}
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12} className={classes.alignRight}>
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
    </div>
  )
}
