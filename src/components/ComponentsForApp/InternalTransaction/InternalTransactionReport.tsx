import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { 
    Divider,
    FormHelperText,
    Grid, 
    IconButton,
    MenuItem,
    Select,
    TextField, 
    Typography 
} from '@material-ui/core';
import { Cancel, NoteAdd } from '@material-ui/icons';

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '85%',
        margin: '10vh auto 10vh auto',
        height: 'auto'
    },
    title: {
        fontWeight: 'bold',
        marginBottom: '1vh'
    },
    divider: {
        marginBottom: '6vh'
    },
    alignRight: {
        textAlign: 'right',
    }
}));

// - in this part all the component texts are housed
const texts = {
    header: {
        title: 'Reporte de transacciones internas'
    },
    body: {
        fields: {
            from: {
                name: 'from',
                helperText: 'Desde'
            },
            to: {
                name: 'to',
                helperText: 'Hasta'
            },
            bank: {
                name: 'bank',
                helperText: 'Escoja un banco',
                options: [
                    {title: 'Bancolombia', value: '786786765'},
                    {title: 'BBVA', value: '110546502'},
                    {title: 'Galicia', value: '10250345'}
                ]
            },
            type: {
                name: 'type',
                helperText: 'Escoja el tipo de recibo',
                options: [
                    {title: 'Ingreso', value: 'ingreso'},
                    {title: 'Egreso', value: 'egreso'}
                ]
            }
        }
    }
}

// ------------- Init state -----------
const initState = {
    from: new Date(),
    to: new Date(),
    bank: '',
    type: ''
}

export default function CashReceiptReport() {

    const classes = useStyles();

    const [ form, setForm ] = useState(initState);

    // HandleChange is the handler to update the state
    // of the form, while the user change the options 
    // on an input select.
    const handleChangeSelect = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = event.target.name as string;
        setForm({
            ...form,
            [name]: event.target.value,
        });
    }

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

    const cancel = () => {
        setForm(initState);
    }

    return (
        <div className={classes.root}>

             {/* ----- Header ------*/}
             <React.Fragment>
                <Typography 
                variant='h5'
                className={classes.title}
                >
                    {texts.header.title}
                </Typography>
            </React.Fragment>

            <Divider
            className={classes.divider}
            />

            {/* ----- Body ------*/}
            <form onSubmit={(e) => handleSubmit(e)}>
                <Grid container spacing={3}>

                    {/* ----- Form: item **from ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name = {texts.body.fields.from.name}
                        value = {form.from}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        type = 'date'
                        onChange = {handleChange}
                        helperText = {texts.body.fields.from.helperText}
                        />
                    </Grid>
                    
                    {/* ----- Form: item **to ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name = {texts.body.fields.to.name}
                        value = {form.to}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        type = 'date'
                        onChange = {handleChange}
                        helperText = {texts.body.fields.to.helperText}
                        />
                    </Grid>
                    
                    {/* ----- Form: item **Type of internal transaction ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <Select
                        name={texts.body.fields.type.name}
                        value = {form.type}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.fields.type.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.fields.type.helperText}</FormHelperText>
                    </Grid>

                    {/* ----- Form: item **Bank ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <Select
                        name={texts.body.fields.bank.name}
                        value = {form.bank}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.fields.bank.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.fields.bank.helperText}</FormHelperText>
                    </Grid>

                    <Grid item md={12} sm={12} xs ={12} className={classes.alignRight}>
                        <IconButton
                        type="submit"
                        >
                            <NoteAdd fontSize={"large"} color="primary"/>
                        </IconButton>

                        <IconButton
                        type="button"
                        onClick={cancel}
                        >
                            <Cancel fontSize={"large"} color="secondary"/>
                        </IconButton>
                    </Grid>
                
                </Grid>
            </form>
        </div>
    )
}
