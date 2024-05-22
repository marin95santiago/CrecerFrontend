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
import { GridColDef } from '@material-ui/data-grid'
import { CloudDownload, Delete, Visibility } from '@material-ui/icons'
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import DataTable from '../DataTable/DataTable'
import { urls } from '../../../urls'
import ElectronicBillService from '../../../services/ElectronicBill'

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
    description: 'Lista de programaciones'
  },
  body: {
    buttonLoadMore: {
      label: 'Cargar más ...'
    }
  }
}

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nombre',
    width: 400,
    editable: false,
  },
  {
    field: 'idForm',
    headerName: 'Factura base',
    width: 200,
    editable: false,
  },
  {
    field: 'startDate',
    headerName: 'Inicio',
    editable: false,
    width: 150,
  },
  {
    field: 'endDate',
    headerName: 'Fin',
    editable: false,
    width: 150,
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
  schedules: any[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  schedules: [],
  loading: true
}

function ActionButtons(props: any) {
  const navigate = useNavigate()
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const onView = () => {
    navigate(`/${urls.app.index}/${urls.app.main.electronicBill.form}?number=${props.params.row.idForm ?? ''}`)
  }

  const onDelete = async () => {
    try {
      const electronicBillService= new ElectronicBillService()
      await electronicBillService.deleteSchedule(userContext.token ?? '', props.params.row.code)
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
    <React.Fragment>
      <form onSubmit={() => onDelete()}>
        <IconButton
          onClick={() => onView()}
        >
          <Visibility fontSize={"small"} color="primary" />
        </IconButton>
    
        <IconButton
          type="submit"
        >
          <Delete fontSize={"small"} color="error" />
        </IconButton>
      </form>
    </React.Fragment>
  )
}

export default function ScheduledBillList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const electronicBillService= new ElectronicBillService()
      const response = await electronicBillService.getSchedules(userContext.token || '', { limit: 10 })
      setState({
        ...state,
        schedules: response.schedules,
        lastEvaluatedKey: response.lastEvaluatedKey,
        loadMoreButtonDisabled: response.lastEvaluatedKey !== undefined ? false : true,
        loading: false
      })
    }
    loadData()
  }, [])

  const onLoadMore = async () => {
    try {
      const electronicBillService= new ElectronicBillService()
      const response = await electronicBillService.getSchedules(userContext.token || '', { limit: 10, lastEvaluatedKey: state.lastEvaluatedKey })
      const newSchedules = response.schedules
      setState({
        ...state,
        schedules: state.schedules.concat(newSchedules),
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
          <DataTable rows={state.schedules} columns={columns} keyId='code' />
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
