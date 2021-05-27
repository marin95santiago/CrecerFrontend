import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../../redux/store';
import jwtDecoded from 'jwt-decode';
import Cookie from 'js-cookie';

// interface for the login form
export interface LoginForm {
    email: string,
    password: string
}

type StateComponent = {
    token?: string
    user?: User
    loading: boolean
    done: boolean
}

type User = {
    _id: string
    isAdmin: boolean
    email: string
    name: string
    lastName: string
    enterprice: string
    idEnterprice: string
    entidad: string
    idEntidad: string
}

// the init state from the reducer
const initialState: StateComponent = {
    token: Cookie.getJSON('token') || null,
    user: Cookie.getJSON('user') || null,
    loading: false,
    done: false
}

// this code makes the fetch to the API crecer
// with the route for the login
export const login = createAsyncThunk(
    'login/fetch',
    async (form: LoginForm) => {
        // on the package.json there is a proxy configuration
        // with the local host from the API crecer (host: 5000)
        return fetch('/api/user/login', {
            method: 'POST',
            mode: 'cors',
            redirect: 'error',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(form)

        }).then((res) => 
            res.json()

        ).catch((error) => {
            console.log(error.message)
        });
    }
);

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                // this code save and decoded the token
                if(action.payload){
                    (state.token as any) = action.payload
                    state.user = jwtDecoded(action.payload)
                    state.done = true
                    state.loading = false

                    Cookie.set('token', JSON.stringify(action.payload));
                    Cookie.set('user', JSON.stringify(jwtDecoded(action.payload)));
                } 
            });
    }
});

export const loginSelector = (state: RootState) => state.login;

export default loginSlice.reducer