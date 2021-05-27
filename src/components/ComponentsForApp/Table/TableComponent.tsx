import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

// -------------- Styles --------------
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const texts = {
    table: {
        headers: {
            concept: 'Concepto',
            detail: 'Detalle',
            value: 'Valor',
            delete: 'Eliminar'
        }
    }
}
export default function TableComponent({rows, handleTable} : {rows: Array<any>, handleTable: Function}) {
  
    const classes = useStyles();
    const [reload, setReload] = useState(false);

    useEffect(() => {
        setReload(false)
    }, [reload])

    // HandleDelete is the handler to delete items from
    // the table.
    const handleDelete = (index: number, value: string) => {
        // this code become the newValue (total of receipt) to number
        const r = /,/gi;
        const newValue = Number(value.replace(r, ''));
        handleTable("DEL", index, newValue)
        setReload(true)
    }

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>{texts.table.headers.concept}</TableCell>
                        <TableCell align="right">{texts.table.headers.detail}</TableCell>
                        <TableCell align="right">{texts.table.headers.value}</TableCell>
                        <TableCell align="right">{texts.table.headers.delete}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" >{row.concept}</TableCell>
                            <TableCell align="right">{row.detail}</TableCell>
                            <TableCell align="right">{row.value}</TableCell>
                            <TableCell align="right">
                                <IconButton 
                                aria-label="delete"
                                onClick={() => handleDelete(index, row.value)}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
