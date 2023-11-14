import React from "react";
import { 
    Card,
    CardContent,
    Divider,
    makeStyles,
    Theme,
    Tooltip,
    Typography 
} from "@material-ui/core";
import { Account } from "../../../../schemas/Account";
import Utils from "../../../../utils";
import { Link } from "react-router-dom";
import { urls } from "../../../../urls";

// ------------------- Styles ----------------------
const useStyles = makeStyles((theme: Theme) => ({
    card: {
        width: '100%',
        background: '#ffff',
        height: '30vh'
    },
    cardBody: {
        marginTop: '8vh',
    },
    cardPrefix: {
        fontSize: '3vh'
    },
    cardPorcent: {
        fontSize: '2vh'
    }
}));

export default function BalanceCard({ data }: {data: Account}) {

    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                {/* -------------- Header ----------- */}
                <Typography variant="subtitle2">
                    {data?.description ?? <Link style={{ textDecoration: 'none' }} color="primary" to={urls.app.main.account.form}>Nueva cuenta</Link>}
                </Typography>
                <Divider />
                <Typography
                variant={
                    // if the value is too big this code reduces the font size
                    "h4"
                }
                color={
                    // if the value is negative this code changes the font color
                    Number(data?.balance) >= 0
                        ? "primary"
                        : "secondary"
                }
                className={classes.cardBody}
                >
                    {Utils.formatNumber(data?.balance ?? 0)}
                    <span className={classes.cardPrefix}>
                        $
                    </span>
                </Typography>

                <Tooltip style={{ marginTop: '2vh' }} title={data?.description ?? ''}>
                    <Typography
                        align="right"
                        variant="subtitle2"
                        color="primary"
                    >
                        {data?.account ?? 0}
                    </Typography>
                </Tooltip>
            </CardContent>
        </Card>
    );
}
