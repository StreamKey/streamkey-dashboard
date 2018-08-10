import React from 'react'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'
import each from 'lodash/each'

import IconButton from 'material-ui/IconButton'
import MdIcon from '../components/MdIcon'
import LeftSvg from 'mdi-svg/svg/chevron-left.svg'
import RightSvg from 'mdi-svg/svg/chevron-right.svg'

import SspAsReport from '../components/reports/SspAsReport'
import API from '../components/API'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.double,
      paddingBottom: theme.spacing.huge,
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
      marginBottom: theme.spacing.double,
      width: 120
    },
    comparedDates: {
      marginBottom: theme.spacing.quad,
      color: theme.palette.grey[600],
      fontSize: 13,
      textAlign: 'center'
    }
  }
}

class SspAsReportPage extends React.Component {
  constructor (props) {
    super(props)
    const endDate = moment(props.match.params.date, 'YYYY-MM-DD')
    this.state = {
      startDate: endDate,
      endDate,
      compareTo: {
        from: null,
        to: null
      },
      data: {},
      total: {},
      isLoading: false,
      error: false
    }
  }

  componentDidMount () {
    this.getReport()
  }

  addTotalSsp = bySsp => {
    return bySsp.map(row => {
      const total = {
        revenue: 0,
        profit: 0,
        margin: 0
      }
      each(row, (v, k) => {
        if (['lkqd', 'streamrail', 'springserve', 'aniview'].includes(k)) {
          total.revenue += v.revenue
          total.profit += v.profit
        }
      })
      total.margin += total.profit === 0 ? 0 : total.profit / total.revenue
      return {
        ...row,
        total
      }
    })
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
      const daysDiff = moment(form.to, 'X').diff(moment(form.from, 'X'), 'days')
      const form2 = {
        from: moment(this.state.startDate).subtract(daysDiff, 'day').format('X'),
        to: moment(this.state.startDate).add(1, 'day').subtract(1, 'day').format('X')
      }
      const response = await API.get('/reports/ssp-as', { params: form })
      const response2 = await API.get('/reports/ssp-as', { params: form2 })
      this.setState({
        ...this.state,
        compareTo: form2,
        data: {
          current: this.addTotalSsp(response.data.report.bySsp),
          previous: this.addTotalSsp(response2.data.report.bySsp)
        },
        isLoading: false,
        error: false
      })
    })
  }

  onStartDateChange = date => {
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
    const path = '/ssp-adserver/' + date.format('YYYY-MM-DD')
    this.props.history.push(path)
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
        <h3 className={classes.title}>SSP-AS Report</h3>
        <div className={classes.datepickerContainer}>
          <div>
            <IconButton
              className={classes.button}
              onClick={this.startPrevDay}
            >
              <MdIcon svg={LeftSvg} className={classes.menuIcon} />
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
              <MdIcon svg={RightSvg} className={classes.menuIcon} />
            </IconButton>
          </div>
          <div>
            <IconButton
              className={classes.button}
              onClick={this.endPrevDay}
            >
              <MdIcon svg={LeftSvg} className={classes.menuIcon} />
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
              <MdIcon svg={RightSvg} className={classes.menuIcon} />
            </IconButton>
          </div>
        </div>
        <div className={classes.comparedDates}>
          Compared to: {this.renderDate(moment(this.state.compareTo.from, 'X'))} - {this.renderDate(moment(this.state.compareTo.to, 'X').subtract(1, 'days'))}
        </div>
        <SspAsReport data={this.state.data} />
      </div>
    )
  }
}

export default withStyles(styles)(SspAsReportPage)
