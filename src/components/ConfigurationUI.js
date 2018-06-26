import React from 'react'
import { withStyles } from 'material-ui/styles'

import ReactJson from 'react-json-view'

import Button from 'material-ui/Button'
import { CircularProgress } from 'material-ui/Progress'
import TextField from 'material-ui/TextField'
import { MenuItem } from 'material-ui/Menu'
import Select from 'material-ui/Select'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import Paper from 'material-ui/Paper'

import SuccessSvg from 'mdi-svg/svg/check.svg'
import ErrorSvg from 'mdi-svg/svg/alert-circle-outline.svg'

import MdIcon from './MdIcon'
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
      padding: theme.spacing.double
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

class ConfigurationUI extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      as: 'lkqd',
      isLoading: false,
      isDone: false,
      hasError: false,
      jsonData: null,
      isPromptOpen: false,
      promptValue: '',
      promptKey: ''
    }
  }

  load = () => {
    this.setState({
      ...this.state,
      isLoading: true,
      isDone: false
    }, async () => {
      try {
        const res = await API.get('/configuration-ui/load/' + this.state.as)
        this.setState({
          ...this.state,
          isLoading: false,
          jsonData: res.data.jsonData,
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
        const res = await API.post('/configuration-ui/save/' + this.state.as, this.state.jsonData)
        if (res.data.success !== true) {
          console.error(res)
        }
        this.setState({
          ...this.state,
          isLoading: false,
          isDone: true,
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

  onEdit = e => {
    this.setState({
      ...this.state,
      jsonData: e.updated_src
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
      jsonData: newJsonData
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
    console.log('e', e)
    this.setState({
      ...this.state,
      as: e.target.value
    })
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
              <MenuItem value='streamrail'>StreamRail</MenuItem>
            </Select>
            <Button
              className={classes.button}
              onClick={this.load}
              size='small'
              variant='raised'
              disabled={this.state.isLoading}
            >
              Load
            </Button>
            <Button
              className={classes.button}
              onClick={this.save}
              size='small'
              variant='raised'
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
                <MdIcon svg={ErrorSvg} className={classes.icon} /> Something went wrong
              </div>
            }
            {
              this.state.isDone && !this.state.hasError &&
              <div className={classes.success}>
                <MdIcon svg={SuccessSvg} className={classes.icon} /> Saved
              </div>
            }
          </div>
        </div>
        <Paper className={classes.jsonEditor}>
          <ReactJson
            src={this.state.jsonData || {}}
            displayObjectSize={false}
            displayDataTypes={false}
            indentWidth={2}
            collapsed={1}
            enableClipboard={false}
            onEdit={this.onEdit}
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
              >
                Add Bundle
              </Button>
              <Button
                className={classes.button}
                onClick={this.promptForName('domain')}
                size='small'
              >
                Add Domain
              </Button>
              <Button
                className={classes.button}
                onClick={this.promptForName('ctv')}
                size='small'
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

export default withStyles(styles)(ConfigurationUI)
