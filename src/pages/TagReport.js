import React from 'react'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'

import IconButton from 'material-ui/IconButton'
import MdIcon from '../components/MdIcon'
import LeftSvg from 'mdi-svg/svg/chevron-left.svg'
import RightSvg from 'mdi-svg/svg/chevron-right.svg'

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
    this.state = {
      date: moment().startOf('day'),
      data: [],
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
      const response = await API.get('/report', { params: form })
      this.setState({
        ...this.state,
        data: response.data.report.data,
        isLoading: false,
        error: false
      })
    })
  }

  onDateChange = date => {
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
            <MdIcon svg={LeftSvg} className={classes.menuIcon} />
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
            <MdIcon svg={RightSvg} className={classes.menuIcon} />
          </IconButton>
        </div>
        <TagReport data={this.state.data} date={this.state.date} />
      </div>
    )
  }
}

export default withStyles(styles)(TagReportPage)
