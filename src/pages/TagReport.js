import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'

import IconButton from '@material-ui/core/IconButton'
import LeftSvg from 'mdi-material-ui/ChevronLeft'
import RightSvg from 'mdi-material-ui/ChevronRight'

import TagReport from '../components/reports/TagReport'
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
    datepicker: {
      marginBottom: theme.spacing.quad,
      '& [class*="MuiInput-input-"]': {
        textAlign: 'center'
      }
    }
  }
}

class TagReportPage extends React.Component {
  constructor (props) {
    super(props)
    const date = moment(props.match.params.date, 'YYYY-MM-DD')
    this.state = {
      date,
      data: [],
      links: [],
      isLoading: false,
      error: false
    }
  }

  componentDidMount () {
    this.getReport()
  }

  getReport () {
    this.setState({
      ...this.state,
      isLoading: true,
      error: false
    }, async () => {
      const form = {
        from: moment(this.state.date).format('X'),
        to: moment(this.state.date).add(1, 'day').format('X')
      }
      const response = await API.get('/reports/tag', { params: form })
      this.setState({
        ...this.state,
        data: response.data.report.data,
        links: response.data.report.links,
        isLoading: false,
        error: false
      })
    })
  }

  onDateChange = date => {
    const path = '/tag-report/' + date.format('YYYY-MM-DD')
    this.props.history.push(path)
    this.setState({
      ...this.state,
      date
    }, this.getReport)
  }

  prevDay = () => {
    this.onDateChange(moment(this.state.date).subtract(1, 'days'))
  }

  nextDay = () => {
    this.onDateChange(moment(this.state.date).add(1, 'days'))
  }

  renderDate = date => {
    return date.format('YYYY-MM-DD')
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Daily Report</h3>
        <div className={classes.datepickerContainer}>
          <IconButton
            className={classes.button}
            onClick={this.prevDay}
          >
            <LeftSvg className={classes.menuIcon} />
          </IconButton>
          <DatePicker
            className={classes.datepicker}
            value={this.state.date}
            onChange={this.onDateChange}
            labelFunc={this.renderDate}
          />
          <IconButton
            className={classes.button}
            onClick={this.nextDay}
          >
            <RightSvg className={classes.menuIcon} />
          </IconButton>
        </div>
        <TagReport data={this.state.data} date={this.state.date} links={this.state.links} />
      </div>
    )
  }
}

export default withStyles(styles)(TagReportPage)
