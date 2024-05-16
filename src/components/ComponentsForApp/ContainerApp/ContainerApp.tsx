import React from 'react'
import { Routes, Route } from 'react-router-dom'
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
          <Routes>
            <Route index path={urls.app.main.home} element={
              <ProtectRoute>
                <IndexApp />
              </ProtectRoute>
            } />
            <Route index path={urls.app.main.account.form} element={
              <ProtectRoute>
                <AccountForm />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.account.list} element={
              <ProtectRoute>
                <AccountList />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.account.transferForm} element={
              <ProtectRoute>
                <TransferBetweenAccountForm />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.third.form} element={
              <ProtectRoute>
                <ThirdForm />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.third.list} element={
              <ProtectRoute>
                <ThirdList />
              </ProtectRoute>
            }/>
              
            <Route path={urls.app.main.third.thirdMigrationForm} element={
              <ProtectRoute>
                <ThirdMigration />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.concept.form} element={
              <ProtectRoute>
                <ConceptForm />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.concept.list} element={
              <ProtectRoute>
                <ConceptList />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.costCenter.form} element={
              <ProtectRoute>
                <CostCenterForm />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.costCenter.list} element={
              <ProtectRoute>
                <CostCenterList />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.item.form} element={
              <ProtectRoute>
                <ItemForm />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.item.list} element={
              <ProtectRoute>
                <ItemList />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.receipt.form} element={
              <ProtectRoute>
                <ReceiptForm />
              </ProtectRoute>
            }/>
              
            
            <Route path={urls.app.main.receipt.list} element={
              <ProtectRoute>
                <ReceiptList />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.receipt.print} element={
              <ProtectRoute>
                <ReceiptPrint />
              </ProtectRoute>
            }/>

            <Route path={urls.app.main.receipt.print_daily_report} element={
              <ProtectRoute>
                <DailyReportPrint />
              </ProtectRoute>
            }/>
              
            <Route path={urls.app.main.electronicBill.form} element={
              <ProtectRoute>
                <ElectronicBillForm />
              </ProtectRoute>
            }/>
            
            <Route path={urls.app.main.electronicBill.list} element={
              <ProtectRoute>
                <ElectronicBillList />
              </ProtectRoute>
            }/>
            
            <Route path={urls.app.main.receipt.report} element={
              <ProtectRoute>
                <CashReceiptReport />
              </ProtectRoute>
            }/>
          </Routes>
        </div>
      </div>
    </div>
  )
}