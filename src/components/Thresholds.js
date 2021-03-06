import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import ReactJson from 'react-json-view'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Paper from '@material-ui/core/Paper'

import SuccessSvg from 'mdi-material-ui/Check'
import ErrorSvg from 'mdi-material-ui/AlertCircleOutline'

import API from './API'

const styles = theme => {
  return {
    stateContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing.double,
      marginBottom: theme.spacing.double
    },
    asSelect: {
      minWidth: 160
    },
    jsonEditor: {
      width: '100%',
      height: '65vh',
      overflowY: 'scroll',
      padding: theme.spacing.double,
      '&.disabled': {
        opacity: 0.5,
        pointerEvents: 'none'
      }
    },
    fileContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: theme.spacing.double,
      marginBottom: theme.spacing.double
    },
    buttonsContainer: {
      display: 'flex'
    },
    button: {
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.double,
      paddingRight: theme.spacing.double,
      marginLeft: theme.spacing.double,
      marginRight: theme.spacing.double
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
      color: theme.palette.red[500],
      '& svg': {
        fill: theme.palette.red[400]
      }
    },
    success: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.green[500],
      '& svg': {
        fill: theme.palette.green[400]
      }
    }
  }
}

class Thresholds extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      as: 'lkqd',
      isLoading: false,
      isDone: false,
      hasError: false,
      jsonData: null,
      hasChanges: false,
      isPromptOpen: false,
      promptValue: '',
      promptKey: ''
    }
  }

  componentDidMount () {
    this.load()
  }

  load = () => {
    this.setState({
      ...this.state,
      isLoading: true,
      isDone: false
    }, async () => {
      try {
        const res = await API.get('/thresholds/load/' + this.state.as)
        this.setState({
          ...this.state,
          isLoading: false,
          jsonData: res.data.jsonData,
          hasChanges: false,
          hasError: res.data.success !== true
        })
      } catch (e) {
        console.error(e)
        this.setState({
          ...this.state,
          isLoading: false,
          jsonData: {},
          hasError: true
        })
      }
    })
  }

  save = () => {
    this.setState({
      ...this.state,
      isLoading: true,
      isDone: false
    }, async () => {
      try {
        const res = await API.post('/thresholds/save/' + this.state.as, this.state.jsonData)
        if (res.data.success !== true) {
          console.error(res)
        }
        this.setState({
          ...this.state,
          isLoading: false,
          isDone: true,
          hasChanges: false,
          hasError: res.data.success !== true
        })
      } catch (e) {
        this.setState({
          ...this.state,
          isLoading: false,
          isDone: true,
          hasError: true
        })
      }
    })
  }

  onAdd = e => {
    this.setState({
      ...this.state,
      jsonData: e.updated_src,
      hasChanges: true
    })
  }

  onEdit = e => {
    this.setState({
      ...this.state,
      jsonData: e.updated_src,
      hasChanges: true
    })
  }

  onDelete = e => {
    this.setState({
      ...this.state,
      jsonData: e.updated_src,
      hasChanges: true
    })
  }

  promptForName = key => () => {
    this.setState({
      ...this.state,
      promptKey: key,
      promptValue: '',
      isPromptOpen: true
    })
  }

  addItem = () => {
    const key = this.state.promptKey
    const defaultItem = { ...this.state.jsonData[key].default }
    const item = { ...this.state.jsonData[key] }
    item[this.state.promptValue] = defaultItem
    const newJsonData = {
      ...this.state.jsonData,
      [key]: item
    }
    this.setState({
      ...this.state,
      jsonData: newJsonData,
      hasChanges: true
    })
  }

  onPromptClose = () => {
    this.setState({
      ...this.state,
      isPromptOpen: false
    })
  }

  onPromptConfirm = () => {
    this.setState({
      ...this.state,
      isPromptOpen: false
    }, () => {
      this.addItem()
    })
  }

  onPromptValueChange = e => {
    this.setState({
      ...this.state,
      promptValue: e.target.value
    })
  }

  onAsChange = e => {
    // TODO use material dialog instead of native prompt
    if (!this.state.hasChanges || window.confirm('This will discard your unsaved changes. Continue?')) {
      this.setState({
        ...this.state,
        as: e.target.value
      }, this.load)
    }
  }

  render () {
    const { classes } = this.props
    return (
      <React.Fragment>
        <div className={classes.stateContainer}>
          <div className={classes.buttonsContainer}>
            <Select
              className={classes.asSelect}
              value={this.state.as}
              onChange={this.onAsChange}
            >
              <MenuItem value='lkqd'>LKQD</MenuItem>
              <MenuItem value='springserve'>SpringServe</MenuItem>
            </Select>
            <Button
              className={classes.button}
              onClick={this.save}
              size='small'
              variant='contained'
              disabled={this.state.isLoading}
            >
              Save
            </Button>
          </div>
          <div>
            {
              !this.state.isLoading && !this.state.isDone &&
              <span>&nbsp;</span>
            }
            {
              this.state.isLoading &&
              <CircularProgress size={24} className={classes.progress} />
            }
            {
              this.state.isDone && this.state.hasError &&
              <div className={classes.error}>
                <ErrorSvg className={classes.icon} /> Something went wrong
              </div>
            }
            {
              this.state.isDone && !this.state.hasError &&
              <div className={classes.success}>
                <SuccessSvg className={classes.icon} /> Saved
              </div>
            }
          </div>
        </div>
        <Paper className={`${classes.jsonEditor} ${this.state.isLoading ? 'disabled' : ''}`}>
          <ReactJson
            src={this.state.jsonData || {}}
            displayObjectSize={false}
            displayDataTypes={false}
            indentWidth={2}
            collapsed={1}
            enableClipboard={false}
            onEdit={this.onEdit}
            onAdd={this.onAdd}
            onDelete={this.onDelete}
          />
        </Paper>
        {
          this.state.jsonData &&
          <div className={classes.fileContainer}>
            <div className={classes.buttonsContainer}>
              <Button
                className={classes.button}
                onClick={this.promptForName('bundle')}
                size='small'
                disabled={this.state.isLoading}
              >
                Add Bundle
              </Button>
              <Button
                className={classes.button}
                onClick={this.promptForName('domain')}
                size='small'
                disabled={this.state.isLoading}
              >
                Add Domain
              </Button>
              <Button
                className={classes.button}
                onClick={this.promptForName('ctv')}
                size='small'
                disabled={this.state.isLoading}
              >
                Add CTV
              </Button>
            </div>
          </div>
        }
        <Dialog
          open={this.state.isPromptOpen}
          onClose={this.onPromptClose}
        >
          <DialogTitle>Add {this.state.promptKey}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              label={this.state.promptKey + ' name'}
              fullWidth
              value={this.state.promptValue}
              onChange={this.onPromptValueChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.onPromptClose}>
              Cancel
            </Button>
            <Button onClick={this.onPromptConfirm} color='primary'>
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Thresholds)
