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
    datepickerContainer: {
      display: 'flex'
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
    const dateRange = props.match.params.date.split(':')
    const startDate = moment(dateRange[0], 'YYYY-MM-DD')
    const endDate = dateRange.length === 2 ? moment(dateRange[1], 'YYYY-MM-DD') : startDate
    this.state = {
      startDate,
      endDate,
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
        from: moment(this.state.startDate).format('X'),
        to: moment(this.state.endDate).add(1, 'day').format('X')
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

  getDateRangeUrl = ({ startDate, endDate }) => {
    const start = startDate || this.state.startDate
    const end = endDate || this.state.endDate
    return '/tag-report/' + start.format('YYYY-MM-DD') + ':' + end.format('YYYY-MM-DD')
  }

  onStartDateChange = date => {
    this.props.history.push(this.getDateRangeUrl({ startDate: date }))
    this.setState({
      ...this.state,
      startDate: date
    }, this.getReport)
  }

  startPrevDay = () => {
    this.onStartDateChange(moment(this.state.startDate).subtract(1, 'days'))
  }

  startNextDay = () => {
    this.onStartDateChange(moment(this.state.startDate).add(1, 'days'))
  }

  onEndDateChange = date => {
    this.props.history.push(this.getDateRangeUrl({ endDate: date }))
    this.setState({
      ...this.state,
      endDate: date
    }, this.getReport)
  }

  endPrevDay = () => {
    this.onEndDateChange(moment(this.state.endDate).subtract(1, 'days'))
  }

  endNextDay = () => {
    this.onEndDateChange(moment(this.state.endDate).add(1, 'days'))
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
          <div>
            <IconButton
              className={classes.button}
              onClick={this.startPrevDay}
            >
              <LeftSvg className={classes.menuIcon} />
            </IconButton>
            <DatePicker
              label='Start date'
              className={classes.datepicker}
              value={this.state.startDate}
              onChange={this.onStartDateChange}
              labelFunc={this.renderDate}
            />
            <IconButton
              className={classes.button}
              onClick={this.startNextDay}
            >
              <RightSvg className={classes.menuIcon} />
            </IconButton>
          </div>
          <div>
            <IconButton
              className={classes.button}
              onClick={this.endPrevDay}
            >
              <LeftSvg className={classes.menuIcon} />
            </IconButton>
            <DatePicker
              label='End date'
              className={classes.datepicker}
              value={this.state.endDate}
              onChange={this.onEndDateChange}
              labelFunc={this.renderDate}
            />
            <IconButton
              className={classes.button}
              onClick={this.endNextDay}
            >
              <RightSvg className={classes.menuIcon} />
            </IconButton>
          </div>
        </div>
        <TagReport data={this.state.data} startDate={this.state.startDate} endDate={this.state.endDate} links={this.state.links} />
      </div>
    )
  }
}

export default withStyles(styles)(TagReportPage)
