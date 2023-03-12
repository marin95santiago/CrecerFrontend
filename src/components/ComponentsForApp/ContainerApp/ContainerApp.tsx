import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { urls } from '../../../urls';
import MainMenu from '../MainMenu/MainMenu';
import AppBarComponent from '../AppBar/AppBarComponent';
import CashReceiptForm from '../CashReceipt/CashReceiptForm';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import ThirdForm from '../Third/ThirdForm';
import ThirdMigration from '../Third/ThirdMigration';
import InternalTransactionForm from '../InternalTransaction/InternalTransactionForm';
import CashReceiptReport from '../CashReceipt/CashReceiptReport';
import InternalTransactionReport from '../InternalTransaction/InternalTransactionReport';
import IndexApp from '../Index/IndexApp';
import ProtectRoute from '../../ComponentsForProtectRoutes/ProtectRoute';

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
                        <Route path={urls.app.main.third.form}>
                            <ProtectRoute>
                                <ThirdForm />
                            </ProtectRoute>
                        </Route>
                        <Route path={urls.app.main.third.thirdMigrationForm}>
                            <ProtectRoute>
                                <ThirdMigration />
                            </ProtectRoute>
                        </Route>
                        <Route path={urls.app.main.cashReceipt.form}>
                            <ProtectRoute>
                                <CashReceiptForm/>
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