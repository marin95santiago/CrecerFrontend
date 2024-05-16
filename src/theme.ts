import { createMuiTheme } from '@material-ui/core/styles';
import {
    deepOrange,
    lightBlue,
} from '@material-ui/core/colors'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: lightBlue[400]
        },
        secondary: {
            main: deepOrange['A400']
        }
    }
});

export default theme