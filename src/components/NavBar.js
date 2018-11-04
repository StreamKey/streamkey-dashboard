import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'

import { setUser } from '../store/actions'
import API from './API'
import LoginSvg from 'mdi-material-ui/Login'

const styles = theme => {
  return {
    root: {
      backgroundColor: theme.palette.custom.greyLight,
      overflowX: 'hidden'
    },
    nav: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      height: '100%',
      width: '100%',
      padding: 0
    },
    list: {
      width: '100%'
    }
  }
}

const listHeaderStyles = theme => {
  return {
    root: {
      color: theme.palette.grey[500],
      fontWeight: 400,
      lineHeight: `${theme.spacing.quad}px`,
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      display: 'flex',
      alignItems: 'center',
      '&:not(:first-of-type)': {
        marginTop: theme.spacing.double
      }
    },
    icon: {
      fill: theme.palette.grey[500],
      marginRight: theme.spacing.unit,
      height: theme.spacing.double,
      width: theme.spacing.double
    }
  }
}
class BaseListHeader extends React.PureComponent {
  render () {
    const { classes, text } = this.props
    return (
      <ListSubheader className={classes.root}>
        {text}
      </ListSubheader>
    )
  }
}
const ListHeader = withStyles(listHeaderStyles)(BaseListHeader)

class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  componentDidMount () {
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn = async () => {
    // null = unknown, false = known to be false
    if (this.props.user.id === null) {
      try {
        const response = await API.get('/profile')
        this.props.setUser(response.data.user)
      } catch (e) {
        this.props.setUser({ id: false })
        // Not logged in
      }
    }
    this.setState({
      ...this.state,
      isLoading: false
    })
  }

  navTo = path => () => {
    if (path.endsWith('/:date')) {
      const re = /^\/(?:discrepancy|ssp-adserver|tag-report)\/(\d+-\d+-\d+)$/ig
      const matches = re.exec(this.props.location.pathname)
      if (matches) {
        this.props.history.push(path.replace(':date', matches[1]))
      } else {
        this.props.history.push(path.replace('/:date', ''))
      }
    } else {
      this.props.history.push(path)
    }
  }

  logout = async () => {
    try {
      await API.get('/logout')
    } catch (e) {
    }
    this.props.setUser({ id: null })
    this.props.history.push('/')
  }

  render () {
    const { classes, className } = this.props
    let userName = this.props.user.name || this.props.user.email || ''
    if (userName.length > 20) {
      userName = userName.slice(0, 20) + '…'
    }
    return (
      <div className={`${classes.root} ${className}`}>
        {
          this.state.isLoading && <div />
        }
        {
          !this.state.isLoading && this.props.user.id &&
          <div className={classes.nav}>
            <List className={classes.list} component='nav' dense>
              <ListHeader text='Reports' />
              <ListItem button onClick={this.navTo('/ssp-adserver/:date')}>
                <ListItemText primary='SSP - Ad Server' />
              </ListItem>
              <ListItem button onClick={this.navTo('/tag-report/:date')}>
                <ListItemText primary='Tag Report' />
              </ListItem>
              <ListItem button onClick={this.navTo('/discrepancy/:date')}>
                <ListItemText primary='Discrepancy' />
              </ListItem>
              <ListHeader text='Automation' />
              <ListItem button onClick={this.navTo('/tag-generator')}>
                <ListItemText primary='Tag Generator' />
              </ListItem>
              <ListItem button onClick={this.navTo('/duplicate-tremor-lkqd')}>
                <ListItemText primary='Duplicate' />
              </ListItem>
              <ListItem button onClick={this.navTo('/configuration-ui')}>
                <ListItemText primary='Configuration UI' />
              </ListItem>
              <ListItem button onClick={this.navTo('/clean-bl')}>
                <ListItemText primary='Clean BL' />
              </ListItem>
              <ListItem button onClick={this.navTo('/scripts')}>
                <ListItemText primary='Scripts' />
              </ListItem>
              <ListHeader text='Logs' />
              <ListItem button onClick={this.navTo('/logs/activity')}>
                <ListItemText primary='Activity' />
              </ListItem>
              <ListItem button onClick={this.navTo('/logs/errors')}>
                <ListItemText primary='Errors' />
              </ListItem>
            </List>
            <List className={classes.list} component='nav' dense>
              <ListItem button onClick={this.logout}>
                <ListItemText primary='Logout' />
              </ListItem>
            </List>
          </div>
        }
        {
          !this.state.isLoading && !this.props.user.id &&
          <div>
            <List className={classes.list} component='nav' dense>
              <ListItem button onClick={this.navTo('/login')}>
                <ListItemIcon>
                  <LoginSvg className={classes.listIcon} />
                </ListItemIcon>
                <ListItemText primary='Login' />
              </ListItem>
            </List>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setUser (user) {
      dispatch(setUser(user))
    }
  }
}

const connectedNavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar)

export default withRouter(withStyles(styles)(connectedNavBar))
