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
                            <IndexApp />
                        </Route>
                        <Route path={urls.app.main.third.form}>
                            <ThirdForm />
                        </Route>
                        <Route path={urls.app.main.third.thirdMigrationForm}>
                            <ThirdMigration />
                        </Route>
                        <Route path={urls.app.main.cashReceipt.form}>
                            <CashReceiptForm/>
                        </Route>
                        <Route path={urls.app.main.cashReceipt.report}>
                            <CashReceiptReport />
                        </Route>
                        <Route path={urls.app.main.internalTransaction.form}>
                            <InternalTransactionForm />
                        </Route>
                        <Route path={urls.app.main.internalTransaction.report}>
                            <InternalTransactionReport />
                        </Route>
                        
                    </Switch>
              
                </div>
            </div>
        </div>
    );
}