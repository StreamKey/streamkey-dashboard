import React from 'react'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import { omit } from 'lodash'

import LogViewer from '../components/Log/LogViewer'
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
      maxWidth: '100%'
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    },
    link: {
      cursor: 'pointer',
      '&:hover': {
        textDecoration: 'underline'
      }
    }
  }
}

class Logs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      logsList: [],
      currentLog: []
    }
  }

  componentDidMount () {
    this.getLogsList()
  }

  getLogsList = async () => {
    const response = await API.get('/logs')
    this.setState({
      ...this.state,
      logsList: response.data.logs
    })
  }

  getLogData = logName => async () => {
    const response = await API.get('/logs/' + logName)
    const jsonStr = '[' + response.data.data.trim('\n').split('\n').join(',') + ']'
    try {
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
      })
    } catch (e) {
      console.error('Invalid log format')
      console.error(e)
    }
  }

  render () {
    const { classes } = this.props
    const { currentLog } = this.state
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.container}>
          <h3 className={classes.title}>Logs</h3>
          <ul>
            {
              this.state.logsList.map(l => (
                <li key={l}>
                  <a
                    className={classes.link}
                    onClick={this.getLogData(l)}>{l}</a>
                </li>
              ))
            }
          </ul>
          {
            currentLog.length > 0 && <LogViewer rows={currentLog} />
          }
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(Logs)
