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
        title: 'Reporte de recibos de caja'
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
            serial: {
                name: 'serial',
                helperText: 'Ingrese el serial de la transacción',
                placeholder: 'Serial'
            },
            third: {
                name: 'third',
                helperText: 'Escoja un tercero para filtrar',
                options: [
                    {title: 'Pedro Mario Carranza', value: '33344554'},
                    {title: 'Eléctricos don pipe', value: '987675656'},
                    {title: 'Maria Perdomo', value: '35765633'}
                ]
            },
            wayPay: {
                name: 'wayPay',
                helperText: 'Escoja la manera de pago',
                options: [
                    {title: 'Efectivo', value: 'efectivo'},
                    {title: 'Consignación', value: 'consignacion'},
                    {title: 'Cheque', value: 'cheque'}
                ]
            },
            concept: {
                name: 'concept',
                helperText: 'Escoja un concepto',
                options: [
                    {title: 'Exequias', value: '12005'},
                    {title: 'Partidas', value: '11002'},
                    {title: 'Donaciones', value: '10250'}
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
    serial: '',
    third: '',
    wayPay: '',
    concept: '',
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
                    
                    {/* ----- Form: item **serial ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name = {texts.body.fields.serial.name}
                        value = {form.serial}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.body.fields.serial.helperText}
                        placeholder = {texts.body.fields.serial.placeholder}
                        />
                    </Grid>

                    {/* ----- Form: item **third ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <Select
                        name={texts.body.fields.third.name}
                        value = {form.third}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.fields.third.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.fields.third.helperText}</FormHelperText>
                    </Grid>

                    {/* ----- Form: item **way pay ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <Select
                        name={texts.body.fields.wayPay.name}
                        value = {form.wayPay}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.fields.wayPay.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.fields.wayPay.helperText}</FormHelperText>
                    </Grid>

                    {/* ----- Form: item **Concept ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <Select
                        name={texts.body.fields.concept.name}
                        value = {form.concept}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.fields.concept.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.fields.concept.helperText}</FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item **Type of cash receipt ------*/}
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
