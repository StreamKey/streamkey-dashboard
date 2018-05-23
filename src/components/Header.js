import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from 'material-ui/styles'
import { withRouter } from 'react-router'

import { Link } from 'react-router-dom'
import IconButton from 'material-ui/IconButton'

import { setUser } from '../store/actions'
import API from './API'
import MdIcon from './MdIcon'
import LeftCaretSvg from 'mdi-svg/svg/menu-left.svg'
import RightCaretSvg from 'mdi-svg/svg/menu-right.svg'
import Logo from '../assets/streamkey-logo-horizontal.png'

const styles = theme => {
  return {
    root: {
      backgroundColor: theme.palette.custom.greyDark,
      height: theme.spacing.big,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    leftSideContainer: {
      height: '100%',
      display: 'inline-flex',
      alignItems: 'center'
    },
    logoContainer: {
      ...theme.typography.logoContainer,
      textDecoration: 'none',
      height: '100%',
      width: theme.spacing.huge * 1.25,
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing.double
    },
    logo: {
      height: '100%',
      width: 'auto',
      objectFit: 'contain'
    },
    headerToggler: {
      color: theme.palette.grey[500]
    },
    user: {
      fontSize: 12,
      color: theme.palette.grey[500],
      padding: theme.spacing.double
    }
  }
}

class Header extends React.Component {
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

  render () {
    const { classes, className, hideNavbar, toggleNavbar } = this.props
    let userName = this.props.user.name || this.props.user.email || ''
    if (userName.length > 20) {
      userName = userName.slice(0, 20) + '…'
    }
    return (
      <div className={`${classes.root} ${className}`}>
        <div className={classes.leftSideContainer}>
          <Link className={classes.logoContainer} to='/'>
            <img className={classes.logo} src={Logo} alt='StreamKey Logo' />
          </Link>
          <IconButton className={classes.headerToggler} onClick={toggleNavbar}>
            <MdIcon svg={hideNavbar ? RightCaretSvg : LeftCaretSvg} />
          </IconButton>
        </div>
        {
          this.state.isLoading && <div />
        }
        {
          !this.state.isLoading && this.props.user.id &&
          <div className={classes.user}>
            {userName}
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

const connectedHeader = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)

export default withRouter(withStyles(styles)(connectedHeader))
