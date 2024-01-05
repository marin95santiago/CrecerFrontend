import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core'
import EntityContext from '../../../contexts/Entity'
import ThirdsContext from '../../../contexts/Third'
import { EntityContextType } from '../../../schemas/Entity'
import { ThirdsContextType } from '../../../schemas/Third'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import Utils from '../../../utils'
import ReceiptService from '../../../services/Receipt'
import { Receipt } from '../../../schemas/Receipt'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
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
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'white',
    overflowY: 'auto'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  item: {
    width: '80%'
  },
  subtitle: {
    marginTop: '10px',
    borderBottom: 'solid 1px black'
  }
}))

interface State {
  loading: boolean
  receipt?: Receipt
  third?: string
}

const initState: State = {
  loading: true
}

export default function ReceiptPrint() {

  const classes = useStyles()
  const { search } = useLocation()
  const [state, setState] = useState<State>(initState)

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const { entityContext } = React.useContext(
    EntityContext
  ) as EntityContextType

  const { thirdsContext } = React.useContext(
    ThirdsContext
  ) as ThirdsContextType

  React.useEffect(() => {
    async function loadData() {
      setState({
        ...state,
        loading: true
      })

      const document = Utils.getCodeFromUrl(search)

      if (document) {
        const receiptService = new ReceiptService()
        const receipt = await receiptService.getReceiptByCode(userContext.token ?? '', document)
        if (receipt) {
          const third = thirdsContext.find(third => third.document === receipt.thirdDocument)
          setState({
            ...state,
            receipt: receipt,
            third: third ? (third.name ? `${third.name} ${third.lastname}` : `${third.businessName}`) : 'NA',
            loading: false,
          })
        }
      } else {
        setState({
          ...state,
          loading: false
        })
      }
    }
    loadData()
  }, [])

  return (
    <div className={classes.root}>
      <div>
        <div className={classes.content}>
          <div>
            <h3>
              {entityContext.name.toUpperCase()} <br/>
              Nit: {entityContext.document}-{entityContext.dv} <br/>
            </h3>
          </div>

          <div>
            <h4>
              RECIBO DE {state.receipt?.type?.description.toUpperCase()} <br/>
              SERIAL: {state.receipt?.code} <br/>
              {state.receipt?.date}
            </h4>

          </div>
        </div>
        
        <p style={{ fontSize: '12px', marginBottom: '5px', marginTop: 0 }}>
          {entityContext.address?.description} - {entityContext.email} <br/>
          <hr />
        </p>

        <div className={classes.content}>
          <div>
            <p>
              <b>Tercero:</b> <br/>
              {state.third}
            </p>
          </div>

          <div>
            <p>
              <b>Doc. Tercero:</b> <br/>
              {state.receipt?.thirdDocument}
            </p>
          </div>

          <div>
            <p>
              <b>Valor en letras:</b> <br/>
              {state.receipt?.totalValueLetter}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p>
              <b>Total:</b> <br/>
              {Utils.formatNumber(state.receipt?.total ?? 0)}
            </p>
          </div>
        </div>

        <div>
          <p>
            <b>Detalle:</b> {state.receipt?.description}
          </p>
        </div>

        <hr style={{ marginTop: '10px', marginBottom: '5px' }} />

        <div className={classes.content}>
          <div style={{ width: '35%' }}>
            <p>
              <b>Forma(s) de pago:</b>
            </p>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Código</th>
                  <th style={{ textAlign: 'left' }}>Cuenta</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {
                  state.receipt?.accounts.map(acc => (
                    <tr>
                      <td>{acc.account}</td>
                      <td>{acc.description}</td>
                      <td style={{ textAlign: 'right' }}>$ {Utils.formatNumber(acc.value)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          <div style={{ width: '10%' }} />

          <div style={{ width: '55%' }}>
            <p>
              <b>Por concepto(s) de:</b>
            </p>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Código</th>
                  <th style={{ textAlign: 'left' }}>Concepto</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {
                  state.receipt?.concepts.map(concept => (
                    <tr>
                      <td>{concept.account}</td>
                      <td>{concept.description}</td>
                      <td style={{ textAlign: 'right' }}>$ {Utils.formatNumber(concept.value)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        <hr style={{ marginTop: '10px', marginBottom: '5px' }} />

        <div className={classes.content}>
          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '15%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Aprobado
            </p>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '15%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Contabilizado
            </p>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '15%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Revisado
            </p>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '35%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Recibido C.C:
            </p>
          </div>
        </div>
      </div>

      <div>
        <p style={{ opacity: '0.5', fontSize: '12px' }}>
          <b>Impreso por CRECER DMC - www.crecerdmc.com</b>
        </p>
      </div>

    </div>
  )
}
