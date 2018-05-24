import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router'

import List, { ListItem, ListItemIcon, ListItemText, ListSubheader } from 'material-ui/List'

import { setUser } from '../store/actions'
import API from './API'
import MdIcon from './MdIcon'
import FinanceSvg from 'mdi-svg/svg/finance.svg'
import LogsSvg from 'mdi-svg/svg/file-outline.svg'
import DuplicateSvg from 'mdi-svg/svg/content-duplicate.svg'
import LoginSvg from 'mdi-svg/svg/login.svg'

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
    const { classes, svg, text } = this.props
    return (
      <ListSubheader className={classes.root}>
        <MdIcon svg={svg} className={classes.icon} />
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
    this.props.history.push(path)
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
              <ListHeader text='Reports' svg={FinanceSvg} />
              <ListItem button>
                <ListItemText primary='SSP - Ad Server' />
              </ListItem>
              <ListItem button onClick={this.navTo('/report')}>
                <ListItemText primary='Tag Report' />
              </ListItem>
              <ListItem button>
                <ListItemText primary='Discrepancy' />
              </ListItem>
              <ListHeader text='Legacy' svg={DuplicateSvg} />
              <ListItem button onClick={this.navTo('/legacy')}>
                <ListItemText primary='Tag Generator' />
              </ListItem>
              <ListItem button onClick={this.navTo('/legacy')}>
                <ListItemText primary='Duplicate' />
              </ListItem>
              <ListHeader text='Logs' svg={LogsSvg} />
              <ListItem button>
                <ListItemText primary='Activity' />
              </ListItem>
              <ListItem button onClick={this.navTo('/logs')}>
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
                  <MdIcon svg={LoginSvg} className={classes.listIcon} />
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
