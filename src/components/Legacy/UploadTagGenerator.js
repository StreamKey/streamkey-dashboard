import React from 'react'
import { withStyles } from 'material-ui/styles'
import FormData from 'form-data'

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
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing.quad
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
      alignItems: 'center'
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

class UploadTagManager extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      isDone: false,
      hasError: false
    }
  }

  upload = e => {
    e.preventDefault()
    this.setState({
      ...this.state,
      isLoading: true,
      isDone: false
    }, async () => {
      const uploadedFile = this.fileInput.files[0]
      const data = new FormData()
      data.append('fileToUpload', uploadedFile)
      const res = await API.put('/uploadTagGenerator', data)
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
        <h3 className={classes.title}>Upload Tag Manager</h3>
        <form className={classes.form} onSubmit={this.upload}>
          <input
            type='file'
            name='fileToUpload'
            ref={input => {
              this.fileInput = input
            }}
          />
          <Button
            className={classes.button}
            onClick={this.upload}
            size='small'
            variant='raised'
            disabled={this.state.isLoading}
          >
            {this.state.isLoading && <CircularProgress size={24} className={classes.progress} />}
            {!this.state.isLoading && <MdIcon svg={DuplicateSvg} className={classes.icon} />}
            Upload
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
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(UploadTagManager)
