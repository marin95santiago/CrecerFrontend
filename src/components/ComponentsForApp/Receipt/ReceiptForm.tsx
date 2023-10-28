import React, { useState } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core'
import { NoteAdd, Cancel, ArrowDropUp, ArrowDropDown, Save } from '@material-ui/icons'
import { Receipt } from '../../../schemas/Receipt'
import { Account } from '../../../schemas/Account'
import { Third } from '../../../schemas/Third'
import { Concept } from '../../../schemas/Concept'
import ThirdService from '../../../services/Third'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import axios, { AxiosError } from 'axios'
import { ServerError } from '../../../schemas/Error'
import { toast } from 'react-toastify'
import ConceptService from '../../../services/Concept'
import EntityContext from '../../../contexts/Entity'
import { EntityContextType, ReceiptNumbers } from '../../../schemas/Entity'
import DataTableReceipt from './DataTableReceipt'
import AccountService from '../../../services/Account'
import { createAccounts, createConcepts } from '../../../mappers/Receipt/receipt.mapper'
import ReceiptService from '../../../services/Receipt'
import { urls } from '../../../urls'
import { useHistory, useLocation } from 'react-router-dom'
import { CostCenter } from '../../../schemas/CostCenter'
import CostCenterService from '../../../services/CostCenter'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '10vh auto 10vh auto',
    height: 'auto'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: '1vh'
  },
  divider: {
    marginBottom: '6vh'
  },
  alignRight: {
    textAlign: 'right',
  },
  addButton: {
    width: '100%',
    height: '70%',
    color: '#ffff',
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
    title: 'Recibos de ingreso y egreso'
  },
  body: {
    subtitleConcepts: 'Tabla de conceptos',
    subtitleAccounts: 'Formas de pago',
    field: {
      type: {
        name: 'type',
        helperText: 'Escoja el tipo de recibo',
        options: [
          { description: 'INGRESO', code: 'ING' },
          { description: 'EGRESO', code: 'EGR' }
        ]
      },
      code: {
        name: 'code',
        helperText: 'Escoja el prefijo'
      },
      description: {
        name: 'description',
        helperText: 'Detalle del recibo',
        placeholder: 'Detalle'
      },
      date: {
        name: 'date',
        helperText: 'Indique la fecha'
      },
      thirdDocument: {
        name: 'thirdDocument',
        helperText: 'Escoja el tercero',
        placeholder: 'Tercero'
      },
      totalValueLetter: {
        name: 'totalValueLetter',
        helperText: 'Escriba el valor total del recibo en letras',
        placeholder: 'Valor en letras'
      },
      currentAccount: {
        name: 'currentAccount',
        helperText: 'Escoja la cuenta'
      },
      currentAccountCostCenter: {
        name: 'currentAccountCostCenter',
        helperText: 'Escoja el centro de costo'
      },
      currentAccountValue: {
        name: 'currentAccountValue',
        helperText: 'Valor',
        placeholder: 'Valor'
      },
      currentConcept: {
        name: 'currentConcept',
        helperText: 'Escoja un cencepto'
      },
      currentConceptCostCenter: {
        name: 'currentConceptCostCenter',
        helperText: 'Escoja el centro de costo'
      },
      currentConceptValue: {
        name: 'currentConceptValue',
        helperText: 'Valor',
        placeholder: 'Valor'
      }
    },
    buttons: {
      add: 'Agregar'
    }
  }
}

interface State {
  form: Receipt,
  currentAccount?: Account
  currentAccountValue: number
  accountList: Account[]
  accountTotal: number
  currentConcept?: Concept
  currentConceptValue: number
  conceptTotal: number
  currentAccountCostCenter?: any
  currentConceptCostCenter?: any
  thirds: Third[]
  conceptList: Concept[]
  costCenterList: CostCenter[]
  suggestionsThirds: any[]
  selectedAccounts: any[]
  selectedConcepts: any[]
  prefix: ReceiptNumbers[]
  status: boolean
  thirdSelected?: string
  loading: boolean
  disabledForm: boolean
}

