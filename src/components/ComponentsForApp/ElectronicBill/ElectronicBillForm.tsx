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
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  LinearProgress,
  CircularProgress
} from '@material-ui/core'
import { Cancel, NoteAdd, Save } from '@material-ui/icons'
import { ServerError } from '../../../schemas/Error'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import { ElectronicBillFormSchema } from '../../../schemas/ElectronicBill'
import ElectronicBillService from '../../../services/ElectronicBill'
import Utils from '../../../utils'
import ItemTable from './ItemTable'
import ThirdService from '../../../services/Third'
import electronicBillMapper from '../../../mappers/ElectronicBill/electronicBill.mapper'
import ItemService from '../../../services/Item'
import PlemsiService from '../../../services/Plemsi'
import { Link } from 'react-router-dom'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '10vh auto 10vh auto',
    height: 'auto'
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
  addButton: {
    width: '100%',
    height: '70%',
    color: '#ffff',
  }
}))

// - in this part all the component texts are housed
const texts = {
  header: {
    description: 'Facturación electrónica'
  },
  body: {
    field: {
      date: {
        name: 'date',
        helperText: 'Fecha de facturación',
        placeholder: 'Fecha'
      },
      orderReference: {
        name: 'orderReference',
        helperText: 'Escriba la referencia de orden',
        placeholder: 'Código de orden'
      },
      third: {
        name: 'third',
        helperText: 'Escoja el tercero',
        placeholder: 'Tercero'
      },
      wayToPay: {
        name: 'wayToPay',
        helperText: 'Escoja una forma de pago',
        options: [
          { description: 'Contado', code: '1' },
          { description: 'Crédito', code: '2' },
        ]
      },
      paymentMethod: {
        name: 'paymentMethod',
        helperText: 'Escoja una forma de pago',
        options: [
          { description: 'Cheque', code: '20' },
          { description: 'Consignación bancaria', code: '42' },
          { description: 'Efectivo', code: '10' },
          { description: 'Instrumento no definido', code: '1' },
          { description: 'Pago y depósito pre acordado (PPD)', code: '34' },
          { description: 'Tarjeta Crédito', code: '48' },
          { description: 'Tarjeta Débito', code: '49' },
        ]
      },
      paymentDueDate: {
        name: 'paymentDueDate',
        helperText: 'Fecha de pago',
        placeholder: 'AAAA/MM/DD'
      },
      note: {
        name: 'note',
        helperText: 'Nota para la factura',
        placeholder: 'Nota para la factura'
      },
      item: {
        name: 'currentItem',
        helperText: 'Escoja el producto a facturar',
        options: [
          {
            unitMeasure: { code: 12, description: 'Unidad'},
            description: 'Producto de prueba',
            code: '1',
            price: 2500
          }
        ]
      },
      itemType: {
        name: 'currentItemType',
        helperText: 'Tipo de producto',
        options: [
          { description: 'UNSPSC', code: '1' },
          { description: 'GTIN', code: '2' },
          { description: 'Partida Arancelarias', code: '3' },
          { description: 'Estándar de adopción del contribuyente', code: '4' }
        ]
      },
      price: {
        name: 'currentPrice',
        helperText: 'Precio sin impuestos',
        placeholder: 'Precio'
      },
      quantity: {
        name: 'currentQuantity',
        helperText: 'Cantiadad',
        placeholder: 'Cantidad'
      },
      applyTaxes: {
        name: 'applyTaxes',
        helperText: 'Aplicar impuestos'
      },
      tax: {
        name: 'selectedTax',
        helperText: 'Escoja el impuesto',
        options: [
          { code: '1', description: 'IVA' },
          { code: '4', description: 'Impuesto al consumo' }
        ]
      },
      percent: {
        name: 'currentPercentTax',
        helperText: 'Porcentaje',
        placeholder: '%',
        options: [
          { code: 0, description: '0%' },
          { code: 5, description: '5%' },
          { code: 8, description: '8%' },
          { code: 19, description: '19%' },
        ]
      },
      total: {
        name: 'total',
        helperText: 'Total sin impuestos',
        placeholder: 'Total sin impuestos'
      },
      totalTaxes: {
        name: 'totalTaxes',
        helperText: 'Total de impuestos',
        placeholder: 'Total de impuestos'
      },
      totalToPay: {
        name: 'totalToPay',
        helperText: 'Total final',
        placeholder: 'Total'
      }
    },
    subtitles: {
      payment: 'Información acerca del pago',
      itemsTable: 'Tabla de productos a facturar',
      total: 'Información acerca de los totales de la factura'
    },
    buttons: {
      addProduct: {
        title: 'Agregar'
      }
    }
  }
}

