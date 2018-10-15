import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import SuccessSvg from 'mdi-material-ui/Check'
import ErrorSvg from 'mdi-material-ui/AlertCircleOutline'
import DuplicateSvg from 'mdi-material-ui/ContentDuplicate'

import API from '../components/API'

const styles = theme => {
  return {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing.quad
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      marginTop: theme.spacing.quad,
      marginBottom: 0,
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

class DuplicateTremorLkqd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoadingRun: false,
      isDoneRun: false,
      hasErrorRun: false,
      isLoadingTremor: false,
      isDoneTremor: false,
      hasErrorTremor: false,
      isLoadingLkqd: false,
      isDoneLkqd: false,
      hasErrorLkqd: false
    }
  }

  run = () => {
    this.setState({
      ...this.state,
      isLoadingRun: true,
      isDoneRun: false
    }, async () => {
      const res = await API.post('/runLkqdTremorDuplicate/run')
      if (res.data.success !== true) {
        console.error(res)
      }
      this.setState({
        ...this.state,
        isLoadingRun: false,
        isDoneRun: true,
        hasErrorRun: res.data.success !== true
      })
    })
  }

  runTremor = () => {
    this.setState({
      ...this.state,
      isLoadingTremor: true,
      isDoneTremor: false
    }, async () => {
      const res = await API.post('/runLkqdTremorDuplicate/duplicate-tremor')
      if (res.data.success !== true) {
        console.error(res)
      }
      this.setState({
        ...this.state,
        isLoadingTremor: false,
        isDoneTremor: true,
        hasErrorTremor: res.data.success !== true
      })
    })
  }

  runLkqd = () => {
    this.setState({
      ...this.state,
      isLoadingLkqd: true,
      isDoneLkqd: false
    }, async () => {
      const res = await API.post('/runLkqdTremorDuplicate/copy-lkqd')
      if (res.data.success !== true) {
        console.error(res)
      }
      this.setState({
        ...this.state,
        isLoadingLkqd: false,
        isDoneLkqd: true,
        hasErrorLkqd: res.data.success !== true
      })
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Duplicate LKQD Supply Tremor</h3>
        <Button
          className={classes.button}
          onClick={this.run}
          size='small'
          variant='raised'
          disabled={this.state.isLoadingRun}
        >
          {this.state.isLoadingRun && <CircularProgress size={24} className={classes.progress} />}
          {!this.state.isLoadingRun && <DuplicateSvg className={classes.icon} />}
          Run
        </Button>
        {
          this.state.isDoneRun && this.state.hasErrorRun &&
          <div className={classes.error}>
            <ErrorSvg className={classes.icon} /> Something went wrong
          </div>
        }
        {
          this.state.isDoneRun && !this.state.hasErrorRun &&
          <div className={classes.success}>
            <SuccessSvg className={classes.icon} /> Done
          </div>
        }

        <h3 className={classes.title}>Duplicate On Tremor Only</h3>
        <Button
          className={classes.button}
          onClick={this.runTremor}
          size='small'
          variant='raised'
          disabled={this.state.isLoadingTremor}
        >
          {this.state.isLoadingTremor && <CircularProgress size={24} className={classes.progress} />}
          {!this.state.isLoadingTremor && <DuplicateSvg className={classes.icon} />}
          Run
        </Button>
        {
          this.state.isDoneTremor && this.state.hasErrorTremor &&
          <div className={classes.error}>
            <ErrorSvg className={classes.icon} /> Something went wrong
          </div>
        }
        {
          this.state.isDoneTremor && !this.state.hasErrorTremor &&
          <div className={classes.success}>
            <SuccessSvg className={classes.icon} /> Done
          </div>
        }

        <h3 className={classes.title}>Copy to LKQD</h3>
        <Button
          className={classes.button}
          onClick={this.runLkqd}
          size='small'
          variant='raised'
          disabled={this.state.isLoadingLkqd}
        >
          {this.state.isLoadingLkqd && <CircularProgress size={24} className={classes.progress} />}
          {!this.state.isLoadingLkqd && <DuplicateSvg className={classes.icon} />}
          Run
        </Button>
        {
          this.state.isDoneLkqd && this.state.hasErrorLkqd &&
          <div className={classes.error}>
            <ErrorSvg className={classes.icon} /> Something went wrong
          </div>
        }
        {
          this.state.isDoneLkqd && !this.state.hasErrorLkqd &&
          <div className={classes.success}>
            <SuccessSvg className={classes.icon} /> Done
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(DuplicateTremorLkqd)
