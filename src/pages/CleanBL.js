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

class CleanBL extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoadingBundle: false,
      isDoneBundle: false,
      hasErrorBundle: false,
      isLoadingDomain: false,
      isDoneDomain: false,
      hasErrorDomain: false
    }
  }

  cleanBundleLkqdBl = () => {
    this.setState({
      ...this.state,
      isLoadingBundle: true,
      isDoneBundle: false
    }, async () => {
      try {
        const res = await API.post('/cleanBl/bundle-lkqd')
        if (res.data.success !== true) {
          console.error(res)
        }
        this.setState({
          ...this.state,
          isLoadingBundle: false,
          isDoneBundle: true,
          hasErrorBundle: res.data.success !== true
        })
      } catch (e) {
        console.error(e)
        this.setState({
          ...this.state,
          isLoadingBundle: false,
          isDoneBundle: true,
          hasErrorBundle: true
        })
      }
    })
  }

  cleanDomainLkqdBl = () => {
    this.setState({
      ...this.state,
      isLoadingDomain: true,
      isDoneDomain: false
    }, async () => {
      try {
        const res = await API.post('/cleanBl/domain-lkqd')
        if (res.data.success !== true) {
          console.error(res)
        }
        this.setState({
          ...this.state,
          isLoadingDomain: false,
          isDoneDomain: true,
          hasErrorDomain: res.data.success !== true
        })
      } catch (e) {
        console.error(e)
        this.setState({
          ...this.state,
          isLoadingDomain: false,
          isDoneDomain: true,
          hasErrorDomain: true
        })
      }
    })
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Clean Bundle LKQD BL</h3>
        <Button
          className={classes.button}
          onClick={this.cleanBundleLkqdBl}
          size='small'
          variant='contained'
          disabled={this.state.isLoadingBundle}
        >
          {this.state.isLoadingBundle && <CircularProgress size={24} className={classes.progress} />}
          {!this.state.isLoadingBundle && <DuplicateSvg className={classes.icon} />}
          Run
        </Button>
        {
          this.state.isDoneBundle && this.state.hasErrorBundle &&
          <div className={classes.error}>
            <ErrorSvg className={classes.icon} /> Something went wrong
          </div>
        }
        {
          this.state.isDoneBundle && !this.state.hasErrorBundle &&
          <div className={classes.success}>
            <SuccessSvg className={classes.icon} /> Done
          </div>
        }

        <h3 className={classes.title}>Clean Domain LKQD BL</h3>
        <Button
          className={classes.button}
          onClick={this.cleanDomainLkqdBl}
          size='small'
          variant='contained'
          disabled={this.state.isLoadingDomain}
        >
          {this.state.isLoadingDomain && <CircularProgress size={24} className={classes.progress} />}
          {!this.state.isLoadingDomain && <DuplicateSvg className={classes.icon} />}
          Run
        </Button>
        {
          this.state.isDoneDomain && this.state.hasErrorDomain &&
          <div className={classes.error}>
            <ErrorSvg className={classes.icon} /> Something went wrong
          </div>
        }
        {
          this.state.isDoneDomain && !this.state.hasErrorDomain &&
          <div className={classes.success}>
            <SuccessSvg className={classes.icon} /> Done
          </div>
        }
      </div>
    )
  }
}

export default withStyles(styles)(CleanBL)
