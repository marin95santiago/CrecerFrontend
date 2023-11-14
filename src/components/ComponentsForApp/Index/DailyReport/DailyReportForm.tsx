import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Divider,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import { NoteAdd } from '@material-ui/icons';
import { urls } from '../../../../urls';

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    height: 'auto'
  },
  form: {
    marginTop: '5vh'
  },
  submitButton: {
    textAlign: 'right'
  }
}));

// - in this part all the component texts are housed
const texts = {
  header: {
    title: 'Reporte caja diario'
  },
  body: {
    fields: {
      from: {
        name: 'date',
        helperText: 'Fecha'
      }
    }
  }
}

// ------------- Init state -----------
const today = new Date();
today.setDate(today.getDate());

const formattedToday = today.toISOString().substr(0, 10);

const minDate = new Date();
minDate.setDate(minDate.getDate() - 30); // Restar 10 días a la fecha actual

const formattedMinDate = minDate.toISOString().substr(0, 10);
const initState = {
  date: formattedToday,
  minDate: formattedMinDate
}

export default function DailyReportForm() {

  const classes = useStyles();

  const [form, setForm] = useState(initState);

  // HandleChange is the handler to update the state
  // of the form, while the user writes on an input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => {
      (prev as any)[name] = value
      const newValue = { ...prev }
      return newValue
    })
  }

  // HandleSubmit is the handler to verify and send
  // the form to redux (redux send the info to backend)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return window.open(`${urls.app.main.receipt.print_daily_report}?date=${form.date ?? ''}`, '_blank')
  }

  return (
    <div className={classes.root}>
      <div>
        <Typography
          variant="subtitle2"
          color="inherit"
        >
          {texts.header.title}
        </Typography>
      </div>

      <Divider />

      <form className={classes.form} onSubmit={(e) => handleSubmit(e)}>
        <TextField
          required={true}
          name={texts.body.fields.from.name}
          value={form.date}
          fullWidth
          type='date'
          onChange={handleChange}
          inputProps={{
            min: formattedMinDate,
            max: formattedToday
          }}
          helperText={texts.body.fields.from.helperText}
        />

        <div className={classes.submitButton}>
          <IconButton
            type="submit"
            className={classes.submitButton}
          >
            <NoteAdd fontSize={"small"} color="primary" />
          </IconButton>
        </div>

      </form>
    </div>
  )
}