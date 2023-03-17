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
      code: 'Código',
      description: 'Descripción',
      price: 'Precio',
      quantity: 'Cantidad',
      delete: 'Eliminar'
    }
  }
}
export default function ItemTable({ rows, handleTable }: { rows: Array<any>, handleTable: Function }) {

  const classes = useStyles();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setReload(false)
  }, [reload])

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{texts.table.headers.code}</TableCell>
            <TableCell>{texts.table.headers.description}</TableCell>
            <TableCell align="right">{texts.table.headers.price}</TableCell>
            <TableCell align="right">{texts.table.headers.quantity}</TableCell>
            <TableCell align="right">{texts.table.headers.delete}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" >{row.code}</TableCell>
                <TableCell component="th">{row.description}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleTable('REMOVE', row)}
                  >
                    <DeleteIcon />
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
