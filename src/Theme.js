import { createMuiTheme } from 'material-ui/styles'
import red from 'material-ui/colors/red'
import green from 'material-ui/colors/green'
import grey from 'material-ui/colors/grey'

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
