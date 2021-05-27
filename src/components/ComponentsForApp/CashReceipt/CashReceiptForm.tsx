import React, { useState } from 'react';
import TableComponent from '../Table/TableComponent'
import { makeStyles, Theme } from '@material-ui/core/styles';
import { 
    Button, 
    Divider, 
    FormHelperText, 
    Grid, 
    IconButton, 
    MenuItem, 
    Select, 
    TextField, 
    Typography 
} from '@material-ui/core';
import { CashReceipt, Concept } from './cashReceipt.slice';
import { Save, Help, NoteAdd, Cancel } from '@material-ui/icons';

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
    },
    addButton: {
        width: '100%',
        height: '70%',
        color: '#ffff',
    },
}));

// ------------- Init state -----------
const initStateForm: CashReceipt = {
    type: 'INGRESO',
    date: new Date(),
    serial: '',
    third: '',
    classThird: '',
    valueText: '',
    valueNumber: 0,
    wayPay: [],
    conceptTable: []
}

// - in this part all the component texts are housed
const texts = {
    header: {
        title: 'Recibos de ingreso y egreso'
    },
    fields: {
        type: {
            name: 'type',
            helperText: 'Escoja el tipo de recibo',
            options: ['INGRESO', 'EGRESO']
        },
        date: {
            name: 'date',
            helperText: 'Indique la fecha'
        },
        serial: {
            name: 'serial',
            helperText: 'Escriba el consecutivo',
            placeholder: 'Serial'
        },
        third: {
            name: 'third',
            helperText: 'Escoja uno de los terceros',
            options: [
                {
                    _id: '1',
                    typeThird: 'JURIDICA',
                    typeDocument: 'NIT',
                    document: '123456-7',
                    enterpriceName: 'Almacenes Éxito',
                }
            ]
        },
        classThird: {
            name: 'classThird',
            helperText: 'Escoja una clase del tercero',
            options: [
                {
                    classThird: 'Proveedor'
                }
            ]
        },
        valueText: {
            name: 'valueText',
            helperText: 'Escriba el valor total del recibo en letras',
            placeholder: 'Valor en letras'
        },
        wayPay: {
            name: 'wayPay',
            helperText: 'Selecciona la forma de pago',
            options: [
                {title: 'EFECTIVO', value: 'EFECTIVO'},
                {title: 'CHEQUE', value: 'CHEQUE'},
                {title: 'CONSIGNACIÓN', value: 'CONSIGNACION'},
                {title: 'TRANSFERENCIA', value: 'TRANSFERENCIA'}
            ]
        },
        bank: {
            name: 'bank',
            helperTextIng: 'Selecciona el banco a depositar',
            helperTextEgr: 'Selecciona el banco a debitar',
            options: [
                {
                    _id: "5fac806e7434966c842292fe",
                    bank: "BANCOLOMBIA",
                    numberAccount: "28563044871",
                    typeAccount: "DEBITO"
                }
            ]
        },
        concept: {
            name: 'concept',
            helperText: 'Selecciona un concepto',
            options: [
                {
                    concept: 'Concepto de prueba'
                }
            ]
        },
        conceptDetail: {
            name: 'conceptDetail',
            helperText: 'Detalla el concepto a profundidad',
            placeholder: 'Detalle'
        },
        conceptValue: {
            name: 'conceptValue',
            helperText: 'Ingresa el valor del concepto',
            placeholder: '$ Valor'
        },
        buttonAddConcept: {
            title: 'Agregar'
        }
    },
    body: {
        subtitle: 'Tabla de conceptos'
    }
}

