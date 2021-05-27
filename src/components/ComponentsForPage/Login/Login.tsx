import React, { useState } from 'react';
import { useAppDispatch } from '../../../redux/store.hooks'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { login, LoginForm } from './login.splice';

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: '#fafafa',
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

// - in this part all the component texts are housed
const texts = {
    header: {
        title: 'Inicia sesión',
        logo: {
            path: '/images/logotipo-crecer-dmc.svg',
            alt: 'logotipo de crecer dmc'
        }
    },
    form: {
        field: {
            email: {
                name: 'email',
                label: 'Correo'
            },
            password: {
                name: 'password',
                label: 'Contraseña'
            },
            rememberCheck: {
                value: 'remember',
                label: 'Recordarme'
            },
            signinButton: {
                title: 'Entrar'
            }
        },
        footer: {
            forgotPasswordLink: 'Olvidaste tu contraseña?',
            createAccountLink: 'Aún no tienes un usuario?',
            copyright: 'CRECER DMC'
        }
    }
}

// ------------- Init state -----------
const initState: LoginForm = {
    email: '',
    password: ''
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                {texts.form.footer.copyright}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function SignIn() {

    const classes = useStyles();
    const dispatch = useAppDispatch();
    const [ form, setForm ] = useState<LoginForm>(initState);

    // HandleChange is the handler to update the state
    // of the form, while the user writes on an input.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setForm(prev => {
            (prev as any)[name] = value
            const newValue = {...prev}
            return newValue
        });
    }

    // HandleSubmit is the handler to verify and send
    // the form to redux (redux send the info to backend)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(login(form));
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>

                {/* ------- *Header --------- */}
                <Avatar className={classes.avatar}>
                    <img 
                        src={texts.header.logo.path} 
                        alt={texts.header.logo.alt}
                    />
                </Avatar>
                
                <Typography component="h1" variant="h5">
                    {texts.header.title}
                </Typography>

                {/* ------- *Body ----------- */}
                <form className={classes.form} noValidate onSubmit={(e) => handleSubmit(e)}>

                    {/* ----- Form: item **email ------*/}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                        id={texts.form.field.email.name}
                        label={texts.form.field.email.label}
                        name={texts.form.field.email.name}
                        autoComplete={texts.form.field.email.name}
                        autoFocus
                    />
                    
                    {/* ----- Form: item **password ------*/}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={handleChange}
                        name={texts.form.field.password.name}
                        label={texts.form.field.password.label}
                        type="password"
                        id={texts.form.field.password.name}
                        autoComplete="current-password"
                    />

                    {/* ----- Form: item **remember check ------*/}
                    <FormControlLabel
                        control={<Checkbox value={texts.form.field.rememberCheck.value} color="primary" />}
                        label={texts.form.field.rememberCheck.label}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {texts.form.field.signinButton.title}
                    </Button>
                    
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                {texts.form.footer.forgotPasswordLink}
                            </Link>
                        </Grid>
                        
                        <Grid item>
                            <Link href="#" variant="body2">
                                {texts.form.footer.createAccountLink}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>

            <Box mt={8}>
                <Copyright />
            </Box>
        
        </Container>
    );
}