/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import ItemService from '../../../services/Item'
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
    description: 'Lista de productos'
  },
  body: {
    buttonLoadMore: {
      label: 'Cargar más ...'
    }
  }
}

const columns: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Código',
    flex: 1,
    editable: false,
  },
  {
    field: 'description',
    headerName: 'Producto',
    editable: true,
    flex: 2
  },
  {
    field: 'price',
    headerName: 'Precio',
    editable: true,
    flex: 1
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

const columnsAdmin: GridColDef[] = [
  {
    field: 'code',
    headerName: 'Código',
    flex: 1,
    editable: false,
  },
  {
    field: 'description',
    headerName: 'Producto',
    editable: true,
    flex: 2
  },
  {
    field: 'account',
    headerName: 'Cuenta contable',
    editable: true,
    flex: 1
  },
  {
    field: 'price',
    headerName: 'Precio',
    editable: true,
    flex: 1
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
  items: any[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  items: [],
  loading: true
}

function ActionButtons(props: any) {
  const navigate = useNavigate()
  const [editPermission, setEditPermission] = useState<boolean>(false)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType
  
  const onEdit = () => {
    navigate(`/${urls.app.index}/${urls.app.main.item.form}?document=${props.params.row.code ?? ''}`)
  }

  React.useEffect(() => {
    setEditPermission(userContext.permissions.some(permission => permission === permissions.item.update))
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

export default function ItemList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const itemService = new ItemService()
      const response = await itemService.getItems(userContext.token || '', { limit: 10 })
      setState({
        ...state,
        items: response.items,
        lastEvaluatedKey: response.lastEvaluatedKey,
        loadMoreButtonDisabled: response.lastEvaluatedKey !== undefined ? false : true,
        loading: false
      })
    }
    loadData()
  }, [])

  const onLoadMore = async () => {
    try {
      const itemService = new ItemService()
      const response = await itemService.getItems(userContext.token || '', { limit: 10, lastEvaluatedKey: state.lastEvaluatedKey })
      setState({
        ...state,
        items: state.items.concat(response.items),
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
    try {
      // validations
      if (params.field === "account" && params.value && params.value.toString().length !== Number(process.env.REACT_APP_MAX_LENGTH_CONTABLE_ACCOUNT)) {
        throw new Error(`El número de cuenta contable debe ser de ${process.env.REACT_APP_MAX_LENGTH_CONTABLE_ACCOUNT} dígitos`)
      }
      let itemToEdit: any = {}

      const selectedItem = state.items.find(item => item.code === params.id)

      if (selectedItem !== undefined) {
        itemToEdit = {
          ...selectedItem,
          [params.field]: params.value
        }
      } else {
        return
      }

      const itemService = new ItemService()
      const itemUpdated = await itemService.updateItem(itemToEdit, userContext.token ?? '')

      return toast.success(`El producto ${itemUpdated.code} fue editado con éxito`)
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
          <DataTable rows={state.items} columns={ userContext.permissions.some(p => p === permissions.super_admin) ? columnsAdmin : columns} keyId='code' gridEdit={gridEdit} />
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
