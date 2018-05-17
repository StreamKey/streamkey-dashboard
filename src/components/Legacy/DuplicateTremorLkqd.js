import React from 'react'
import { withStyles } from 'material-ui/styles'

import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'
import SuccessSvg from 'mdi-svg/svg/check.svg'
import ErrorSvg from 'mdi-svg/svg/alert-circle-outline.svg'
import DuplicateSvg from 'mdi-svg/svg/content-duplicate.svg'

import MdIcon from '../MdIcon'
import API from '../API'

const styles = theme => {
  return {
    root: {
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

class DuplicateTremorLkqd extends React.Component {
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
        <h3 className={classes.title}>Duplicate LKQD Supply Tremor</h3>
        <Button
          className={classes.button}
          onClick={this.run}
          size='small'
          variant='raised'
          disabled={this.state.isLoading}
        >
          {this.state.isLoading && <CircularProgress size={24} className={classes.progress} />}
          {!this.state.isLoading && <MdIcon svg={DuplicateSvg} className={classes.icon} />}
          Run
        </Button>
        {
          this.state.isDone && this.state.hasError &&
          <div className={classes.error}>
            <MdIcon svg={ErrorSvg} className={classes.icon} /> Something went wrong
          </div>
        }
        {
          this.state.isDone && !this.state.hasError &&
          <div className={classes.success}>
            <MdIcon svg={SuccessSvg} className={classes.icon} /> Done
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(DuplicateTremorLkqd)
