import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { omit, orderBy, take } from 'lodash'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import FileSvg from 'mdi-material-ui/FileOutline'

import LogViewer from '../components/Log/LogViewer'
import API from '../components/API'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.double,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '100%'
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    },
    logItem: {
      padding: 0
    },
    logButton: {
      height: theme.spacing.quad,
      width: theme.spacing.quad,
      padding: theme.spacing.unit,
      marginRight: 0
    },
    logButtonIcon: {
      height: theme.spacing.double,
      width: theme.spacing.double
    },
    logContainer: {
      width: '100%',
      maxWidth: '100%'
    }
  }
}

class Logs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      logsList: [],
      currentLog: [],
      showAll: false
    }
    this.logRef = null
  }

  componentDidMount () {
    this.getLogsList()
  }

  getLogsList = async () => {
    const response = await API.get('/logs')
    this.setState({
      ...this.state,
      logsList: orderBy(response.data.logs, [], ['desc'])
    })
  }

  getLogData = logName => async () => {
    const response = await API.get('/logs/' + logName)
    const logLines = response.data.data.trim('\n').split('\n')
    try {
      const jsonStr = '[' + logLines.join(',') + ']'
      const json = JSON.parse(jsonStr)
      const currentLog = json.map(l => {
        const time = moment(l.timestamp).utc()
        return {
          date: time.format('YYYY-MM-DD'),
          time: time.format('HH:mm:ss'),
          level: l.level,
          message: l.message,
          data: JSON.stringify(omit(l, ['timestamp', 'level', 'message']))
        }
      })
      this.setState({
        ...this.state,
        currentLog
      }, this.scrollShowLog)
    } catch (e) {
      this.setState({
        ...this.state,
        currentLog: logLines
      }, this.scrollShowLog)
    }
  }

  toggleShowAll = () => {
    this.setState({
      ...this.state,
      showAll: !this.state.showAll
    })
  }

  setLogRef = element => {
    this.logRef = element
  }

  scrollShowLog = () => {
    if (this.logRef) {
      this.logRef.scrollIntoView()
    }
  }

  render () {
    const { classes } = this.props
    const { currentLog, logsList, showAll } = this.state
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Logs</h3>
        <List dense>
          {
            (showAll ? logsList : take(logsList, 10)).map(l => (
              <ListItem key={l} className={classes.logItem}>
                <ListItemIcon>
                  <IconButton
                    onClick={this.getLogData(l)}
                    className={classes.logButton}
                  >
                    <FileSvg className={classes.logButtonIcon} />
                  </IconButton>
                </ListItemIcon>
                <ListItemText primary={l} />
              </ListItem>
            ))
          }
        </List>
        <Button size='small' onClick={this.toggleShowAll}>
          { showAll ? 'Show less' : `+ ${logsList.length - 10}` }
        </Button>
        <div className={classes.logContainer} ref={this.setLogRef}>
          {
            currentLog.length > 0 &&
            <LogViewer rows={currentLog} />
          }
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Logs)
