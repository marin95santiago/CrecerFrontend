import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { 
    Divider, 
    IconButton,
    TextField, 
    Typography 
} from '@material-ui/core';
import { NoteAdd } from '@material-ui/icons';

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
const initState = {
    date: new Date(),
}

export default function DailyReportForm() {

    const classes = useStyles();

    const [ form, setForm ] = useState(initState);

    // HandleChange is the handler to update the state
    // of the form, while the user writes on an input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setForm(prev => {
            (prev as any)[name] = value
            const newValue = {...prev}
            return newValue
        })
    }

    // HandleSubmit is the handler to verify and send
    // the form to redux (redux send the info to backend)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
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
                name = {texts.body.fields.from.name}
                value = {form.date}
                fullWidth
                type = 'date'
                onChange = {handleChange}
                helperText = {texts.body.fields.from.helperText}
                />

                <div className={classes.submitButton}>
                    <IconButton
                    type="submit"
                    className={classes.submitButton}
                    >
                        <NoteAdd fontSize={"small"} color="primary"/>
                    </IconButton>
                </div>
                
            </form>
        </div>
    )
}