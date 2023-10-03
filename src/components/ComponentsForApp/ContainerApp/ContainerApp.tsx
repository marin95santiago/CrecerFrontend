import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { urls } from '../../../urls';
import MainMenu from '../MainMenu/MainMenu';
import AppBarComponent from '../AppBar/AppBarComponent';
import CashReceiptForm from '../CashReceipt/CashReceiptForm';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import AccountForm from '../Account/AccountForm';
import AccountList from '../Account/AccountList';
import ThirdForm from '../Third/ThirdForm';
import ThirdList from '../Third/ThirdList';
import ThirdMigration from '../Third/ThirdMigration';
import ConceptForm from '../Concept/ConceptForm';
import ConceptList from '../Concept/ConceptList';
import InternalTransactionForm from '../InternalTransaction/InternalTransactionForm';
import CashReceiptReport from '../CashReceipt/CashReceiptReport';
import InternalTransactionReport from '../InternalTransaction/InternalTransactionReport';
import ItemForm from '../Item/ItemForm';
import ItemList from '../Item/ItemList';
import ElectronicBillForm from '../ElectronicBill/ElectronicBillForm';
import IndexApp from '../Index/IndexApp';
import ProtectRoute from '../../ComponentsForProtectRoutes/ProtectRoute';
import ElectronicBillList from '../ElectronicBill/ElectronicBillList';

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root:{
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
);

export default function ContainerApp() {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <div className={classes.body}>

                <div>
                    <MainMenu/>
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
                        <Route path={urls.app.main.item.form}>
                            <ProtectRoute>
                                <ItemForm/>
                            </ProtectRoute>
                        </Route>
                        <Route path={urls.app.main.item.list}>
                            <ProtectRoute>
                                <ItemList/>
                            </ProtectRoute>
                        </Route>
                        <Route path={urls.app.main.cashReceipt.form}>
                            <ProtectRoute>
                                <CashReceiptForm/>
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
                        <Route path={urls.app.main.cashReceipt.report}>
                            <ProtectRoute>
                                <CashReceiptReport />
                            </ProtectRoute>
                        </Route>
                        <Route path={urls.app.main.internalTransaction.form}>
                            <ProtectRoute>
                                <InternalTransactionForm />
                            </ProtectRoute>
                        </Route>
                        <Route path={urls.app.main.internalTransaction.report}>
                            <ProtectRoute>
                                <InternalTransactionReport />
                            </ProtectRoute>
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    );
}