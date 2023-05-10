import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
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
import EntityContext from '../../../contexts/Entity'
import { UserContextType } from '../../../schemas/User'
import { Third } from '../../../schemas/Third'
import ThirdService from '../../../services/Third'
import PlemsiService from '../../../services/Plemsi'
import Utils from '../../../utils'
import { EntityContextType } from '../../../schemas/Entity'

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
    description: 'Crear terceros'
  },
  body: {
    field: {
      organizationType: {
        name: 'organizationType',
        helperText: 'Escoja un tipo de persona',
        options: [
          { description: 'Jurídica', code: '1' },
          { description: 'Natural', code: '2' }
        ]
      },
      documentType: {
        name: 'documentType',
        helperText: 'Escoja el tipo de documento',
        options: {
          one: [
            { description: 'NIT', code: '6' }
          ],
          two: [
            { description: 'Registro civil', code: '1' },
            { description: 'Tarjeta de identidad', code: '2' },
            { description: 'Cédula de ciudadanía', code: '3' },
            { description: 'Cédula de extranjería', code: '5' },
            { description: 'Pasaporte', code: '7' },
            { description: 'Documento de identificación extranjero', code: '8' }
          ]
        }
      },
      liabilityType: {
        name: 'liabilityType',
        helperText: 'Escoja el tipo de responsabilidad',
        options: [
          { description: 'Gran contribuyente', code: '7' },
          { description: 'Autorretenedor', code: '9' },
          { description: 'Agente de retención en el impuesto sobre las ventas', code: '14' },
          { description: 'Régimen Simple de Tributación – SIMPLE', code: '112' },
          { description: 'No responsable', code: '117' }
        ]
      },
      regimeType: {
        name: 'regimeType',
        helperText: 'Escoja el tipo de régimen',
        options: [
          { description: 'Responsable de IVA', code: '1' },
          { description: 'No responsable de IVA', code: '2' }
        ]
      },
      document: {
        name: 'document',
        helperText: {
          main: 'Escriba el número de documento',
          error: 'El documento ingresado no tiene el formato correcto'
        },
        placeholder: 'Documento'
      },
      dv: {
        name: 'dv',
        helperText: 'DV',
        placeholder: 'DV'
      },
      name: {
        one: {
          name: {
            name: 'name',
            helperText: 'Escriba el primer nombre de la persona',
            placeholder: 'Nombre'
          },
          lastname: {
            name: 'lastname',
            helperText: 'Escriba el apellido de la persona',
            placeholder: 'Apellido(s)'
          }
        },
        two: {
          businessName: {
            name: 'businessName',
            helperText: 'Escriba el nombre de la empresa',
            placeholder: 'Razón social'
          }
        }
      },
      email: {
        name: 'email',
        helperText: {
          main: 'Escriba el email',
          error: 'El correo ingresado no tiene el formato correcto'
        },
        placeholder: 'Email'
      },
      phone: {
        name: 'phone',
        helperText: 'Escriba el número telefónico',
        placeholder: 'Número telefónico'
      },
      address: {
        name: 'address',
        helperText: 'Escriba la dirección',
        placeholder: 'Dirección'
      },
      city: {
        name: 'city',
        helperText: 'Ciudad o municipio'
      }
    }
  }
}

// ------------ Init state -----------
interface State {
  form: Third
  errorOnMail: boolean
  errorOnDocument: boolean
  cities: any[]
  loading: boolean
  isEdit: boolean
}

const initState: State = {
  form: {
    document: '',
    dv: undefined,
    documentType: {
      code: '',
      description: ''
    },
    organizationType: {
      code: '',
      description: ''
    },
    liabilityType: {
      code: '',
      description: ''
    },
    regimeType: {
      code: '',
      description: ''
    },
    name: undefined,
    lastname: undefined,
    businessName: undefined,
    phone: '',
    address: '',
    city: undefined,
    email: ''
  },
  errorOnMail: false,
  errorOnDocument: false,
  cities: [],
  loading: true,
  isEdit: false
}

