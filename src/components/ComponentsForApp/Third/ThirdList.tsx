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
import { GridCellEditCommitParams, GridColDef, GridValueGetterParams } from '@material-ui/data-grid'
import { CloudDownload, Edit } from '@material-ui/icons'
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import { Third } from '../../../schemas/Third'
import ThirdService from '../../../services/Third'
import DataTable from '../DataTable/DataTable'
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
    description: 'Lista de terceros'
  },
  body: {
    buttonLoadMore: {
      label: 'Cargar más ...'
    }
  }
}

const columns: GridColDef[] = [
  {
    field: 'document',
    headerName: 'Documento',
    width: 250,
    editable: false,
  },
  {
    field: 'fullName',
    headerName: 'Nombre',
    editable: false,
    width: 350,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.getValue(params.id, 'name') || params.getValue(params.id, 'businessName')} ${params.getValue(params.id, 'lastname') || ''
      }`,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 350,
    editable: true,
  },
  {
    field: 'phone',
    headerName: 'Teléfono',
    width: 250,
    editable: true,
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
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
  thirds: Third[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  thirds: [],
  loading: true
}

function ActionButtons(props: any) {

  const history = useHistory()

  const onEdit = () => {
    history.push(`${urls.app.main.third.form}?document=${props.params.row.document ?? ''}`)
  }

  return (
    <IconButton
      type="submit"
      onClick={() => onEdit()}
    >
      <Edit fontSize={"small"} color="primary" />
    </IconButton>
  )
}

export default function ThirdList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const thirdService = new ThirdService()
      const response = await thirdService.getThirds(userContext.token || '', { limit: 5 })
      setState({
        ...state,
        thirds: response.thirds,
        lastEvaluatedKey: response.lastEvaluatedKey,
        loadMoreButtonDisabled: response.lastEvaluatedKey !== undefined ? false : true,
        loading: false
      })
    }
    loadData()
  }, [])

  const onLoadMore = async () => {
    try {
      const thirdService = new ThirdService()
      const response = await thirdService.getThirds(userContext.token || '', { limit: 5, lastEvaluatedKey: state.lastEvaluatedKey })
      setState({
        ...state,
        thirds: state.thirds.concat(response.thirds),
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

    let thirdToEdit: any = {}

    const selectedThird = state.thirds.find(third => third.document === params.id)
    if (selectedThird !== undefined) {
      thirdToEdit = {
        ...selectedThird,
        [params.field]: params.value
      }
    } else {
      return
    }

    try {
      const thirdService = new ThirdService()
      const thirdUpdated = await thirdService.updateThird(thirdToEdit, userContext.token ?? '')

      return toast.success(`El tercero ${thirdUpdated.document} fue creado con éxito`)
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
          <DataTable rows={state.thirds} columns={columns} keyId='document' gridEdit={gridEdit} />
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
