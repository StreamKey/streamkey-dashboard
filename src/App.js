import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import moment from 'moment'
import CssBaseline from 'material-ui/CssBaseline'
import { withStyles } from 'material-ui/styles'

import Report from './pages/Report'
import Login from './pages/Login'
import Logs from './pages/Logs'
import DuplicateLkqdSupplyTremor from './pages/DuplicateLkqdSupplyTremor'
import Theme from './Theme'
import ErrorBoundary from './components/ErrorBoundary'

import store from './store'
import './styles.css'

const styles = theme => {
  return {
    root: {
      height: '100%'
    }
  }
}

class App extends React.Component {
  componentDidMount () {
    document.getElementById('root').classList.remove('hidden')
  }

  render () {
    const { classes } = this.props
    return (
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
          <MuiThemeProvider theme={Theme}>
            <CssBaseline />
            <div className={classes.root}>
              <ErrorBoundary>
                <Switch>
                  <Route exact path='/' component={Login} />
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/admin' component={Report} />
                  <Route exact path='/report' component={Report} />
                  <Route exact path='/logs' component={Logs} />
                  <Route exact path='/duplicate-lkqd-supply-tremor' component={DuplicateLkqdSupplyTremor} />
                </Switch>
              </ErrorBoundary>
            </div>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    )
  }
}

export default withStyles(styles)(App)
