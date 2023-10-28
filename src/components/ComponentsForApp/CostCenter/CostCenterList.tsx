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
import CostCenterService from '../../../services/CostCenter'
import { CostCenter } from '../../../schemas/CostCenter'
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
    description: 'Lista de centros de costos'
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
    headerName: 'Centro de costo',
    editable: true,
    flex: 2
  },
  {
    field: 'typeDescription',
    headerName: 'Tipo',
    editable: false,
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
  costCenters: any[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  costCenters: [],
  loading: true
}

function ActionButtons(props: any) {
  const [editPermission, setEditPermission] = useState<boolean>(false)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType
  const history = useHistory()

  const onEdit = () => {
    history.push(`${urls.app.main.costCenter.form}?code=${props.params.row.code ?? ''}`)
  }

  React.useEffect(() => {
    setEditPermission(userContext.permissions.some(permission => permission === permissions.cost_center.update))
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

export default function CostCenterList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const costCenterService = new CostCenterService()
      const response = await costCenterService.getCostCenters(userContext.token || '', { limit: 5 })
      const responseParsed = response.costCenters.map((costCenter: CostCenter) => {
        return {
          ...costCenter,
          typeDescription: costCenter.type.description
        }
      })
      setState({
        ...state,
        costCenters: responseParsed,
        lastEvaluatedKey: response.lastEvaluatedKey,
        loadMoreButtonDisabled: response.lastEvaluatedKey !== undefined ? false : true,
        loading: false
      })
    }
    loadData()
  }, [])

  const onLoadMore = async () => {
    try {
      const costCenterService = new CostCenterService()
      const response = await costCenterService.getCostCenters(userContext.token || '', { limit: 5, lastEvaluatedKey: state.lastEvaluatedKey })
      const responseParsed = response.costCenters.map((costCenter: CostCenter) => {
        return {
          ...costCenter,
          typeDescription: costCenter.type.description
        }
      })
      setState({
        ...state,
        costCenters: state.costCenters.concat(responseParsed),
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

    let costCenterToEdit: any = {}

    const selectedCostCenter = state.costCenters.find(costCenter => costCenter.code === params.id)
    if (selectedCostCenter !== undefined) {
      costCenterToEdit = {
        ...selectedCostCenter,
        [params.field]: params.value
      }
    } else {
      return
    }

    try {
      const costCenterService = new CostCenterService()
      const costCenterUpdated = await costCenterService.updateCostCenter(costCenterToEdit, userContext.token ?? '')

      return toast.success(`El centro de costo ${costCenterUpdated.code} fue editado con éxito`)
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
          <DataTable rows={state.costCenters} columns={columns} keyId='code' gridEdit={gridEdit} />
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
