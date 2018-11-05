import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import { Provider } from 'react-redux'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import MomentUtils from 'material-ui-pickers/utils/moment-utils'
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider'
import moment from 'moment'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'

import TagReport from './pages/TagReport'
import SspAsReport from './pages/SspAsReport'
import DiscrepancyReport from './pages/DiscrepancyReport'
import RedirectToYesterday from './pages/RedirectToYesterday'
import Login from './pages/Login'
import Logs from './pages/Logs'
import TagGenerator from './pages/TagGenerator'
import DuplicateTremorLkqd from './pages/DuplicateTremorLkqd'
import Thresholds from './pages/Thresholds'
import CleanBL from './pages/CleanBL'
import Scripts from './pages/Scripts'
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
              <div className={classes.root} navclosed={hideNavbar === true ? 'true' : undefined}>
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
                    <Route exact path='/ssp-adserver' component={RedirectToYesterday} />
                    <Route exact path='/ssp-adserver/:date' component={SspAsReport} />
                    <Route exact path='/tag-report' component={RedirectToYesterday} />
                    <Route exact path='/tag-report/:date' component={TagReport} />
                    <Route exact path='/discrepancy' component={RedirectToYesterday} />
                    <Route exact path='/discrepancy/:date' component={DiscrepancyReport} />
                    <Route exact path='/tag-generator' component={TagGenerator} />
                    <Route exact path='/duplicate-tremor-lkqd' component={DuplicateTremorLkqd} />
                    <Route exact path='/thresholds' component={Thresholds} />
                    <Route exact path='/clean-bl' component={CleanBL} />
                    <Route exact path='/scripts' component={Scripts} />
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
