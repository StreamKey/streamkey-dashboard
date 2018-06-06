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

import TagReport from './pages/TagReport'
import SspAsReport from './pages/SspAsReport'
import Login from './pages/Login'
import Logs from './pages/Logs'
import TagGenerator from './pages/TagGenerator'
import DuplicateTremorLkqd from './pages/DuplicateTremorLkqd'
import ComingSoon from './pages/ComingSoon'
import Theme from './Theme'
import Header from './components/Header'
import NavBar from './components/NavBar'
import ErrorBoundary from './components/ErrorBoundary'

import store from './store'
import './styles.css'

const styles = () => {
  return {
    root: {
      height: '100%',
      display: 'grid',
      gridTemplateRows: `${Theme.spacing.big}px auto`,
      gridTemplateColumns: `${Theme.spacing.huge * 1.25}px auto`,
      gridTemplateAreas: `
        "header header"
        "navbar page"
      `,
      '&[navclosed]': {
        gridTemplateAreas: `
          "header header"
          "page page"
        `
      }
    },
    header: {
      gridArea: 'header'
    },
    navbar: {
      gridArea: 'navbar'
    },
    page: {
      gridArea: 'page',
      overflowY: 'scroll',
      overflowX: 'hidden'
    }
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hideNavbar: false
    }
  }

  componentDidMount () {
    document.getElementById('root').classList.remove('hidden')
  }

  toggleNavbar = () => {
    this.setState({
      ...this.state,
      hideNavbar: !this.state.hideNavbar
    })
  }

  render () {
    const { classes } = this.props
    const { hideNavbar } = this.state
    return (
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={MomentUtils} moment={moment}>
          <MuiThemeProvider theme={Theme}>
            <CssBaseline />
            <ErrorBoundary>
              <div className={classes.root} navclosed={hideNavbar ? 'true' : false}>
                <Header
                  className={classes.header}
                  hideNavbar={hideNavbar}
                  toggleNavbar={this.toggleNavbar}
                />
                {
                  !hideNavbar && <NavBar className={classes.navbar} />
                }
                <div className={classes.page}>
                  <Switch>
                    <Route exact path='/' component={Login} />
                    <Route exact path='/login' component={Login} />
                    <Route exact path='/admin' component={TagReport} />
                    <Route exact path='/ssp-adserver' component={SspAsReport} />
                    <Route exact path='/tag-report' component={TagReport} />
                    <Route exact path='/discrepancy' component={ComingSoon} />
                    <Route exact path='/tag-generator' component={TagGenerator} />
                    <Route exact path='/duplicate-tremor-lkqd' component={DuplicateTremorLkqd} />
                    <Route exact path='/logs' component={Logs} />
                    <Route exact path='/logs/errors' component={Logs} />
                    <Route exact path='/logs/activity' component={ComingSoon} />
                  </Switch>
                </div>
              </div>
            </ErrorBoundary>
          </MuiThemeProvider>
        </MuiPickersUtilsProvider>
      </Provider>
    )
  }
}

export default withStyles(styles)(App)
