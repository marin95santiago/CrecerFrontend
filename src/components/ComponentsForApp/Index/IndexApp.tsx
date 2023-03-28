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
import UserContext from '../../../contexts/User'
import { UserContextType } from '../../../schemas/User'
import EntityContext from '../../../contexts/Entity'
import { EntityContextType } from '../../../schemas/Entity'
import BalanceCard from './Card/BalanceCard'
import LineGraphic from './Graphics/LineGraphic/LineGraphic'
import DailyReportForm from './DailyReport/DailyReportForm'

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

export default function IndexApp() {

  const { userContext } = React.useContext(
    UserContext
  ) as UserContextType

  const { entityContext } = React.useContext(
    EntityContext
  ) as EntityContextType

  const classes = useStyles()

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
              <BalanceCard data={texts.body.cards.cashBalance} />
            </Grid>

            {/* --------------------- *Bank balance card ------------------ */}
            <Grid item md={4} sm={6} xs={12} className={classes.gridCard}>
              <BalanceCard data={texts.body.cards.bankBalance} />
            </Grid>

            {/* -------------------- *Percent balance card ----------------- */}
            <Grid item md={4} sm={6} xs={12} className={classes.gridCard}>
              <BalanceCard data={texts.body.cards.percentBalance} />
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