export default function CashReceiptForm() {

    const classes = useStyles();

    const [form, setForm] = useState<CashReceipt>(initStateForm);
    const [wayPay, setWayPay] = useState('');
    const [bank, setBank] = useState('NO DEFINIDO');
    const [modalBank, setModalBank] = useState(false);

    // States of the concept table
    // This table will go into the main form
    // Main form field: 'wayPay'
    const [conceptTable, setConceptTable] = useState<Concept[]>([]);
    const [concept, setConcept] = useState('');
    const [conceptDetail, setConceptDetail] = useState('');
    const [conceptValue, setConceptValue] = useState('');
    const [total, setTotal] = useState(0);

    // HandleChange is the handler to update the state
    // of the form, while the user writes on an input.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        switch (name) {

            case 'conceptDetail':
                setConceptDetail(value)
                break;

            default:
                setForm(prev => {
                    (prev as any)[name] = value
                    const newValue = {...prev}
                    return newValue
                })
                break;
        }
    };

    // HandleChange is the handler to update the state
    // of the form, while the user change the options 
    // on an input select.
    const handleChangeSelect = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = event.target.name as string;

        switch (name) {
            case 'wayPay':
                setWayPay(event.target.value as any)
                handleModalBank(event.target.value as any, form.type);
                break;

            case 'bank':
                setBank(event.target.value as any)
                break;
            
            case 'type':
                setForm({
                    ...form,
                    type: event.target.value as any,
                });
                handleModalBank(wayPay, event.target.value as any);
                break;
            
            case 'concept':
                setConcept(event.target.value as any);
                break;

            default:
                setForm({
                    ...form,
                    [name]: event.target.value,
                });
        }
    };

    // HandleModalBank is the handler to show and hide
    // the bank input select: cond1 is wayPay value and
    // cond2 is type value.
    const handleModalBank = (cond1: string, cond2: string) => {

        switch (cond1) {
            case 'EFECTIVO':
                setModalBank(false);
                setBank('NO DEFINIDO');
                break;

            case 'CHEQUE':
                if(cond2 === 'INGRESO'){
                    setModalBank(false);
                    setBank('NO DEFINIDO');

                } else if(cond2 === 'EGRESO') {
                    setModalBank(true);
                }
                break;

            case 'CONSIGNACION':
                if(cond2 === 'INGRESO'){
                    setModalBank(true);

                } else if(cond2 === 'EGRESO') {
                    setModalBank(false);
                    setBank('NO DEFINIDO');
                }
                break;

            case 'TRANSFERENCIA':
                setModalBank(true);
                break;
        
            default:
                break;
        }
    };

    // HandleTable is the handler to add and remove items
    // from the concept table, it also adds or subtracts 
    // the value of the total receipt.
    const handleTable = (func: string, id?: number, value?: number) => {

        switch (func) {
            case 'PUSH':
                setConceptTable([...conceptTable, {
                    concept,
                    detail: conceptDetail,
                    value: conceptValue
                }]);

                const r = /,/gi;
                const newValue = Number(conceptValue.replace(r, ''));

                setTotal(total + newValue);
                setConcept('');
                setConceptDetail('');
                setConceptValue('');
                break;

            case 'DEL':
                console.log(id)
                if(id !== undefined){
                    let newArray = conceptTable;
                    newArray.splice(id, 1);
                    setConceptTable(newArray);
                }
                if(value !== undefined){
                    setTotal(total - value) 
                }
                break;
            default:
                break;
        }
    };
    
    // Function for thousand separator
    // this function adds thousand separator to numbers in:
    // fields: valueNumber.
    const thousandSeparator = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setConceptValue(value);
        if(name === 'conceptValue'){
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
                setConceptValue(output.join(',').split('').reverse().join(''));
            }
        }
    }

    // HandleSubmit is the handler to verify and send
    // the form to redux (redux send the info to backend)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        let arrayWayPay = [
            {wayPay: wayPay, bank: bank}
        ]

        setForm({
            ...form,
            valueNumber: total,
            wayPay: arrayWayPay,
            conceptTable: conceptTable
        })
        console.log(form)
    }

    const cancel = () => {
        setForm(initStateForm);
        setWayPay('');
        setBank('NO DEFINIDO');
        setModalBank(false);
        setConceptTable([]);
        setConcept('');
        setConceptDetail('');
        setConceptValue('');
        setTotal(0);
    }

    return (
        <div className={classes.root}>

            {/* ------- *Header --------- */}
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

            {/* ------- *Body ----------- */}
            <form onSubmit={(e) => handleSubmit(e)}>
                <Grid container spacing={3}>

                    {/* ----- Form: item **type ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <Select
                        name={texts.fields.type.name}
                        value = {form.type}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.fields.type.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e} 
                                    >
                                        {e}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.fields.type.helperText}</FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item **date ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        name = {texts.fields.date.name}
                        value = {form.date}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        type = 'date'
                        onChange = {handleChange}
                        helperText = {texts.fields.date.helperText}
                        />
                    </Grid>
                    
                    {/* ----- Form: item **serial ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        name = {texts.fields.serial.name}
                        value = {form.serial}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.fields.serial.helperText}
                        placeholder = {texts.fields.serial.placeholder}
                        />
                    </Grid>

                    {/* ----- Form: item **third ------*/}
                    <Grid item md={12} sm={6} xs={12}>
                        <Select
                        name={texts.fields.third.name}
                        value = {form.third}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.fields.third.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e._id} 
                                    >
                                        {e.enterpriceName}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.fields.third.helperText}</FormHelperText>
                    </Grid>

                    {/* ----- Form: item **class third ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <Select
                        name={texts.fields.classThird.name}
                        value = {form.classThird}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.fields.classThird.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.classThird} 
                                    >
                                        {e.classThird}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.fields.classThird.helperText}</FormHelperText>
                    </Grid>

                    {/* ----- Form: item **value in text ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <TextField
                        name = {texts.fields.valueText.name}
                        value = {form.valueText}
                        id = 'outlined-helperText'
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.fields.valueText.helperText}
                        placeholder = {texts.fields.valueText.placeholder}
                        />
                    </Grid>

                    {/* ----- Form: item **way pay ------*/}
                    <Grid item md={modalBank ? 4 : 8} sm={6} xs={12}>
                        <Select
                        name={texts.fields.wayPay.name}
                        value = {wayPay}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.fields.wayPay.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.fields.wayPay.helperText}</FormHelperText>
                    </Grid>
                    
                    {
                        // this section is visible if modal bank is true
                        // the logic for this is on HandleModalBank function ^
                        modalBank === true ?
                        <Grid item md={4} sm={6} xs={12}>
                            <Select
                            name={texts.fields.bank.name}
                            value = {bank}
                            variant = "outlined"
                            fullWidth
                            onChange={handleChangeSelect}
                            >
                                {
                                    texts.fields.bank.options.map((e, index) => 
                                        <MenuItem
                                        key={index} 
                                        value={e.numberAccount} 
                                        >
                                            {e.bank} - {e.numberAccount}
                                        </MenuItem>
                                        )
                                }
                            </Select>
                            <FormHelperText>
                                {
                                    form.type === 'INGRESO' 
                                    ?
                                    texts.fields.bank.helperTextIng 
                                    :
                                    texts.fields.bank.helperTextEgr
                                }
                            </FormHelperText>
                        </Grid>
                        :
                        ''
                    }

                    {/* ----- Form: button **help ------*/}
                    <Grid item md={4} sm={6} xs={12} className={classes.alignRight}>
                        <IconButton 
                        aria-label='Ayuda'
                        type="button"
                        >
                            <Help fontSize="large" color="secondary"/>
                        </IconButton>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                        <Typography
                        variant='h6'
                        >
                            {texts.body.subtitle}
                        </Typography>
                    </Grid>

                    <Grid item md={12} sm={12} xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>

                    {/* ----- Form: item **concepts table form: item ***concept ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <Select
                        name={texts.fields.concept.name}
                        value = {concept}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.fields.concept.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.concept} 
                                    >
                                        {e.concept}
                                    </MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>
                            {texts.fields.concept.helperText}
                        </FormHelperText>
                    </Grid>

                    {/* ----- Form: item **concepts table form: item ***value per concept ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                            name={texts.fields.conceptValue.name}
                            value = {conceptValue}
                            onChange={thousandSeparator}
                            fullWidth
                            variant = "outlined"
                            helperText = {texts.fields.conceptValue.helperText}
                            placeholder = {texts.fields.conceptValue.placeholder}
                        />
                    </Grid>

                    {/* ----- Form: item **concepts table form: item ***concept detail ------*/}
                    <Grid item md={8} sm={6} xs={12}>
                        <TextField
                        name = {texts.fields.conceptDetail.name}
                        value = {conceptDetail}
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.fields.conceptDetail.helperText}
                        placeholder = {texts.fields.conceptDetail.placeholder}
                        />
                    </Grid>

                    <Grid item md={4} sm={6} xs={12}>
                        <Button
                            variant="contained"
                            type="button"
                            color="primary"
                            size="large"
                            onClick={() => handleTable("PUSH")}
                            className={classes.addButton}
                            startIcon={<Save />}
                        >
                            {texts.fields.buttonAddConcept.title}
                        </Button>
                    </Grid>
                    
                    {/* ----- Form: item **concepts table rendering ------*/}
                    <Grid item md={12} sm={12} xs={12}>
                        <TableComponent rows={conceptTable} handleTable={handleTable}/>
                    </Grid>
                    
                    {/* ----- Form: item **total ------*/}
                    <Grid item md={4} sm={4} xs ={6}>
                        <Typography variant="h6">
                            <span>Total: </span>$ {total}
                        </Typography>
                    </Grid>

                    <Grid item md={12} sm={12} xs ={12} className={classes.alignRight}>
                        <IconButton
                        type="submit"
                        >
                            <NoteAdd fontSize={"large"} color="primary"/>
                        </IconButton>

                        <IconButton
                        onClick={cancel}
                        type="button"
                        >
                            <Cancel fontSize={"large"} color="secondary"/>
                        </IconButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

