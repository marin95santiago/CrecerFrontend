/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Theme, makeStyles } from '@material-ui/core'
import EntityContext from '../../../contexts/Entity'
import { EntityContextType } from '../../../schemas/Entity'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import Utils from '../../../utils'
import ReceiptService from '../../../services/Receipt'
import { DailyReportReceipt } from '../../../schemas/Receipt/dailyReport.schema'

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
  report?: DailyReportReceipt
}

const initState: State = {
  loading: true
}

export default function DailyReportPrint() {

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
      setState({
        ...state,
        loading: true
      })

      const date = Utils.getCodeFromUrl(search)

      if (document) {
        const receiptService = new ReceiptService()
        const report = await receiptService.getDailyReport(userContext.token ?? '', date ?? '')
        if (report) {
          setState({
            ...state,
            report,
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
              REPORTE CAJA DIARIO<br/>
              FECHA: {state.report?.date}
            </h4>

          </div>
        </div>
        
        <p style={{ fontSize: '12px', marginBottom: '5px', marginTop: 0 }}>
          {entityContext.address?.description} - {entityContext.email} <br/>
          <hr />
        </p>

        <div className={classes.content}>
          {
            state.report?.accounts.map(acc => (
              <div>
                <p>
                  <b>Saldo inicial:</b> {acc.description}<br/>
                  {Utils.formatNumber(acc.initBalance)}
                </p>
              </div>
            ))
          }
        </div>

        <div className={classes.content}>
          {
            state.report?.accounts.map(acc => (
              <div>
                <p>
                  <b>Saldo final:</b> {acc.description}<br/>
                  {Utils.formatNumber(acc.endBalance)}
                </p>
              </div>
            ))
          }
        </div>

        <hr style={{ marginTop: '10px', marginBottom: '5px' }} />

        <div className={classes.content}>
          <div style={{ width: '45%' }}>
            <p>
              <b>Ingresos:</b>
            </p>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Código</th>
                  <th style={{ textAlign: 'left' }}>Concepto</th>
                  <th style={{ textAlign: 'left' }}>Recibo</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {
                  state.report?.concepts.filter(concept => concept.type.code === 'ING').map(concept => (
                    <tr>
                      <td>{concept.account}</td>
                      <td>{concept.description}</td>
                      <td>{concept.receiptCode}</td>
                      <td style={{ textAlign: 'right' }}>$ {Utils.formatNumber(concept.value)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          <div style={{ width: '10%' }} />

          <div style={{ width: '45%' }}>
            <p>
              <b>Egresos:</b>
            </p>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Código</th>
                  <th style={{ textAlign: 'left' }}>Concepto</th>
                  <th style={{ textAlign: 'left' }}>Recibo</th>
                  <th style={{ textAlign: 'right' }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {
                  state.report?.concepts.filter(concept => concept.type.code === 'EGR').map(concept => (
                    <tr>
                      <td>{concept.account}</td>
                      <td>{concept.description}</td>
                      <td>{concept.receiptCode}</td>
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
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '25%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Generado
            </p>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '25%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Contabilizado
            </p>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', marginTop: '50px', width: '25%' }}
          >
            <p>
              <hr style={{ width: '100%' }} />
              Revisado
            </p>
          </div>

          <div style={{ marginTop: '50px', width: '5%' }} />
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
