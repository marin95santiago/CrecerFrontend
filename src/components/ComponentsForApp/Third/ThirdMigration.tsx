import React, { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Divider, FormHelperText, Grid, IconButton, MenuItem, Select, Typography } from '@material-ui/core';
import { NoteAdd } from '@material-ui/icons';

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
    contentAside: {
        textAlign: 'right',
        padding: '5vh 5vh 0 10vh'
    },
    alignRight: {
        textAlign: 'right',
    },
}));

// - in this part all the component texts are housed
const texts = {
    header: {
        title: 'Migrar terceros'
    },
    body: {
        field: {
            lastThird: {
                name: 'lastThird',
                helperText: 'Escoja el tercero a migrar',
                options: [
                    {
                        id: '12',
                        name: 'Pedro',
                        secondName: 'Alfonso',
                        lastName: 'Marin'
                    },
                    {
                        id: '13',
                        companyName: 'Electrosuaza ltda'
                    }
                ]
            },
            newThird: {
                name: 'newThird',
                helperText: 'Escoja el nuevo tercero',
                options: [
                    {
                        id: '12',
                        name: 'Pedro',
                        secondName: 'Alfonso',
                        lastName: 'Marin'
                    },
                    {
                        id: '13',
                        companyName: 'Electrosuaza ltda'
                    }
                ]
            }
        },
        aside: {
            title: 'Necesitas ayuda?',
            content: 'La migración de terceros es la manera de transferir los recibos y demás registros de un tercero a otro tercero. Esto te será útil en caso de querer unificar un tercero que tengas duplicado.'
        }
    }
}

// ------------- Init state -----------
const initStateForm = {
    lastThird: '',
    newThird: ''
}

export default function ThirdMigration() {

    const classes = useStyles();

    const [ form, setForm ] = useState(initStateForm);
    const [ newThirdOptions, setNewThirdOptions ] = useState(texts.body.field.lastThird.options);

    // HandleChange is the handler to update the state
    // of the form, while the user change the options 
    // on an input select.
    const handleChangeSelect = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const name = event.target.name as string;

        // this code removes the option slected on the lastThird
        // from the third array, with this if the user wants to
        // transfer from one third to another the new options will
        // be the other thirds.
        if(name === 'lastThird'){
            let res = texts.body.field.lastThird.options.filter(e => e.id !== event.target.value);
            setNewThirdOptions(res);
        }

        setForm({
            ...form,
            [name]: event.target.value,
        });
    }

    // HandleSubmit is the handler to verify and send
    // the form to redux (redux send the info to backend)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
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
            <Grid container spacing={5}>
                <Grid item md={7} sm={12} xs={12}>

                    <form onSubmit={(e) => handleSubmit(e)}>
                        <Grid container spacing={3}>
                            {/* ----- Form: item last thrid ------*/}
                            <Grid item md={12} sm={12} xs={12}>
                                <Select
                                name={texts.body.field.lastThird.name}
                                value = {form.lastThird}
                                variant = "outlined"
                                fullWidth
                                onChange={handleChangeSelect}
                                >
                                    {
                                        texts.body.field.lastThird.options.map((e, index) => 
                                            <MenuItem
                                            key={index} 
                                            value={e.id}
                                            >
                                                {
                                                    // if the third has a name, it will show it
                                                    // else it will show the company name
                                                    e.name 
                                                    ? 
                                                        `${e.name} ${e.secondName} ${e.lastName}`
                                                    : 
                                                        e.companyName
                                                }
                                            </MenuItem>
                                            )
                                    }
                                </Select>
                                <FormHelperText>{texts.body.field.lastThird.helperText}</FormHelperText>
                            </Grid>

                            {/* ----- Form: item new thrid ------*/}
                            <Grid item md={12} sm={12} xs={12}>
                                <Select
                                name={texts.body.field.newThird.name}
                                value = {form.newThird}
                                variant = "outlined"
                                fullWidth
                                onChange={handleChangeSelect}
                                >
                                    {
                                        newThirdOptions.map((e, index) =>
                                            <MenuItem
                                            key={index} 
                                            value={e.id}
                                            >
                                                {
                                                    // if the third has a name, it will show it
                                                    // else it will show the company name
                                                    e.name 
                                                    ? 
                                                        `${e.name} ${e.secondName} ${e.lastName}`
                                                    : 
                                                        e.companyName
                                                }
                                            </MenuItem>
                                            )
                                    }
                                </Select>
                                <FormHelperText>{texts.body.field.newThird.helperText}</FormHelperText>
                            </Grid>
                            
                            <Grid item md={12} sm={6} xs ={12} className={classes.alignRight}>
                                <IconButton
                                type="submit"
                                >
                                    <NoteAdd fontSize={"large"} color="primary"/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </form>

                </Grid>

                {/* ------------ Aside -----------------*/}
                <Grid md={5} sm={12} xs={12} className={classes.contentAside}>
                    <Typography color='primary' variant='h6'>{texts.body.aside.title}</Typography>
                    <Typography variant='body2'>{texts.body.aside.content}</Typography>
                </Grid>
            </Grid>
        </div>
    )
}