const initState: State = {
  form: {
    type: undefined,
    date: '',
    code: '',
    description: '',
    thirdDocument: '',
    totalValueLetter: '',
    total: 0,
    accounts: [],
    concepts: []
  },
  currentAccount: undefined,
  currentAccountValue: 0,
  accountList: [],
  accountTotal: 0,
  currentConcept: undefined,
  currentConceptValue: 0,
  conceptTotal: 0,
  thirds: [],
  conceptList: [],
  costCenterList: [],
  suggestionsThirds: [],
  selectedAccounts: [],
  selectedConcepts: [],
  prefix: [],
  thirdSelected: '',
  status: false,
  loading: false,
  disabledForm: false
}

export default function ReceiptForm() {

  const classes = useStyles()
  const { search } = useLocation()
  const history = useHistory()

  const [state, setState] = useState<State>(initState)
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const { entityContext } = React.useContext(
    EntityContext
  ) as EntityContextType

  React.useEffect(() => {
    async function loadData() {

      setState({
        ...state,
        loading: true
      })

      try {
        // get thirds
        const thirdService = new ThirdService()
        const thirdsRes = await thirdService.getThirds(userContext.token || '')
        const thirds = thirdsRes.thirds

        // get accounts
        const accountService = new AccountService()
        const accountRes = await accountService.getAccounts(userContext.token || '')
        const accounts = accountRes.accounts

        // get concepts
        const conceptService = new ConceptService()
        const conceptRes = await conceptService.getConcepts(userContext.token || '')
        const concepts = conceptRes.concepts

        // get cost center
        const costCenterService = new CostCenterService()
        const costCenterRes = await costCenterService.getCostCenters(userContext.token || '')
        const costCenters = costCenterRes.costCenters

        setState({
          ...state,
          thirds,
          suggestionsThirds: thirds,
          conceptList: concepts,
          accountList: accounts,
          costCenterList: costCenters,
          prefix: entityContext.receiptNumbers ?? [],
          loading: false
        })
      } catch (error) {
        setState({
          ...state,
          loading: false
        })

        if (axios.isAxiosError(error)) {
          const serverError = error as AxiosError<ServerError>
          if (serverError && serverError.response) {
            return toast.error(serverError.response.data.message || error.toString())
          }
        }
      }
    }

    loadData()
  }, [])

  const handleChangeSelect = (
    name: string,
    item: any) => {
    if (name === texts.body.field.thirdDocument.name) {
      setState({
        ...state,
        form: {
          ...state.form,
          [name]: item.document
        },
        thirdSelected: item.name !== undefined ? `${item.name} ${item.lastname}` : `${item.businessName}`,
        status: false
      })
    } else if (name === texts.body.field.code.name) {
      setState({
        ...state,
        form: {
          ...state.form,
          code: item.code
        }
      })
    } else if (name === texts.body.field.currentAccount.name || name === texts.body.field.currentAccountCostCenter.name || name === texts.body.field.currentConceptCostCenter.name || name === texts.body.field.currentConcept.name) {
      setState({
        ...state,
        [name]: item
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === texts.body.field.currentAccountValue.name || name === texts.body.field.currentConceptValue.name) {
      setState({
        ...state,
        [name]: value
      })
    } else {
      setState({
        ...state,
        form: {
          ...state.form,
          [name]: value
        }
      })
    }
  }

  const handleSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    const suggestionsThirds = state.thirds.filter(third => {
      if (third.name?.toLowerCase().includes(value.toLowerCase())) {
        return third
      } else if (third.lastname?.toLowerCase().includes(value.toLowerCase())) {
        return third
      } else if (third.businessName?.toLowerCase().includes(value.toLowerCase())) {
        return third
      }
    })

    setState({
      ...state,
      thirdSelected: value,
      suggestionsThirds,
      status: value.length > 0 ? true : false
    })
  }

  // Function for thousand separator
  // this function adds thousand separator to numbers in:
  // fields: valueNumber.
  const thousandSeparator = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // setConceptValue(value)
    if (name === 'conceptValue') {
      let input = value.split(',').join('')
      let newInput = input.split('').reverse()

      let output = []
      let aux = ''
      let paginator = Math.ceil(newInput.length / 3)

      for (let i = 0; i < paginator; i++) {
        for (let j = 0; j < 3; j++) {
          if (newInput[j + (i * 3)] !== undefined) {
            aux += newInput[j + (i * 3)]
          }
        }
        output.push(aux)
        aux = ''
        // setConceptValue(output.join(',').split('').reverse().join(''))
      }
    }
  }

  // HandleTable is the handler to add and remove items
  // from the concept table, it also adds or subtracts 
  // the value of the total receipt.
  const handleTableAccount = (func: string, selected?: any) => {
    if (func === 'ADD') {
      // add total account for validations
      const total = Number(state.accountTotal) + Number(state.currentAccountValue)
      const newAccount = {
        ...state.currentAccount,
        value: state.currentAccountValue,
        costCenter: state.currentAccountCostCenter
      }
      const accounts = state.selectedAccounts
      accounts.push(newAccount)
      setState({
        ...state,
        selectedAccounts: accounts,
        currentAccount: undefined,
        currentAccountCostCenter: undefined,
        currentAccountValue: 0,
        accountTotal: total
      })
    } else if (func === 'REMOVE') {
      // substract total account
      const total = Number(state.accountTotal) - Number(selected.value)
      const accounts = state.selectedAccounts.filter(acc => acc.account !== selected.account)
      setState({
        ...state,
        selectedAccounts: accounts,
        accountTotal: total
      })
    }
  }

  // HandleTable is the handler to add and remove items
  // from the concept table, it also adds or subtracts 
  // the value of the total receipt.
  const handleTableConcept = (func: string, selected?: any) => {
    if (func === 'ADD') {
      // add total concept for validations
      const total = Number(state.conceptTotal) + Number(state.currentConceptValue)
      const newConcept = {
        ...state.currentConcept,
        value: state.currentConceptValue,
        costCenter: state.currentConceptCostCenter
      }
      const concepts = state.selectedConcepts
      concepts.push(newConcept)
      setState({
        ...state,
        form: {
          ...state.form,
          total: total
        },
        selectedConcepts: concepts.map((c, index) => {
          return {
            ...c,
            id: index
          }
        }),
        currentConcept: undefined,
        currentConceptCostCenter: undefined,
        currentConceptValue: 0,
        conceptTotal: total
      })
    } else if (func === 'REMOVE') {
      // substract total concept
      const total = Number(state.conceptTotal) - Number(selected.value)
      const concepts = state.selectedConcepts.filter(conc => conc.id !== selected.id)
      setState({
        ...state,
        form: {
          ...state.form,
          total: total
        },
        selectedConcepts: concepts.map((c, index) => {
          return {
            ...c,
            id: index
          }
        }),
        conceptTotal: total
      })
    }
  }

  // HandleSubmit is the handler to verify and send
  // the form to redux (redux send the info to backend)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      // validations
      if (state.selectedAccounts.length === 0) throw new Error('Debe seleccionar al menos una cuenta')
      if (state.selectedConcepts.length === 0) throw new Error('Debe seleccionar al menos un concepto')
      if (Number(state.accountTotal) !== Number(state.conceptTotal)) throw new Error('Los valores totales de las cuentas y conceptos no concuerdan')

      const accounts = createAccounts(state.selectedAccounts, state.form.type)
      const concepts = createConcepts(state.selectedConcepts)
      const receipt = {
        ...state.form,
        accounts,
        concepts
      }

      const receiptService = new ReceiptService()
      const receiptCreated = await receiptService.saveReceipt(receipt, userContext.token ?? '')

      setState({
        ...initState,
        selectedAccounts: [],
        selectedConcepts: [],
        prefix: state.prefix,
        accountList: state.accountList,
        thirds: state.thirds,
        conceptList: state.conceptList,
        loading: false
      })
  
      history.push(urls.app.main.receipt.form)
      return toast.success(`El comprobante ${receiptCreated.code} fue creado con éxito`)

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
    setState({
      ...initState,
      selectedAccounts: [],
      selectedConcepts: [],
      prefix: state.prefix,
      accountList: state.accountList,
      thirds: state.thirds,
      conceptList: state.conceptList,
      loading: false
    })
  }

  return (
    <div className={classes.root}>

      {/* ------- *Header --------- */}
      <React.Fragment>
        <Typography
          variant='h5'
          className={classes.title}
        >
          {texts.header.title}
        </Typography>
      </React.Fragment>

      <Divider
        className={classes.divider}
      />

      {/* ------- *Body ----------- */}
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid container spacing={3}>

          {/* ----- Form: item **type ------*/}
          <Grid item md={4} sm={4} xs={12}>
            <Select
              name={texts.body.field.type.name}
              value={state.form.type?.code ?? ''}
              variant="outlined"
              fullWidth
              required
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

          {/* ----- Form: prefix ------*/}
          <Grid item md={4} sm={4} xs={12}>
            <Select
              name={texts.body.field.code.name}
              value={state.form.code}
              variant="outlined"
              fullWidth
              required
            >
              {
                state.prefix.map((item) =>
                  <MenuItem
                    key={item.prefix}
                    value={item.prefix}
                    onClick={() => handleChangeSelect(texts.body.field.code.name, { code: item.prefix, description: item.prefix })}
                  >
                    {item.prefix}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.code.helperText}</FormHelperText>
          </Grid>

          {/* ----- Form: item **date ------*/}
          <Grid item md={4} sm={6} xs={12}>
            <TextField
              name={texts.body.field.date.name}
              value={state.form.date}
              id='outlined-helperText'
              variant='outlined'
              fullWidth
              type='date'
              onChange={handleChange}
              helperText={texts.body.field.date.helperText}
              required
            />
          </Grid>

          {/* ----- Form: third ------*/}
          <Grid item md={12} sm={12} xs={12}>
            <TextField
              name="thirdSelected"
              value={state.thirdSelected}
              variant="outlined"
              fullWidth
              onChange={handleSuggestions}
              required
              autoComplete='off'
              InputProps={{
                endAdornment: <InputAdornment position="end">
                  <IconButton onClick={() => setState({ ...state, status: !state.status })}>
                    {
                      state.status ?
                        (
                          <ArrowDropUp fontSize={"small"} color="secondary" />
                        ) :
                        (
                          <ArrowDropDown fontSize={"small"} color="primary" />
                        )
                    }
                  </IconButton>
                </InputAdornment>,
              }}
            />
            {
              state.status === true && (
                <Box sx={{
                  width: '100%',
                  maxHeight: 100,
                  display: 'relative',
                  zIndex: 1,
                  bgcolor: '#E1E1E1',
                  overflow: 'auto'
                }}>
                  {
                    state.suggestionsThirds.map((third) =>
                      <MenuItem
                        key={third.document}
                        onClick={() => handleChangeSelect(texts.body.field.thirdDocument.name, third)}
                      >
                        {third.name !== undefined ? `${third.name} ${third.lastname}` : `${third.businessName}`}
                      </MenuItem>
                    )
                  }
                </Box>
              )
            }
            <FormHelperText>{texts.body.field.thirdDocument.helperText}</FormHelperText>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <TextField
              name={texts.body.field.description.name}
              value={state.form.description}
              id='outlined-helperText'
              variant='outlined'
              fullWidth
              required
              onChange={handleChange}
              helperText={texts.body.field.description.helperText}
              placeholder={texts.body.field.description.placeholder}
            />
          </Grid>

          {/* ----- Form: item **value in text ------*/}
          <Grid item md={12} sm={12} xs={12}>
            <TextField
              name={texts.body.field.totalValueLetter.name}
              value={state.form.totalValueLetter}
              id='outlined-helperText'
              variant='outlined'
              fullWidth
              required
              onChange={handleChange}
              helperText={texts.body.field.totalValueLetter.helperText}
              placeholder={texts.body.field.totalValueLetter.placeholder}
            />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Typography
              variant='h6'
            >
              {texts.body.subtitleAccounts}
            </Typography>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Select
              name={texts.body.field.currentAccount.name}
              value={state.currentAccount?.account ?? ''}
              variant="outlined"
              fullWidth
              disabled={state.disabledForm}
            >
              {
                state.accountList.map((account) =>
                  <MenuItem
                    key={account.description}
                    value={account.account}
                    onClick={() => handleChangeSelect(texts.body.field.currentAccount.name, account)}
                  >
                    {account.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.currentAccount.helperText}</FormHelperText>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <Select
              name={texts.body.field.currentAccountCostCenter.name}
              value={state.currentAccountCostCenter?.code ?? ''}
              variant="outlined"
              fullWidth
              disabled={state.disabledForm}
            >
              {
                state.costCenterList.filter(costCenter => {
                  if (costCenter.type.code === 'PAY') {
                    return costCenter
                  }
                }).map((cc) =>
                  <MenuItem
                    key={cc.description}
                    value={cc.code}
                    onClick={() => handleChangeSelect(texts.body.field.currentAccountCostCenter.name, cc)}
                  >
                    {cc.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.currentAccountCostCenter.helperText}</FormHelperText>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <TextField
              name={texts.body.field.currentAccountValue.name}
              value={state.currentAccountValue}
              id='outlined-helperText'
              variant='outlined'
              fullWidth
              type='number'
              onChange={handleChange}
              helperText={texts.body.field.currentAccountValue.helperText}
              placeholder={texts.body.field.currentAccountValue.placeholder}
            />
          </Grid>

          <Grid item md={2} sm={6} xs={12}>
            <Button
              variant="contained"
              type="button"
              color="primary"
              size="large"
              onClick={() => handleTableAccount("ADD")}
              className={classes.addButton}
              startIcon={<Save />}
              disabled={state.disabledForm}
            >
              {texts.body.buttons.add}
            </Button>
          </Grid>

          {/* ----- Form: item **concepts table rendering ------*/}
          <Grid item md={12} sm={12} xs={12} style={{ marginBottom: '6vh' }}>
            <DataTableReceipt rows={state.selectedAccounts} handleTable={handleTableAccount} disabledForm={state.disabledForm} />
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Typography
              variant='h6'
            >
              {texts.body.subtitleConcepts}
            </Typography>
          </Grid>

          <Grid item md={12} sm={12} xs={12}>
            <Divider className={classes.divider} />
          </Grid>

          <Grid item md={4} sm={6} xs={12}>
            <Select
              name={texts.body.field.currentConcept.name}
              value={state.currentConcept?.account ?? ''}
              variant="outlined"
              fullWidth
              disabled={state.disabledForm}
            >
              {
                state.conceptList.filter(concept => {
                  if (state.form.type?.code === 'ING' && concept.type.code === 'CREDIT') {
                    return concept
                  } else if (state.form.type?.code === 'EGR' && concept.type.code === 'DEBIT') {
                    return concept
                  }
                }).map((concept) =>
                  <MenuItem
                    key={concept.description}
                    value={concept.account}
                    onClick={() => handleChangeSelect(texts.body.field.currentConcept.name, concept)}
                  >
                    {concept.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.currentConcept.helperText}</FormHelperText>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <Select
              name={texts.body.field.currentConceptCostCenter.name}
              value={state.currentConceptCostCenter?.code ?? ''}
              variant="outlined"
              fullWidth
              disabled={state.disabledForm}
            >
              {
                state.costCenterList.filter(costCenter => {
                  if (costCenter.type.code === 'CONCEPT') {
                    return costCenter
                  }
                }).map((cc) =>
                  <MenuItem
                    key={cc.description}
                    value={cc.code}
                    onClick={() => handleChangeSelect(texts.body.field.currentConceptCostCenter.name, cc)}
                  >
                    {cc.description}
                  </MenuItem>
                )
              }
            </Select>
            <FormHelperText>{texts.body.field.currentConceptCostCenter.helperText}</FormHelperText>
          </Grid>

          <Grid item md={3} sm={6} xs={12}>
            <TextField
              name={texts.body.field.currentConceptValue.name}
              value={state.currentConceptValue}
              id='outlined-helperText'
              variant='outlined'
              fullWidth
              type='number'
              onChange={handleChange}
              helperText={texts.body.field.currentConceptValue.helperText}
              placeholder={texts.body.field.currentConceptValue.placeholder}
            />
          </Grid>

          <Grid item md={2} sm={6} xs={12}>
            <Button
              variant="contained"
              type="button"
              color="primary"
              size="large"
              onClick={() => handleTableConcept("ADD")}
              className={classes.addButton}
              startIcon={<Save />}
              disabled={state.disabledForm}
            >
              {texts.body.buttons.add}
            </Button>
          </Grid>

          {/* ----- Form: item **concepts table rendering ------*/}
          <Grid item md={12} sm={12} xs={12} style={{ marginBottom: '6vh' }}>
            <DataTableReceipt rows={state.selectedConcepts} handleTable={handleTableConcept} disabledForm={state.disabledForm} />
          </Grid>

          {/* ----- Form: item **total ------*/}
          <Grid item md={4} sm={4} xs={6}>
            <Typography variant="h6">
              <span>Total: </span>$ {state.form.total}
            </Typography>
          </Grid>

          <Grid item md={12} sm={12} xs={12} className={classes.alignRight}>
            <IconButton
              type="submit"
            >
              <NoteAdd fontSize={"large"} color="primary" />
            </IconButton>

            <IconButton
              onClick={cancel}
              type="button"
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
                <CircularProgress />
              </Box>
            </div>
          ) : ''
      }
    </div>
  )
}

