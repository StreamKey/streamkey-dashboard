import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import ErrorSvg from 'mdi-material-ui/AlertCircleOutline'

const styles = theme => {
  return {
    root: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.palette.grey[100]
    },
    primaryContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    text: {
      color: theme.palette.red[400],
      fontSize: 18,
      fontWeight: 300
    },
    icon: {
      fill: theme.palette.red[400],
      marginRight: theme.spacing.unit
    },
    textSecondary: {
      color: theme.palette.grey[500],
      fontSize: 14,
      fontWeight: 300
    }
  }
}

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    // Display fallback UI
    this.setState({ hasError: true })
    console.error(error, info)
  }

  render () {
    const { classes } = this.props
    if (this.state.hasError) {
      return <div className={classes.root}>
        <div className={classes.primaryContainer}>
          <ErrorSvg className={classes.icon} />
          <h1 className={classes.text}>Something went wrong</h1>
        </div>
        <h2 className={classes.textSecondary}>Check the console for more details</h2>
      </div>
    }
    return this.props.children
  }
}

export default withStyles(styles)(ErrorBoundary)
