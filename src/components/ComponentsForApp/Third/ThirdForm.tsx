import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { 
    Checkbox, 
    Divider, 
    FormControlLabel, 
    FormHelperText,
    Grid, 
    IconButton, 
    MenuItem, 
    Select, 
    TextField, 
    Typography 
} from '@material-ui/core';
import { Third } from './third.slice';
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
    },
    thirdClassTitle: {
        color: '#757575',
        marginBottom: '6vh'
    }
}));

// - in this part all the component texts are housed
const texts = {
    header: {
        title: 'Crear terceros'
    },
    body: {
        field: {
            thirdType: {
                name: 'thirdType',
                helperText: 'Escoja un tipo de persona',
                options: [
                    {title: 'Natural', value: 'NATURAL'},
                    {title: 'Jurídica', value: 'JURIDICA'}
                ]
            },
            documentType: {
                name: 'documentType',
                helperText: 'Escoja el tipo de documento',
                options: {
                    one: [
                        {title: 'Cédula de ciudadanía', value: 'C.C'},
                        {title: 'Pasaporte', value: 'PASAPORTE'},
                        {title: 'Documento extranjero', value: 'DOCUMENTO EXTRANJERO'}
                    ],
                    two: [
                        {title: 'N.I.T', value: 'NIT'}
                    ]
                }
            },
            documentNumber: {
                name: 'documentNumber',
                helperText: 'Escriba el número de documento',
                placeholder: 'Documento'
            },
            thirdName: {
                one: {
                    name: {
                        name: 'thirdName',
                        helperText: 'Escriba el primer nombre de la persona',
                        placeholder: 'Nombre'
                    },
                    secondName: {
                        name: 'thirdSecondName',
                        helperText: 'Escriba el segundo nombre de la persona',
                        placeholder: 'Segundo nombre'
                    },
                    lastName: {
                        name: 'thirdLastName',
                        helperText: 'Escriba el apellido de la persona',
                        placeholder: 'Apellido(s)'
                    }
                },
                two: {
                    companyName: {
                        name: 'companyName',
                        helperText: 'Escriba el nombre de la empresa',
                        placeholder: 'Razón social'
                    }
                }
            },
            thirdClass: {
                name: 'thirdClass',
                helperText: 'Escoja una o más clases para el tercero',
                options: [
                    {title: 'Proveedor', value: 'PROVEEDOR'},
                    {title: 'Cliente', value: 'CLIENTE'}
                ]
            },
            email: {
                name: 'thirdPartyEmail',
                helperText: 'Escriba el email del tercero',
                placeholder: 'Email'
            },
            phone: {
                name: 'thirdPartyPhone',
                helperText: 'Escriba el número telefónico del tercero',
                placeholder: 'Número telefónico'
            },
            address: {
                name: 'thirdPartyAddress',
                helperText: 'Escriba la dirección del tercero',
                placeholder: 'Dirección'
            },
        }
    }
}

// ------------- Init state -----------
const initStateForm: Third = {
    thirdType: '',
    documentType: '',
    documentNumber: '',
    thirdName: undefined,
    thirdSecondName: undefined,
    thirdLastName: undefined,
    companyName: undefined,
    thirdClass: [],
    thirdPartyEmail: undefined,
    thirdPartyAddress: undefined,
    thirdPartyPhone: undefined
}

