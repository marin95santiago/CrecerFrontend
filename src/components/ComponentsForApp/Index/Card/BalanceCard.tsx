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
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

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

// ---------- Type for the info from props ----------
type data = {
    title: string,
    value: string,
    prefix: string,
    percent: {
        value: number,
        tooltip: string,
        prefix: string
    }
}

export default function BalanceCard({ data }: {data: data}) {

    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                {/* -------------- Header ----------- */}
                <Typography variant="subtitle2">
                    {data.title}
                </Typography>
                <Divider />
                <Typography
                variant={
                    // if the value is too big this code reduces the font size
                    data.value.length <= 9 ? "h3" : "h4"
                }
                color="primary"
                className={classes.cardBody}
                >
                    {data.value}
                    <span className={classes.cardPrefix}>
                        {data.prefix}
                    </span>
                </Typography>

                {/*This section has the code for porcent respect previous month */}
                <Tooltip title={data.percent.tooltip}>
                    <Typography
                        align="right"
                        variant="subtitle1"
                        color={
                        // if the value is negative this code changes the font color
                        data.percent.value >= 0
                            ? "primary"
                            : "secondary"
                        }
                    >
                        {
                        // if the value is negative this code changes the icon
                        data.percent.value >= 0 ? (
                            <ArrowUpwardIcon className={classes.cardPorcent} />
                        ) : (
                            <ArrowDownwardIcon className={classes.cardPorcent} />
                        )
                        }{" "}
                        {data.percent.value}{" "}
                        <span className={classes.cardPorcent}>
                        {data.percent.prefix}
                        </span>
                    </Typography>
                </Tooltip>
            </CardContent>
        </Card>
    );
}