// ------------ Init state -----------
interface State {
  form: ElectronicBillFormSchema
  applyTaxes: boolean
  items: any[]
  selectedItems: any[]
  thirds: any[]
  preview?: string
  loading: boolean
}

const initState: State = {
  form: {
    date: '',
    orderReference: '',
    third: undefined,
    wayToPay: { code: '', description: '' },
    paymentMethod: { code: '', description: '' },
    paymentDueDate: '',
    note: '',
    currentItem: undefined,
    currentItemType: {
      code: '',
      description: ''
    },
    currentPrice: 0,
    currentQuantity: 0,
    total: 0,
    totalTaxes: 0,
    totalToPay: 0,
    selectedTax: { code: '', description: ''},
    currentPercentTax: 0
  },
  applyTaxes: false,
  items: [],
  selectedItems: [],
  thirds: [],
  preview: undefined,
  loading: false
}

export default function ElectronicBillForm() {

  const classes = useStyles()

  const [state, setState] = useState(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  React.useEffect(() => {
    async function loadData() {
      const thirdService = new ThirdService()
      const itemService = new ItemService()
      const thirds = await thirdService.getThirds(userContext.token || '')
      const items = await itemService.getItems(userContext.token || '')
      setState({
        ...state,
        thirds: thirds,
        items: items
      })
    }
    loadData()
  }, [])

  const handleChangeSelectValue = (name: string, value: string | number) => {
    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value
      }
    })
  }

  // HandleChangeSelect is the handler to update the state
  // of the state, while the user change the options 
  // on an input select.
  const handleChangeSelect = (name: string, item: { code: string, description: string, price?: number, itemType?: any }) => {
    console.log(item)
    if (item.price && item.itemType) {
      setState({
        ...state,
        form: {
          ...state.form,
          [name]: item,
          currentPrice: item.price,
          currentItemType: {
            code: item.itemType.code,
            description: item.itemType.description
          }
        }
      })
    } else {
      setState({
        ...state,
        form: {
          ...state.form,
          [name]: item
        }
      })
    }
  }

  // HandleChange is the handler to update the state
  // of the state, while the user writes on an input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | {
    name: string
    value: unknown
  }>) => {
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
    setState({
      ...state,
      loading: true
    })
    try {
      const res = electronicBillMapper(state.form, state.selectedItems)
      const electronicBillService = new ElectronicBillService()
      const plemsiService = new PlemsiService()
      const bill = await electronicBillService.saveBill(res, userContext.token ?? '')
      const billPlemsi = await plemsiService.getBill(bill.entityInformation.apikey, bill.entityInformation.number)
      console.log(billPlemsi)
      setState({
        ...initState,
        preview: billPlemsi,
        loading: false
      })
      return toast.success(`Factura creada con éxito`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<ServerError>
        if (serverError && serverError.response) {
          return toast.error(serverError.response.data.message)
        }
      }
    }
  }

  // HandleTable is the handler to add and remove items
  // from the concept table, it also adds or subtracts 
  // the value of the total receipt.
  const handleTable = (func: string, selectedItem?: any) => {
    if (func === 'ADD') {
      const item = Utils.buildItem(state.form, state.applyTaxes)
      const total = (state.form.total + item.total)
      const totalTaxes = (state.form.totalTaxes + item.taxes[0].taxAmount)
      const totalToPay = total + totalTaxes
      const items = state.selectedItems
      items.push(item)
      setState({
        ...state,
        form: {
          ...state.form,
          total: total,
          totalTaxes: totalTaxes,
          totalToPay: totalToPay,
          currentItemType: {
            code: '',
            description: ''
          },
          currentPrice: 0,
          currentQuantity: 0,
          selectedTax: { code: '', description: ''},
          currentPercentTax: 0
        },
        applyTaxes: false,
        selectedItems: items
      })
    }

    if (func === 'REMOVE') {
      const total = (state.form.total - selectedItem.total)
      const totalTaxes = (state.form.totalTaxes - selectedItem.taxes[0].taxAmount)
      const totalToPay = total + totalTaxes
      const items = state.selectedItems.filter(item => item.code !== selectedItem.code)
      setState({
        ...state,
        form: {
          ...state.form,
          total: total,
          totalTaxes: totalTaxes,
          totalToPay: totalToPay,
        },
        selectedItems: items
      })
    }
  }

  const onApplyTaxes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setState({
      ...state,
      applyTaxes: checked
    })
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

          {/* ----- Form: date ------*/}
          <Grid item md={6} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.date.name}
              value={state.form.date}
              variant='outlined'
              type='date'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.date.helperText}
              placeholder={texts.body.field.date.placeholder}
            />
          </Grid>

          {/* ----- Form: order reference ------*/}
          <Grid item md={6} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.orderReference.name}
              value={state.form.orderReference}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.orderReference.helperText}
              placeholder={texts.body.field.orderReference.placeholder}
            />
          </Grid>

          {/* ----- Form: third ------*/}
          <Grid item md={12} sm={12} xs={12}>
            <Select
              name={texts.body.field.third.name}
              value={state.form.third?.document}
              variant="outlined"
              fullWidth
            >
              {
                state.thirds.map((item) =>
                  <MenuItem
                    key={item.document}
                    value={item.document}
                    onClick={() => handleChangeSelect(texts.body.field.third.name, item)}
                  >
                    { item.name !== undefined ? `${item.name} ${item.lastname}` : `${item.businessName}`}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.third.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: payment ------*/}

          <Grid item md={4} sm={6} xs={12}>
            <Select
              name={texts.body.field.wayToPay.name}
              value={state.form.wayToPay.code}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.wayToPay.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.wayToPay.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.wayToPay.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: payment method ------*/}
          <Grid item md={4} sm={6} xs={12}>
            <Select
              name={texts.body.field.paymentMethod.name}
              value={state.form.paymentMethod.code}
              variant="outlined"
              fullWidth
            >
              {
                texts.body.field.paymentMethod.options.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.paymentMethod.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.paymentMethod.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: payment due date ------*/}
          <Grid item md={4} sm={6} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.paymentDueDate.name}
              value={state.form.paymentDueDate}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.paymentDueDate.helperText}
              placeholder={texts.body.field.paymentDueDate.placeholder}
            />
          </Grid>

          {/* ----- Form: note ------*/}

          <Grid item md={12} sm={12} xs={12}>
            <TextField
              required={true}
              name={texts.body.field.note.name}
              value={state.form.note}
              variant='outlined'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.note.helperText}
              placeholder={texts.body.field.note.placeholder}
            />
          </Grid>

          {/* ----- Form: item ------*/}

          <Grid item md={12} sm={12} xs={12}>
            <Typography
              variant='h6'
            >
              {texts.body.subtitles.itemsTable}
            </Typography>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item md={8} sm={12} xs={12}>
            <Select
              name={texts.body.field.item.name}
              value={state.form.currentItem?.code}
              variant="outlined"
              fullWidth
            >
              {
                state.items.map((item) =>
                  <MenuItem
                    key={item.description}
                    value={item.code}
                    onClick={() => handleChangeSelect(texts.body.field.item.name, item)}
                  >
                    {item.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.item.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item type ------*/}
          <Grid item md={4} sm={6} xs={12}>
            <Select
              name={texts.body.field.itemType.name}
              value={state.form.currentItemType.code}
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

          {/* ----- Form: price ------*/}
          <Grid item md={8} sm={3} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.price.name}
              value={state.form.currentPrice}
              variant='outlined'
              type='number'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.price.helperText}
              placeholder={texts.body.field.price.placeholder}
            />
          </Grid>

          {/* ----- Form: quantity ------*/}
          <Grid item md={4} sm={3} xs={10}>
            <TextField
              required={true}
              name={texts.body.field.quantity.name}
              value={state.form.currentQuantity}
              variant='outlined'
              type='number'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.quantity.helperText}
              placeholder={texts.body.field.quantity.placeholder}
            />
          </Grid>

          <Grid item md={9} sm={6} xs={6}>
            {/* ----- apply taxes check ------*/}
            <FormControlLabel
              control={<Checkbox name={texts.body.field.applyTaxes.name} value={state.applyTaxes} onChange={(e) => onApplyTaxes(e)} color="primary" />}
              label={texts.body.field.applyTaxes.helperText}
            />
          </Grid>

          {
            state.applyTaxes ?
              (
                <React.Fragment>
                  <Grid item md={6} sm={12} xs={12}>
                    <Select
                      name={texts.body.field.tax.name}
                      value={state.form.selectedTax.code}
                      variant="outlined"
                      fullWidth
                    >
                      {
                        texts.body.field.tax.options.map((item) =>
                          <MenuItem
                            key={item.description}
                            value={item.code}
                            onClick={() => handleChangeSelect(texts.body.field.tax.name, item)}
                          >
                            {item.description}
                          </MenuItem>
                        )
                      }
                    </Select>
                    <FormHelperText>{texts.body.field.tax.helperText}</FormHelperText>
                  </Grid>

                  {/* ----- Form: percent ------*/}
                  <Grid item md={3} sm={6} xs={10}>
                    <Select
                      name={texts.body.field.percent.name}
                      value={state.form.currentPercentTax}
                      variant="outlined"
                      fullWidth
                    >
                      {
                        texts.body.field.percent.options.map((item) =>
                          <MenuItem
                            key={item.description}
                            value={item.code}
                            onClick={() => handleChangeSelectValue(texts.body.field.percent.name, item.code)}
                          >
                            {item.description}
                          </MenuItem>
                        )
                      }
                    </Select>
                    <FormHelperText>{texts.body.field.percent.helperText}</FormHelperText>
                  </Grid>
                </React.Fragment>
              ) : ''
          }

          <Grid item md={3} sm={6} xs={12}>
            <Button
              variant="contained"
              type="button"
              color="primary"
              size="large"
              onClick={() => handleTable("ADD")}
              className={classes.addButton}
              startIcon={<Save />}
            >
              {texts.body.buttons.addProduct.title}
            </Button>
          </Grid>

          {/* ----- Form: item **concepts table rendering ------*/}
          <Grid item md={12} sm={12} xs={12}>
            <ItemTable rows={state.selectedItems} handleTable={handleTable} />
          </Grid>

          {/* ----- Form: total ------*/}
          <Grid item md={4} sm={6} xs={10}>
            <TextField
              disabled={true}
              name={texts.body.field.total.name}
              value={state.form.total}
              variant='outlined'
              type='number'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.total.helperText}
              placeholder={texts.body.field.total.placeholder}
            />
          </Grid>

          {/* ----- Form: total taxes ------*/}
          <Grid item md={4} sm={6} xs={10}>
            <TextField
              disabled={true}
              name={texts.body.field.totalTaxes.name}
              value={state.form.totalTaxes}
              variant='outlined'
              type='number'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.totalTaxes.helperText}
              placeholder={texts.body.field.totalTaxes.placeholder}
            />
          </Grid>

          {/* ----- Form: total to pay ------*/}
          <Grid item md={4} sm={6} xs={10}>
            <TextField
              disabled={true}
              name={texts.body.field.totalToPay.name}
              value={state.form.totalToPay}
              variant='outlined'
              type='number'
              fullWidth
              onChange={handleChange}
              helperText={texts.body.field.totalToPay.helperText}
              placeholder={texts.body.field.totalToPay.placeholder}
            />
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
          {
            state.preview !== undefined ?
            (
              <Grid item md={12} sm={12} xs={12} className={classes.alignRight}>
                    <Link to={{ pathname: state.preview }} target='_blank'>
                      Descargue su factura
                    </Link>
              </Grid>
            ) : ''
          }
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
