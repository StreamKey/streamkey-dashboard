import React from 'react'
import { withStyles } from 'material-ui/styles'

import DuplicateTremorLkqd from '../components/Legacy/DuplicateTremorLkqd'

import API from '../components/API'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const styles = theme => {
  return {
    root: {
    },
    container: {
      padding: theme.spacing.double,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '100%',
      minHeight: 400
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    },
    button: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.double,
      paddingRight: theme.spacing.double
    },
    icon: {
      marginRight: theme.spacing.unit
    },
    progress: {
      marginRight: theme.spacing.unit,
      color: theme.palette.grey[500]
    },
    error: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing.double,
      color: theme.palette.red[500],
      '& svg': {
        fill: theme.palette.red[400]
      }
    },
    success: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing.double,
      color: theme.palette.green[500],
      '& svg': {
        fill: theme.palette.green[400]
      }
    }
  }
}

class Legacy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      isDone: false,
      hasError: false
    }
  }

  run = () => {
    this.setState({
      ...this.state,
      isLoading: true,
      isDone: false
    }, async () => {
      const res = await API.post('/runLkqdTremorDuplicate')
      if (res.data.success !== true) {
        console.error(res)
      }
      this.setState({
        ...this.state,
        isLoading: false,
        isDone: true,
        hasError: res.data.success !== true
      })
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.container}>
          <DuplicateTremorLkqd />
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(Legacy)