export default function ThirdForm() {

    const classes = useStyles();

    const [ form, setForm ] = useState<Third>(initStateForm);

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
    // of the form, while the user writes on an input.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setForm(prev => {
            (prev as any)[name] = value
            const newValue = {...prev}
            return newValue
        })
    }

    // HandleCheckbox is the handler to update the state
    // of the form, while the user select the options on 
    // a third class input.
    const handleCheckBox = (e: React.ChangeEvent<HTMLInputElement>) => {
        let array = form.thirdClass
        if(e.target.checked === true){
            array.push(e.target.value);
        } else {
            array = array.filter(option => option !== e.target.value);
        }

        setForm({
            ...form,
            thirdClass: array
        })
    }

    // HandleSubmit is the handler to verify and send
    // the form to redux (redux send the info to backend)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
    }

    const cancel = () => {
        setForm(initStateForm);
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

                    {/* ----- Form: item thrid type ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <Select
                        name={texts.body.field.thirdType.name}
                        value = {form.thirdType}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                texts.body.field.thirdType.options.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                    )
                            }
                        </Select>
                        <FormHelperText>{texts.body.field.thirdType.helperText}</FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item document type ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <Select
                        name={texts.body.field.documentType.name}
                        value = {form.documentType}
                        variant = "outlined"
                        fullWidth
                        onChange={handleChangeSelect}
                        >
                            {
                                // this will depend of thirdType field
                                form.thirdType === texts.body.field.thirdType.options[0].value ?
                                texts.body.field.documentType.options.one.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                )
                                :
                                texts.body.field.documentType.options.two.map((e, index) => 
                                    <MenuItem
                                    key={index} 
                                    value={e.value} 
                                    >
                                        {e.title}
                                    </MenuItem>
                                )
                            }
                        </Select>
                        <FormHelperText>{texts.body.field.thirdType.helperText}</FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item document number ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        required={true}
                        name = {texts.body.field.documentNumber.name}
                        value = {form.documentNumber}
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.body.field.documentNumber.helperText}
                        placeholder = {texts.body.field.documentNumber.placeholder}
                        />
                    </Grid>
                    
                    {
                        /*
                        In this section the name, secondName, lastName and companyName
                        fields are conditioned to the thirdType field.
                        If typeThird field is NATURAL then the name, secondName and lastName
                        fields will be availabe while companyName field will be unavailable,
                        else if typeThird field is JURIDICA then the companyName field will
                        be available while the name, secondName and lastName fields will be
                        unavailable
                        */

                        form.thirdType === 'NATURAL'
                        ?
                        <React.Fragment>
                            <Grid item md={4} sm={6} xs={12}>
                                <TextField
                                required={true}
                                name = {texts.body.field.thirdName.one.name.name}
                                value = {form.thirdName}
                                variant = 'outlined'
                                fullWidth
                                onChange= {handleChange}
                                helperText = {texts.body.field.thirdName.one.name.helperText}
                                placeholder = {texts.body.field.thirdName.one.name.placeholder}
                                />
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <TextField
                                name = {texts.body.field.thirdName.one.secondName.name}
                                value = {form.thirdSecondName}
                                variant = 'outlined'
                                fullWidth
                                onChange= {handleChange}
                                helperText = {texts.body.field.thirdName.one.secondName.helperText}
                                placeholder = {texts.body.field.thirdName.one.secondName.placeholder}
                                />
                            </Grid>
                            <Grid item md={4} sm={6} xs={12}>
                                <TextField
                                required={true}
                                name = {texts.body.field.thirdName.one.lastName.name}
                                value = {form.thirdLastName}
                                variant = 'outlined'
                                fullWidth
                                onChange= {handleChange}
                                helperText = {texts.body.field.thirdName.one.lastName.helperText}
                                placeholder = {texts.body.field.thirdName.one.lastName.placeholder}
                                />
                            </Grid>
                        </React.Fragment>
                        :
                        <Grid item md={12} sm={6} xs={12}>
                            <TextField
                            required={true}
                            name = {texts.body.field.thirdName.two.companyName.name}
                            value = {form.companyName}
                            variant = 'outlined'
                            fullWidth
                            onChange= {handleChange}
                            helperText = {texts.body.field.thirdName.two.companyName.helperText}
                            placeholder = {texts.body.field.thirdName.two.companyName.placeholder}
                            />
                        </Grid>
                    }

                    {/* ----- Form: item third class ------*/}
                    <Grid item md={12} sm={12} xs={12}>
                        {
                            texts.body.field.thirdClass.options.map((e, index) => (
                                <React.Fragment key={index}>
                                    <FormControlLabel 
                                    control={
                                        <Checkbox
                                        name={e.title}
                                        value={e.value}
                                        onChange={handleCheckBox}
                                        />
                                    }
                                    label={e.title}
                                    />
                                </React.Fragment>
                            ))
                        }
                        <FormHelperText>
                            {texts.body.field.thirdClass.helperText}
                        </FormHelperText>
                    </Grid>
                    
                    {/* ----- Form: item email ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        name = {texts.body.field.email.name}
                        value = {form.thirdPartyEmail}
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.body.field.email.helperText}
                        placeholder = {texts.body.field.email.placeholder}
                        />
                    </Grid>
                        
                    {/* ----- Form: item phone ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        name = {texts.body.field.phone.name}
                        value = {form.thirdPartyPhone}
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.body.field.phone.helperText}
                        placeholder = {texts.body.field.phone.placeholder}
                        />
                    </Grid>
                        
                    {/* ----- Form: item address ------*/}
                    <Grid item md={4} sm={6} xs={12}>
                        <TextField
                        name = {texts.body.field.address.name}
                        value = {form.thirdPartyAddress}
                        variant = 'outlined'
                        fullWidth
                        onChange= {handleChange}
                        helperText = {texts.body.field.address.helperText}
                        placeholder = {texts.body.field.address.placeholder}
                        />
                    </Grid>
                    
                    <Grid item md={12} sm={6} xs ={12} className={classes.alignRight}>
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
