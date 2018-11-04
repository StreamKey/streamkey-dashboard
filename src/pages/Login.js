import React from 'react'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { setUser } from '../store/actions'
import API from '../components/API'

const styles = theme => {
  return {
    root: {
      ...theme.utils.container,
      maxWidth: theme.breakpoints.values.sm,
      padding: theme.spacing.double
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing.quad
    },
    textField: {
      width: '100%',
      maxWidth: 300,
      marginBottom: theme.spacing.double
    },
    button: {
      marginTop: theme.spacing.double
    },
    error: {
      color: theme.palette.custom.red,
      marginTop: theme.spacing.double,
      marginBottom: theme.spacing.double
    },
    success: {
      color: theme.palette.custom.green,
      fontSize: 14,
      fontWeight: 500,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.quad,
      '& svg': {
        marginRight: theme.spacing.unit
      }
    },
    secondaryContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    },
    secondary: {
      color: theme.palette.grey[600],
      fontSize: 12,
      fontWeight: 300,
      textDecoration: 'none',
      margin: theme.spacing.double
    }
  }
}

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isVerifying: true,
      showVerificationSuccess: false,
      email: '',
      password: '',
      isLoading: false,
      error: false
    }
  }

  handleChange = field => event => {
    this.setState({
      [field]: event.target.value,
      ...(field === 'email' ? { emailError: false } : {}),
      ...(field === 'password' ? { passwordError: false } : {})
    })
  }

  onLoginSuccess = user => {
    this.props.setUser(user)
    this.props.history.push('/tag-report')
  }

  submit = e => {
    e.preventDefault()
    this.setState({
      ...this.state,
      isLoading: true,
      serverError: false
    }, async () => {
      const form = {
        email: this.state.email,
        password: this.state.password
      }
      try {
        const response = await API.post('/login', form)
        this.setState({
          ...this.state,
          isLoading: false,
          error: false
        })
        this.onLoginSuccess(response.data.user)
      } catch (e) {
        const errorMessage = e.message || 'Something went wrong'
        this.setState({
          ...this.state,
          isLoading: false,
          error: errorMessage
        })
      }
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Log into StreamKey</h3>
        <form className={classes.form} onSubmit={this.submit}>
          <TextField
            label='Email'
            type='email'
            className={classes.textField}
            value={this.state.email}
            onChange={this.handleChange('email')}
            disabled={this.state.isLoading}
          />
          <TextField
            label='Password'
            type='password'
            className={classes.textField}
            value={this.state.password}
            onChange={this.handleChange('password')}
            disabled={this.state.isLoading}
          />
          {
            this.state.error &&
            <div className={classes.error}>
              {this.state.error}
            </div>
          }
          <Button
            variant='contained'
            color='primary'
            type='submit'
            className={classes.button}
            onClick={this.submit}
            disabled={this.state.isLoading}
          >
            Log in
          </Button>
        </form>
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

const connectedLogin = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default withRouter(withStyles(styles)(connectedLogin))
