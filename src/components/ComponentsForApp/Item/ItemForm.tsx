import React, { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import { makeStyles, Theme } from '@material-ui/core/styles'
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
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import { Item } from '../../../schemas/Item'
import ItemService from '../../../services/Item'

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
  }
}))

// - in this part all the component texts are housed
const texts = {
  header: {
    description: 'Crear productos'
  },
  body: {
    field: {
      code: {
        name: 'code',
        helperText: 'Escriba el código del producto',
        placeholder: 'Código'
      },
      description: {
        name: 'description',
        helperText: 'Escriba la descripción del producto',
        placeholder: 'Nombre de producto'
      },
      price: {
        name: 'price',
        helperText: 'Escriba el precio en pesos colombianos sin decimales',
        placeholder: 'Precio'
      },
      unitMeasure: {
        name: 'unitMeasure',
        helperText: 'Escoja una unidad de medida',
        options: [
          { description: 'Unidad', code: '70' },
          { description: 'Kilogramo', code: '40' },
          { description: 'Galón', code: '686' },
          { description: 'Metro cúbico', code: '594' },
          { description: 'Metro cuadrado', code: '472' },
        ]
      },
      itemType: {
        name: 'itemType',
        helperText: 'Tipo de producto',
        options: [
          { description: 'UNSPSC', code: '1' },
          { description: 'GTIN', code: '2' },
          { description: 'Partida Arancelarias', code: '3' },
          { description: 'Estándar de adopción del contribuyente', code: '4' }
        ]
      }
    }
  }
}

// ------------ Init state -----------
interface State {
  form: Item
}

const initState: State = {
  form: {
    code: '',
    description: '',
    price: undefined,
    unitMeasure: undefined,
    itemType: undefined
  }
}

export default function ItemForm() {

  const classes = useStyles()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

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
    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value
      }
    })
  }

  // HandleSubmit is the handler to verify and send
  // the state to redux (redux send the info to backend)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const itemService = new ItemService()
      const itemCreated = await itemService.saveItem(state.form, userContext.token ?? '')
      setState(initState)
      return toast.success(`El producto ${itemCreated.code} fue creado con éxito`)
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

          {/* ----- Form: code ------*/}
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

          {/* ----- Form: price ------*/}
          <Grid item md={6} sm={6} xs={10}>
            <TextField
              name={texts.body.field.price.name}
              value={state.form.price}
              type='number'
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.price.helperText}
              placeholder={texts.body.field.price.placeholder}
            />
          </Grid>

          {/* ----- Form: unit measure ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.unitMeasure.name}
              value={state.form.unitMeasure?.code}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.unitMeasure.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.unitMeasure.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.unitMeasure.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item type ------*/}
          <Grid item md={6} sm={6} xs={12}>
            <Select
              name={texts.body.field.itemType.name}
              value={state.form.itemType?.code}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.itemType.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.itemType.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.itemType.helperText}</FormHelperText>
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
    </div>
  )
}
