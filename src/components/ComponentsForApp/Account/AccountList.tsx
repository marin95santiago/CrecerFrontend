import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Divider,
  Grid,
  IconButton,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@material-ui/core'
import { GridCellEditCommitParams, GridColDef } from '@material-ui/data-grid'
import { CloudDownload, Edit } from '@material-ui/icons'
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import DataTable from '../DataTable/DataTable'
import { urls } from '../../../urls'
import AccountService from '../../../services/Account'
import { Account } from '../../../schemas/Account'
import permissions from '../../../permissions.json'

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
  loadMoreButton: {
    width: '25%',
    height: '70%'
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
    description: 'Lista de cuentas'
  },
  body: {
    buttonLoadMore: {
      label: 'Cargar más ...'
    }
  }
}

const columns: GridColDef[] = [
  {
    field: 'account',
    headerName: 'Cuenta',
    flex: 1,
    editable: false,
  },
  {
    field: 'description',
    headerName: 'Descripción',
    editable: true,
    flex: 2
  },
  {
    field: 'balance',
    headerName: 'Saldo',
    editable: false,
    flex: 2
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    flex: 1,
    type: 'actions',
    renderCell: (params: any) => (
      <ActionButtons params={params} />
    )
  }
]

// ------------ Init state -----------
interface State {
  loadMoreButtonDisabled: boolean
  lastEvaluatedKey?: string
  accounts: Account[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  accounts: [],
  loading: true
}

function ActionButtons(props: any) {
  const [editPermission, setEditPermission] = useState<boolean>(false)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType
  const history = useHistory()

  const onEdit = () => {
    history.push(`${urls.app.main.account.form}?document=${props.params.row.account ?? ''}`)
  }

  React.useEffect(() => {
    setEditPermission(userContext.permissions.some(permission => permission === permissions.account.update))
  }, [userContext])

  return (
    <IconButton
      type="submit"
      onClick={() => onEdit()}
      disabled={!editPermission}
    >
      <Edit fontSize={"small"} color={editPermission ? "primary" : "inherit"} />
    </IconButton>
  )
}

export default function AccountList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const accountService = new AccountService()
      const response = await accountService.getAccounts(userContext.token || '', { limit: 5 })
      setState({
        ...state,
        accounts: response.accounts,
        lastEvaluatedKey: response.lastEvaluatedKey,
        loadMoreButtonDisabled: response.lastEvaluatedKey !== undefined ? false : true,
        loading: false
      })
    }
    loadData()
  }, [])

  const onLoadMore = async () => {
    try {
      const accountService = new AccountService()
      const response = await accountService.getAccounts(userContext.token || '', { limit: 5, lastEvaluatedKey: state.lastEvaluatedKey })
      setState({
        ...state,
        accounts: state.accounts.concat(response.accounts),
        lastEvaluatedKey: response.lastEvaluatedKey,
        loadMoreButtonDisabled: response.lastEvaluatedKey !== undefined ? false : true
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      }
    }
  }

  const gridEdit = async (params: GridCellEditCommitParams) => {

    let accountToEdit: any = {}

    const selectedAccount = state.accounts.find(account => account.account === params.id)
    if (selectedAccount !== undefined) {
      accountToEdit = {
        ...selectedAccount,
        [params.field]: params.value
      }
    } else {
      return
    }

    try {
      const accountService = new AccountService()
      const accountUpdated = await accountService.updateAccount(accountToEdit, userContext.token ?? '')

      return toast.success(`La cuenta ${accountUpdated.account} fue editada con éxito`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      }
    }
  }

  return (
    <div className={classes.root}>

      {/* ----- Header ------*/}
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
      <Grid container spacing={3}>

        {/* ----- Form: item thrid type ------*/}
        <Grid item md={12} sm={12} xs={12}>
          <DataTable rows={state.accounts} columns={columns} keyId='account' gridEdit={gridEdit} />
        </Grid>

        <Grid item md={12} sm={6} xs={12} className={classes.alignRight}>
          <Button
            type="button"
            color="primary"
            size="small"
            className={classes.loadMoreButton}
            startIcon={<CloudDownload />}
            disabled={state.loadMoreButtonDisabled}
            onClick={() => onLoadMore()}
          >
            {texts.body.buttonLoadMore.label}
          </Button>
        </Grid>
      </Grid>
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
