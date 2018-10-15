import { createMuiTheme } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/green'
import grey from '@material-ui/core/colors/grey'

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: '#38bec3'
      // light
      // dark
      // contrastText
    },
    secondary: {
      main: '#A7DBD8'
    },

    red,
    green,
    grey,
    custom: {
      grey: '#BCBCBC',
      greyLight: '#E9E9E9',
      greyDark: '#424242',
      greenYellowLight: '#E0E4CC',

      red: '#e53935',
      green: '#4caf50'
    }
  },
  spacing: {
    half: 4,
    unit: 8,
    double: 16,
    triple: 24,
    quad: 32,
    big: 64,
    huge: 128
  },
  typography: {
    useNextVariants: true
  },
  utils: {
    container: {
      maxWidth: 960,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
})

export default Theme
