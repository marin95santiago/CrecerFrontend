import { makeStyles, Theme } from "@material-ui/core";
import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

// this data is just as example // data for the graphic
const data = [
    {
        name: "Enero",
        uv: 4000,
    },
    {
        name: "Febrero",
        uv: 3000,
    },
    {
        name: "Marzo",
        uv: 2000,
    },
    {
        name: "Abril",
        uv: 2780,
    },
    {
        name: "Mayo",
        uv: 5698,
    },
    {
        name: "Junio",
        uv: 6657,
    }
];

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: '90vh',
        height: '27vh',
    }
}));

export default function LineGraphic() {

    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                  
                        <Bar dataKey="uv" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
