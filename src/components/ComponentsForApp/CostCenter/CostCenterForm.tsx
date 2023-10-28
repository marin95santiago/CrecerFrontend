import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box,
  CircularProgress,
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
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import { useHistory, useLocation } from 'react-router-dom'
import { urls } from '../../../urls'
import Utils from '../../../utils'
import CostCenterService from '../../../services/CostCenter'
import { CostCenter } from '../../../schemas/CostCenter'

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
    description: 'Crear centro de costo'
  },
  body: {
    field: {
      code: {
        name: 'code',
        helperText: 'Código',
        placeholder: 'Código de centro de costo'
      },
      description: {
        name: 'description',
        helperText: 'Escriba la descripción del centro de costo',
        placeholder: 'Nombre de centro de costo'
      },
      type: {
        name: 'type',
        helperText: 'Tipo de centro de costo',
        options: [
          { description: 'Concepto', code: 'CONCEPT' },
          { description: 'Forma de pago', code: 'PAY' },
        ]
      }
    }
  }
}

// ------------ Init state -----------
interface State {
  form: CostCenter,
  isEdit: boolean
  loading: boolean
}

const initState: State = {
  form: {
    code: '',
    description: '',
    type: {
      code: '',
      description: ''
    }
  },
  isEdit: false,
  loading: false
}

export default function CostCenterForm() {

  const classes = useStyles()
  const { search } = useLocation()
  const history = useHistory()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const code = Utils.getIdFromUrl(search)

      if (code) {
        setState({
          ...state,
          loading: true
        })
        const costCenterService = new CostCenterService()
        const costCenter = await costCenterService.getCostCenterByCode(userContext.token ?? '', code)
        if (costCenter) {
          setState({
            ...state,
            form: costCenter,
            loading: false,
            isEdit: true
          })
        }
      }
    }
    loadData()
  }, [])

  // HandleChange is the handler to update the state
  // of the state, while the user change the options 
  // on an input select.
  const handleChangeSelect = (name: string, item: { code: string, description: string }) => {
    setState({
      ...state,
      form: {
        ...state.form,
        [name]: item
      }
    })
  }

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

  // HandleSubmit is the handler to verify and send
  // the state to redux (redux send the info to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const costCenterService = new CostCenterService()
      let costCenterCreated

      if (state.isEdit) {
        costCenterCreated = await costCenterService.updateCostCenter(state.form, userContext.token ?? '')
      } else {
        costCenterCreated = await costCenterService.saveCostCenter(state.form, userContext.token ?? '')
      }

      setState(initState)
      history.push(urls.app.main.concept.form)
      return toast.success(`El centro de costo ${costCenterCreated.code} fue ${state.isEdit ? 'actualizado' : 'creado'} con éxito`)
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
              name={texts.body.field.code.name}
              value={state.form.code}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.code.helperText}
              placeholder={texts.body.field.code.placeholder}
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

          {/* ----- Form: type ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.type.name}
              value={state.form.type?.code ?? ''}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.type.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.type.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.type.helperText}</FormHelperText>
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
