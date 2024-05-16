/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import {
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
  Theme,
  Typography
} from '@material-ui/core'
import axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify'
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import EntityContext from '../../../contexts/Entity'
import { EntityContextType } from '../../../schemas/Entity'
import BalanceCard from './Card/BalanceCard'
import LineGraphic from './Graphics/LineGraphic/LineGraphic'
import DailyReportForm from './DailyReport/DailyReportForm'
import { Account } from '../../../schemas/Account'
import AccountService from '../../../services/Account'
import { ServerError } from '../../../schemas/Error'
import permissions from '../../../permissions.json'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '85%',
    margin: '10vh auto 10vh auto',
    height: 'auto'
  },
  container: {
    marginTop: '10vh',
    padding: '0'
  },
  gridCard: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardGraphic: {
    width: '100%',
    background: '#ffff',
    height: '30vh'
  },

}))

// - in this part all the component texts are housed
const texts = {
  header: {
    title: 'Bienvenido',
    user: 'Santiago Marin'
  },
  body: {
    cards: {
      cashBalance: {
        title: 'Saldo de Caja',
        value: '0.00',
        prefix: '$',
        percent: {
          value: 0,
          tooltip: 'Relación en procentaje respecto a mes anterior',
          prefix: '%'
        }
      },
      bankBalance: {
        title: 'Saldo de Banco',
        value: '0.00',
        prefix: '$',
        percent: {
          value: 0,
          tooltip: 'Relación en procentaje respecto a mes anterior',
          prefix: '%'
        }
      },
      percentBalance: {
        title: 'Respecto mes anterior',
        value: '0',
        prefix: '%',
        percent: {
          value: 0,
          tooltip: 'Relación en procentaje respecto a año anterior',
          prefix: '%'
        }
      },
      respectPreviousMonth: {
        title: 'Respecto mes anterior',
        value: 0,
        prefix: '%'
      }
    }
  }
}

interface State {
  accounts: Account[]
}

const initState: State = {
  accounts: []
}

export default function IndexApp() {
  const classes = useStyles()
  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const { entityContext } = React.useContext(
    EntityContext
  ) as EntityContextType

  const [state, setState] = React.useState<State>(initState)
  
  React.useEffect(() => {
    async function loadData() {
      try {
        const hasPermission = userContext.permissions.some(permission => permission === permissions.account.view)
        if (hasPermission) {
          const accountService = new AccountService()
          const accountRes = await accountService.getAccounts(userContext.token ?? '')
          setState({
            ...state,
            accounts: accountRes.accounts
          })
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const serverError = error as AxiosError<ServerError>
          if (serverError && serverError.response) {
            return toast.error(serverError.response.data.message)
          }
        }
      }
    }

    loadData()
  }, [])

  return (
    <div className={classes.root}>

      {/* -------------------- Header --------------- */}
      <React.Fragment>
        <Typography
          variant="h4"
        >
          {texts.header.title}, <span>{userContext.name} {userContext.lastname}</span>
        </Typography>
        <Typography
          variant="subtitle2"
        >
          {entityContext.name}
        </Typography>
        <div>
          <Typography
            variant="caption"
          >
            {entityContext.document}
          </Typography>
        </div>
      </React.Fragment>

      {/* -- Cards to show the values and percentages of the company --*/}
      <React.Fragment>
        <Container className={classes.container}>
          <Grid container spacing={3}>

            {/* --------------------- *Cash balance card ------------------ */}
            <Grid item md={4} sm={6} xs={12} className={classes.gridCard}>
              <BalanceCard data={state.accounts[0] ?? []} />
            </Grid>

            {/* --------------------- *Bank balance card ------------------ */}
            <Grid item md={4} sm={6} xs={12} className={classes.gridCard}>
              <BalanceCard data={state.accounts[1] ?? []} />
            </Grid>

            {/* -------------------- *Percent balance card ----------------- */}
            <Grid item md={4} sm={6} xs={12} className={classes.gridCard}>
              <BalanceCard data={state.accounts[2] ?? []} />
            </Grid>

            {/* -------------------- *Graphic balance card ----------------- */}
            <Grid item md={8} sm={12} xs={12} className={classes.gridCard}>
              <Card className={classes.cardGraphic}>
                <CardContent>
                  <LineGraphic />
                </CardContent>
              </Card>
            </Grid>

            {/* -------------------- *Daily report form card ----------------- */}
            <Grid item md={4} sm={6} xs={12} className={classes.gridCard}>
              <Card className={classes.cardGraphic}>
                <CardContent>
                  <DailyReportForm />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    </div>
  )
}
