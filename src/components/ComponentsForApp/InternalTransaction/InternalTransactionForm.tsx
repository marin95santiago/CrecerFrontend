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
import { InternalTransaction } from './internalTransaction.slice';

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
        title: 'Transacciones internas'
    },
    body: {
        field: {
            type: {
                name: 'type',
                helperText: 'Escoja el tipo de transacción',
                options: [
                    {title: 'Consignación de efectivo a un banco', value: 'CONSIGNACION'},
                    {title: 'Retiro de efectivo de un banco', value: 'RETIRO'},
                    {title: 'Transferencia de un banco a otro banco', value: 'TRANSFERENCIA'}
                ]
            },
            date: {
                name: 'date',
                helperText: 'Ingrese la fecha del movimiento',
                placeholder: 'Fecha *'
            },
            serial: {
                name: 'serial',
                helperText: 'Ingrese el serial o código de transacción',
                placeholder: 'Serial *'
            },
            bank: {
                name: 'bank',
                helperText: {
                    optionOne: 'Escoja el banco a consignar',
                    optionTwo: 'Escoja el banco a retirar',
                    optionThree: 'Escoja el banco que transfiere'
                },
                options: [
                    {title: 'Bancolombia', value: '674867836'},
                    {title: 'BBVA', value: '7786786687'}
                ]
            },
            secondBank: {
                name: 'secondBank',
                helperText: 'Escoja el banco a transferir'
            },
            value: {
                name: 'value',
                helperText: 'Ingrese el valor de la transacción',
                placeholder: 'Value *'
            }
        }
    }
}

// ------------- Init state -----------
const initState: InternalTransaction = {
    type: '',
    date: new Date(),
    serial: '',
    bank: '',
    secondBank: undefined,
    value: 0
}

export default function InternalTransactionForm() {

    const classes = useStyles();

    const [ form, setForm ] = useState<InternalTransaction>(initState);
    const [ valueStr, setValueStr ] = useState('');
    const [ newBankOptions, setNewBankOptions ] = useState(texts.body.field.bank.options);

    // HandleChange is the handler to update the state
    // of the form, while the user change the options 
    // on an input select.
    const handleChangeSelect = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = event.target.name as string;

        // this code removes the option slected on the bank
        // from the bank array, with this if the user wants 
        // to transfer from one bank to another the new options
        // will be the other banks.
        if(name === texts.body.field.bank.name){
            let res = texts.body.field.bank.options.filter(e => e.value !== event.target.value);
            setNewBankOptions(res);
        }

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

    // Function for thousand separator
    // this function adds thousand separator to numbers in:
    // fields: valueNumber
    const thousandSeparator = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target

        if(name === texts.body.field.value.name){
            setValueStr(value);

            let input = value.split(',').join('');
            let newInput = input.split('').reverse();
            
            let output = [];
            let aux = '';
            let paginator = Math.ceil(newInput.length / 3);
            
            for(let i = 0; i < paginator; i ++){
                for(let j = 0; j < 3; j ++){
                    if(newInput[j + (i * 3)] !== undefined){
                        aux += newInput[j + (i * 3)];
                    }
                }
                output.push(aux)
                aux = '';
                setValueStr(output.join(',').split('').reverse().join(''));
            }
        }
    }

    // HandleSubmit is the handler to verify and send
    // the form to redux (redux send the info to backend)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        // this code become the valueStr to number
        const r = /,/gi;
        const newValue = valueStr.replace(r, '');
        setForm({
            ...form,
            value: Number(newValue)
        });
    }

    const cancel = () => {
        setForm(initState);
        setValueStr('');
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

                
                    {/* ----- Form: item **type ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <Select
                        name={texts.body.field.type.name}
                        value = {form.type}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.field.type.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.field.type.helperText}</FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item **date ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name = {texts.body.field.date.name}
                        value = {form.date}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        type = 'date'
                        onChange = {handleChange}
                        helperText = {texts.body.field.date.helperText}
                        />
                    </Grid>
                    
                    {/* ----- Form: item **serial ------*/}
                    <Grid item md={6} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name = {texts.body.field.serial.name}
                        value = {form.serial}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.body.field.serial.helperText}
                        placeholder = {texts.body.field.serial.placeholder}
                        />
                    </Grid>

                    {/* ----- Form: item **bank ------*/}
                    <Grid item md={6} sm={6} xs={12}>
                        <Select
                        name={texts.body.field.bank.name}
                        value = {form.bank}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.field.bank.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title} - {e.value}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>
                            {
                                form.type === texts.body.field.type.options[0].value 
                                ? 
                                texts.body.field.bank.helperText.optionOne
                                : 
                                form.type === texts.body.field.type.options[1].value
                                ?
                                texts.body.field.bank.helperText.optionTwo
                                :
                                form.type === texts.body.field.type.options[2].value
                                ?
                                texts.body.field.bank.helperText.optionThree
                                :
                                texts.body.field.bank.helperText.optionOne
                            }
                                
                        </FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item **secondBank ------*/}
                    {
                        // this item will depend on the value in form.type 
                        form.type === texts.body.field.type.options[2].value
                        ?
                        <Grid item md={6} sm={6} xs={12}>
                            <Select
                            name={texts.body.field.secondBank.name}
                            value = {form.secondBank}
                            variant = "outlined"
                            fullWidth
                            onChange={handleChangeSelect}
                            >
                                {
                                    newBankOptions.map((e, index) => 
                                        <MenuItem
                                        key={index} 
                                        value={e.value} 
                                        >
                                            {e.title} - {e.value}
                                        </MenuItem>
                                        )
                                }
                            </Select>
                            <FormHelperText>{texts.body.field.secondBank.helperText}</FormHelperText>
                        </Grid>
                        :
                        ''
                    }

                    {/* ----- Form: item **value ------*/}
                    <Grid item md={6} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name={texts.body.field.value.name}
                        value = {valueStr}
                        onChange={thousandSeparator}
                        fullWidth
                        variant = "outlined"
                        helperText = {texts.body.field.value.helperText}
                        placeholder = {texts.body.field.value.placeholder}
                        />
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
