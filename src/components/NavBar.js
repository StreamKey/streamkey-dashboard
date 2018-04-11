import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router'

import { Link } from 'react-router-dom'
import Button from 'material-ui/Button'
import Menu, { MenuItem } from 'material-ui/Menu'

import { setUser } from '../store/actions'
import API from './API'
import MdIcon from './MdIcon'
import AccountSvg from 'mdi-svg/svg/account.svg'
import LogoutSvg from 'mdi-svg/svg/logout.svg'
import Logo from '../assets/streamkey-logo-horizontal.png'

const styles = theme => {
  return {
    root: {
      backgroundColor: theme.palette.custom.greyDark
    },
    container: {
      paddingLeft: theme.spacing.triple,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      '&[with-border=true]': {
        borderBottom: '1px solid ' + theme.palette.divider
      },
      ...theme.utils.container
    },
    title: {
      ...theme.typography.title,
      textDecoration: 'none'
    },
    logo: {
      maxHeight: 60,
      height: '100%',
      width: 'auto'
    },
    buttonsPlaceholder: {
      minHeight: 69
    },
    menuIcon: {
      fill: theme.palette.grey[600],
      marginLeft: theme.spacing.unit
    },
    menuItemIcon: {
      fill: theme.palette.grey[900],
      marginRight: theme.spacing.unit
    }
  }
}

const buttonStyles = theme => {
  return {
    root: {
      color: theme.palette.custom.greyLight,
      padding: theme.spacing.unit,
      paddingTop: theme.spacing.triple,
      paddingBottom: theme.spacing.triple,
      textTransform: 'none',
      borderBottom: '2px solid transparent',
      borderRadius: 0,
      '&:hover': {
        color: theme.palette.common.white,
        borderBottom: '2px solid ' + theme.palette.custom.greyLight,
        backgroundColor: 'transparent'
      },
      '&:hover svg': {
        fill: theme.palette.grey[900]
      }
    }
  }
}
const StyledButton = withStyles(buttonStyles)(Button)

class NavBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: true,
      isMenuOpen: false,
      anchorEl: null
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

  openMenu = e => {
    this.setState({
      ...this.state,
      isMenuOpen: true,
      anchorEl: e.currentTarget
    })
  }

  closeMenu = () => {
    this.setState({
      ...this.state,
      isMenuOpen: false,
      anchorEl: null
    })
  }

  navTo = path => () => {
    this.props.history.push(path)
  }

  logout = async () => {
    this.closeMenu()
    try {
      await API.get('/logout')
    } catch (e) {
    }
    this.props.setUser({ id: null })
    this.props.history.push('/')
  }

  render () {
    const { classes } = this.props
    let userName = this.props.user.name || this.props.user.email || ''
    if (userName.length > 20) {
      userName = userName.slice(0, 20) + '…'
    }
    return (
      <div className={classes.root}>
        <div className={classes.container} with-border={this.props.withBorder ? 'true' : 'false'}>
          <Link className={classes.title} to='/'>
            <img className={classes.logo} src={Logo} alt='StreamKey Logo' />
          </Link>
          {
            this.state.isLoading && <div className={classes.buttonsPlaceholder}>&nbsp;</div>
          }
          {
            !this.state.isLoading && this.props.user.id &&
            <div className={classes.user}>
              <StyledButton onClick={this.openMenu}>
                {userName}
                <MdIcon svg={AccountSvg} className={classes.menuIcon} />
              </StyledButton>
              <Menu
                open={this.state.isMenuOpen}
                onClose={this.closeMenu}
                anchorEl={this.state.anchorEl}
                transitionDuration={0}
              >
                <MenuItem onClick={this.logout}>
                  <MdIcon svg={LogoutSvg} className={classes.menuItemIcon} />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          }
          {
            !this.state.isLoading && !this.props.user.id &&
            <div>
              <StyledButton to='/login' component={Link}>
                Login
              </StyledButton>
            </div>
          }
        </div>
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
