import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import FormData from 'form-data'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import SuccessSvg from 'mdi-material-ui/Check'
import ErrorSvg from 'mdi-material-ui/AlertCircleOutline'
import DuplicateSvg from 'mdi-material-ui/ContentDuplicate'

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

class UploadTagGenerator extends React.Component {
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
        <h3 className={classes.title}>Upload Tag Generator</h3>
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
            variant='contained'
            disabled={this.state.isLoading}
          >
            {this.state.isLoading && <CircularProgress size={24} className={classes.progress} />}
            {!this.state.isLoading && <DuplicateSvg className={classes.icon} />}
            Upload
          </Button>
          {
            this.state.isDone && this.state.hasError &&
            <div className={classes.error}>
              <ErrorSvg className={classes.icon} /> Something went wrong
            </div>
          }
          {
            this.state.isDone && !this.state.hasError &&
            <div className={classes.success}>
              <SuccessSvg className={classes.icon} /> Done
            </div>
          }
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(UploadTagGenerator)
