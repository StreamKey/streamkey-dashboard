import React from 'react'
import Route from 'react-router-dom/Route'
import Switch from 'react-router-dom/Switch'
import { Provider } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import CssBaseline from 'material-ui/CssBaseline'
import { withStyles } from 'material-ui/styles'

import Home from './pages/Home'
import Login from './pages/Login'
import Theme from './Theme'

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
  componentDidMount() {
    document.getElementById('root').classList.remove('hidden')
  }

  render() {
    const { classes } = this.props
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={Theme}>
          <CssBaseline />
          <div className={classes.root}>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </div>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default withStyles(styles)(App)
