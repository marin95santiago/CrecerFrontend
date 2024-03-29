import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { urls } from '../../../urls'
import MainMenu from '../MainMenu/MainMenu'
import AppBarComponent from '../AppBar/AppBarComponent'
import ReceiptForm from '../Receipt/ReceiptForm'
import ReceiptList from '../Receipt/ReceiptList'
import ReceiptPrint from '../Receipt/ReceiptPrint'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { CssBaseline } from '@material-ui/core'
import AccountForm from '../Account/AccountForm'
import AccountList from '../Account/AccountList'
import TransferBetweenAccountForm from '../Account/TransferBetweenAccountForm'
import ThirdForm from '../Third/ThirdForm'
import ThirdList from '../Third/ThirdList'
import ThirdMigration from '../Third/ThirdMigration'
import ConceptForm from '../Concept/ConceptForm'
import ConceptList from '../Concept/ConceptList'
import CashReceiptReport from '../Receipt/CashReceiptReport'
import ItemForm from '../Item/ItemForm'
import ItemList from '../Item/ItemList'
import ElectronicBillForm from '../ElectronicBill/ElectronicBillForm'
import IndexApp from '../Index/IndexApp'
import ProtectRoute from '../../ComponentsForProtectRoutes/ProtectRoute'
import ElectronicBillList from '../ElectronicBill/ElectronicBillList'
import CostCenterForm from '../CostCenter/CostCenterForm'
import CostCenterList from '../CostCenter/CostCenterList'
import DailyReportPrint from '../Receipt/DailyReportPrint'

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      background: '#fafafa',
    },
    body: {
      display: 'flex'
    },
    main: {
      flexGrow: 1,
    }
  }),
)

export default function ContainerApp() {

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <div className={classes.body}>

        <div>
          <MainMenu />
        </div>

        <div className={classes.main}>

          <AppBarComponent />

          {
            // This proyect uses the url.sts file to manage the urls
          }
          <Switch>
            <Route path={urls.app.main.home}>
              <ProtectRoute>
                <IndexApp />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.account.form}>
              <ProtectRoute>
                <AccountForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.account.list}>
              <ProtectRoute>
                <AccountList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.account.transferForm}>
              <ProtectRoute>
                <TransferBetweenAccountForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.third.form}>
              <ProtectRoute>
                <ThirdForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.third.list}>
              <ProtectRoute>
                <ThirdList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.third.thirdMigrationForm}>
              <ProtectRoute>
                <ThirdMigration />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.concept.form}>
              <ProtectRoute>
                <ConceptForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.concept.list}>
              <ProtectRoute>
                <ConceptList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.costCenter.form}>
              <ProtectRoute>
                <CostCenterForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.costCenter.list}>
              <ProtectRoute>
                <CostCenterList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.item.form}>
              <ProtectRoute>
                <ItemForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.item.list}>
              <ProtectRoute>
                <ItemList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.receipt.form}>
              <ProtectRoute>
                <ReceiptForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.receipt.list}>
              <ProtectRoute>
                <ReceiptList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.receipt.print}>
              <ProtectRoute>
                <ReceiptPrint />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.receipt.print_daily_report}>
              <ProtectRoute>
                <DailyReportPrint />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.electronicBill.form}>
              <ProtectRoute>
                <ElectronicBillForm />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.electronicBill.list}>
              <ProtectRoute>
                <ElectronicBillList />
              </ProtectRoute>
            </Route>
            <Route path={urls.app.main.receipt.report}>
              <ProtectRoute>
                <CashReceiptReport />
              </ProtectRoute>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}