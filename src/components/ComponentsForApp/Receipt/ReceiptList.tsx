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
import { CloudDownload, Edit, Block } from '@material-ui/icons'
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import DataTable from '../DataTable/DataTable'
import { urls } from '../../../urls'
import permissions from '../../../permissions.json'
import ReceiptService from '../../../services/Receipt'
import ThirdsContext from '../../../contexts/Third'
import { ThirdsContextType } from '../../../schemas/Third'
import CancelModal from './CancelModal'

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
    description: 'Lista de recibos'
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
    width: 150,
    editable: false,
    renderCell: (params: any) => (
      <RenderCell params={params} field='code' />
    )
  },
  {
    field: 'status',
    headerName: 'Estado',
    hide: true
  },
  {
    field: 'date',
    headerName: 'Fecha',
    editable: false,
    width: 150,
    renderCell: (params: any) => (
      <RenderCell params={params} field='date' />
    )
  },
  {
    field: 'description',
    headerName: 'Detalle',
    editable: false,
    width: 300,
    renderCell: (params: any) => (
      <RenderCell params={params} field='description' />
    )
  },
  {
    field: 'thirdName',
    headerName: 'Tercero',
    editable: false,
    width: 250,
    renderCell: (params: any) => (
      <RenderCell params={params} field='thirdName' />
    )
  },
  {
    field: 'total',
    headerName: 'Total',
    editable: false,
    align: 'right',
    width: 200,
    renderCell: (params: any) => (
      <RenderCell params={params} field='total' />
    )
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
  receipts: any[]
  loading: boolean
}

const initState: State = {
  loadMoreButtonDisabled: false,
  receipts: [],
  loading: true
}

function RenderCell(props: any) {
  return (
    <div className={props.params.row.status === 'VALID' ? '' : 'cell-red'}>
      {props.params.row[props.field]}
    </div>
  )
}

function ActionButtons(props: any) {
  const navigate = useNavigate()
  const [editPermission, setEditPermission] = useState<boolean>(false)
  const [cancelPermission, setCancelPermission] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    const cancelAvailable = (userContext.permissions.some(permission => permission === permissions.receipt.cancel) && props.params.row.status === 'VALID')
    // The receipt needs are valid for edition
    setEditPermission(userContext.permissions.some(permission => permission === permissions.receipt.update) && props.params.row.status === 'VALID')
    setCancelPermission(cancelAvailable)
  }, [userContext, props])

  const onEdit = () => {
    navigate(`/${urls.app.index}/${urls.app.main.receipt.form}?code=${props.params.row.code ?? ''}`)
  }

  const handleModal = (show: boolean) => {
    setShowCancelModal(show)
  }

  const onDownload = () => {
    return window.open(`${urls.app.main.receipt.print}?code=${props.params.row.code ?? ''}`, '_blank')
  }

  return (
    <React.Fragment>
      <IconButton
        onClick={() => onEdit()}
        disabled={!editPermission}
      >
        <Edit fontSize={"small"} color={editPermission ? "primary" : "inherit"} />
      </IconButton>

      <IconButton
        onClick={() => handleModal(true)}
        disabled={!cancelPermission}
      >
        <Block fontSize={"small"} color={cancelPermission ? "error" : "inherit"} />
      </IconButton>

      <IconButton
        onClick={() => onDownload()}
      >
        <CloudDownload fontSize={"small"} color="action" />
      </IconButton>

      <CancelModal show={showCancelModal} code={props.params.row.code} handleModal={handleModal} />
    </React.Fragment>
  )
}

export default function ReceiptList() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const { thirdsContext } = React.useContext(
    ThirdsContext
  ) as ThirdsContextType


  React.useEffect(() => {
    async function loadData() {
      const receiptService = new ReceiptService()
      const response = await receiptService.getReceipts(userContext.token || '', { limit: 10 })
      setState({
        ...state,
        receipts: response.receipts.map(receipt => {
          const third = thirdsContext.find(third => third.document === receipt.thirdDocument)
          return {
            ...receipt,
            thirdName: third ? (third.name ? `${third.name} ${third.lastname}` : `${third.businessName}`) : 'NA'
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
      const receiptService = new ReceiptService()
      const response = await receiptService.getReceipts(userContext.token || '', { limit: 10, lastEvaluatedKey: state.lastEvaluatedKey })
      const receipts = response.receipts.map(receipt => {
        const third = thirdsContext.find(third => third.document === receipt.thirdDocument)
        return {
          ...receipt,
          thirdName: third ? (third.name ? `${third.name} ${third.lastname}` : `${third.businessName}`) : 'NA'
        }
      })

      setState({
        ...state,
        receipts: state.receipts.concat(receipts),
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
          <DataTable rows={state.receipts} columns={columns} keyId='code'/>
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