export default function ThirdForm() {

  const classes = useStyles()
  const { search } = useLocation()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const { entityContext } = React.useContext(
    EntityContext
  ) as EntityContextType

  React.useEffect(() => {
    async function loadData() {
      const document = Utils.getDocumentFromUrl(search)

      const plemsiService = new PlemsiService()
      const cities = await plemsiService.getCities(entityContext.apiKeyPlemsi ?? '')

      if (document) {
        const thirdService = new ThirdService()
        const third = await thirdService.getThirdByDocument(userContext.token ?? '', document)
        if (third) {
          setState({
            ...state,
            form: third,
            cities,
            loading: false,
            isEdit: true
          })
        }
      } else {
        setState({
          ...state,
          cities,
          loading: false
        })
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
      form:{
        ...state.form,
        [name]: item
      }
    })
  }

  // HandleChange is the handler to update the state
  // of the state, while the user writes on an input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validaciones
    let errorOnDocument = state.errorOnDocument
    let errorOnMail = state.errorOnMail

    if (name === 'document') {
      const regex = /^[0-9]+$/
      errorOnDocument = !regex.test(value)
    }

    if (name === 'email') {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      errorOnMail = !regex.test(value)
    }

    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value,
      },
      errorOnMail: errorOnMail,
      errorOnDocument: errorOnDocument
    })
  }

  // HandleSubmit is the handler to verify and send
  // the state to redux (redux send the info to backend)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  
    // validaciones
    if (state.errorOnDocument) {
      return toast.error('Documento con formato incorrecto')
    }

    if (state.errorOnMail) {
      return toast.error('Mail con formato incorrecto')
    }

    try {
      const thirdService = new ThirdService()
      let thirdCreated: any = {}

      if (state.isEdit) {
        thirdCreated = await thirdService.updateThird(state.form, userContext.token ?? '')
      } else {
        thirdCreated = await thirdService.saveThird(state.form, userContext.token ?? '')
      }
      setState({
        ...initState,
        cities: state.cities,
        loading: false
      })
      return toast.success(`El tercero ${thirdCreated.document} fue creado con éxito`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
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

          {/* ----- Form: item thrid type ------*/}
          <Grid item md={state.form.organizationType.code === '2' ? 4 : 3} sm={6} xs={12}>
            <Select
              name={texts.body.field.organizationType.name}
              value={state.form.organizationType.code}
              variant="outlined"
              fullWidth
              disabled={state.isEdit}
            >
              {
                texts.body.field.organizationType.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.organizationType.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.organizationType.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item document type ------*/}
          <Grid item md={4} sm={6} xs={12}>
            <Select
              name={texts.body.field.documentType.name}
              value={state.form.documentType.code}
              variant="outlined"
              fullWidth
            >
              {
                // this will depend of organizationType field
                state.form.organizationType.code === texts.body.field.organizationType.options[0].code ?
                  texts.body.field.documentType.options.one.map((item) =>
                    <MenuItem
                      key={item.description}
                      value={item.code}
                      onClick={() => handleChangeSelect(texts.body.field.documentType.name, item)}
                    >
                      {item.description}
                    </MenuItem>
                  )
                  :
                  texts.body.field.documentType.options.two.map((item) =>
                    <MenuItem
                      key={item.description}
                      value={item.code}
                      onClick={() => handleChangeSelect(texts.body.field.documentType.name, item)}
                    >
                      {item.description}
                    </MenuItem>
                  )
              }
            </Select>
            <FormHelperText>{texts.body.field.documentType.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item document number ------*/}
          <Grid item md={4} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.document.name}
              value={state.form.document}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={state.errorOnDocument ? texts.body.field.document.helperText.error : texts.body.field.document.helperText.main}
              placeholder={texts.body.field.document.placeholder}
              disabled={state.isEdit}
              error={state.errorOnDocument}
            />
          </Grid>
          {
            /*
            In this section the name, secondName, lastName and businessName
            fields are conditioned to the organizationType field.
            If typeThird field is NATURAL then the name, secondName and lastName
            fields will be availabe while businessName field will be unavailable,
            else if typeThird field is JURIDICA then the businessName field will
            be available while the name, secondName and lastName fields will be
            unavailable
            */

            state.form.organizationType.code === '2'
              ?
              <React.Fragment>
                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                    required={true}
                    name={texts.body.field.name.one.name.name}
                    value={state.form.name ?? ''}
                    variant='outlined'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.body.field.name.one.name.helperText}
                    placeholder={texts.body.field.name.one.name.placeholder}
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                    required={true}
                    name={texts.body.field.name.one.lastname.name}
                    value={state.form.lastname ?? ''}
                    variant='outlined'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.body.field.name.one.lastname.helperText}
                    placeholder={texts.body.field.name.one.lastname.placeholder}
                  />
                </Grid>
              </React.Fragment>
              :
              <React.Fragment>
                {/* ----- Form: item document dv ------*/}
                <Grid item md={1} sm={3} xs={2}>
                  <TextField
                    required={true}
                    name={texts.body.field.dv.name}
                    value={state.form.dv ?? ''}
                    variant='outlined'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.body.field.dv.helperText}
                    placeholder={texts.body.field.dv.placeholder}
                  />
                </Grid>
                <Grid item md={12} sm={6} xs={12}>
                  <TextField
                    required={true}
                    name={texts.body.field.name.two.businessName.name}
                    value={state.form.businessName ?? ''}
                    variant='outlined'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.body.field.name.two.businessName.helperText}
                    placeholder={texts.body.field.name.two.businessName.placeholder}
                  />
                </Grid>
              </React.Fragment>
          }

          {/* ----- Form: item liability type ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.liabilityType.name}
              value={state.form.liabilityType.code}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.liabilityType.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.liabilityType.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.liabilityType.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item regime type ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.regimeType.name}
              value={state.form.regimeType.code}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.regimeType.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.regimeType.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.regimeType.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item email ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              name={texts.body.field.email.name}
              value={state.form.email}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={state.errorOnMail ? texts.body.field.email.helperText.error : texts.body.field.email.helperText.main}
              placeholder={texts.body.field.email.placeholder}
              error={state.errorOnMail}
            />
          </Grid>

          {/* ----- Form: item phone ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              name={texts.body.field.phone.name}
              value={state.form.phone}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.phone.helperText}
              placeholder={texts.body.field.phone.placeholder}
            />
          </Grid>

          {/* ----- Form: item address ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <TextField
              name={texts.body.field.address.name}
              value={state.form.address}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.address.helperText}
              placeholder={texts.body.field.address.placeholder}
            />
          </Grid>

          {/* ----- Form: City ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.city.name}
              value={state.form.city?.code ?? ''}
              variant="outlined"
              fullWidth
            >
              {
                state.cities.map((item) =>
                  <MenuItem
                    key={item.code}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.city.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.city.helperText}</FormHelperText>
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
