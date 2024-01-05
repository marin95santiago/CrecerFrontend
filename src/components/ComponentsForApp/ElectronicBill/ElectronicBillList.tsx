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
import { GridColDef } from '@material-ui/data-grid'
import { CloudDownload, Visibility, PostAdd } from '@material-ui/icons'
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
    description: 'Lista de facturas emitidas'
  },
  body: {
    buttonLoadMore: {
      label: 'Cargar más ...'
    }
  }
}

const columns: GridColDef[] = [
  {
    field: 'number',
    headerName: 'Factura',
    width: 150,
    editable: false,
  },
  {
    field: 'date',
    headerName: 'Fecha',
    width: 200,
    editable: false,
  },
  {
    field: 'third',
    headerName: 'Nombre',
    editable: false,
    width: 350,
  },
  {
    field: 'note',
    headerName: 'Descripción',
    editable: false,
    width: 400,
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
  electronicBills: any[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  electronicBills: [],
  loading: true
}

function ActionButtons(props: any) {

  const history = useHistory()

  const onView = () => {
    history.push(`${urls.app.main.electronicBill.form}?number=${props.params.row.number ?? ''}`)
  }

  const onCopy = () => {
    history.push(`${urls.app.main.electronicBill.form}?number=${props.params.row.number ?? ''}&copy=true`)
  }

  const onDownload = () => {
    if (props.params.row.preview !== undefined) {
      return window.open(props.params.row.preview, '_blank')
    } else {
      return toast.warn('Factura disponible ingresando a la visualización')
    }
  }

  return (
    <React.Fragment>
      <IconButton
        type="submit"
        onClick={() => onView()}
      >
        <Visibility fontSize={"small"} color="primary" />
      </IconButton>

      <IconButton
        type="submit"
        onClick={() => onCopy()}
      >
        <PostAdd fontSize={"small"} color="action" />
      </IconButton>

      <IconButton
        type="submit"
        onClick={() => onDownload()}
      >
        <CloudDownload fontSize={"small"} color="action" />
      </IconButton>
    </React.Fragment>
  )
}

export default function ElectronicBillList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const electronicBillService= new ElectronicBillService()
      const response = await electronicBillService.getElectronicBills(userContext.token || '', { limit: 10 })
      setState({
        ...state,
        electronicBills: response.electronicBills.map((bill: any) =>{
          return {
            ...bill,
            third: bill.third.businessName !== undefined ? `${bill.third.businessName}` : `${bill.third.name} ${bill.third.lastname}`
          }
        }),
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
      const response = await electronicBillService.getElectronicBills(userContext.token || '', { limit: 10, lastEvaluatedKey: state.lastEvaluatedKey })
      const newBills = response.electronicBills.map((bill: any) =>{
        return {
          ...bill,
          third: bill.third.businessName !== undefined ? `${bill.third.businessName}` : `${bill.third.name} ${bill.third.lastname}`
        }
      })
      setState({
        ...state,
        electronicBills: state.electronicBills.concat(newBills),
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
          <DataTable rows={state.electronicBills} columns={columns} keyId='number' />
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
