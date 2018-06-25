import React from 'react'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'
import each from 'lodash/each'

import IconButton from 'material-ui/IconButton'
import MdIcon from '../components/MdIcon'
import LeftSvg from 'mdi-svg/svg/chevron-left.svg'
import RightSvg from 'mdi-svg/svg/chevron-right.svg'

import DiscrepancyReport from '../components/reports/DiscrepancyReport'
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

class DiscrepancyReportPage extends React.Component {
  constructor (props) {
    super(props)
    const date = moment(props.match.params.date, 'YYYY-MM-DD')
    this.state = {
      date,
      data: [],
      isLoading: false,
      error: false
    }
  }

  componentDidMount () {
    this.getReport()
  }

  mapData (bySsp) {
    return bySsp.map(ssp => {
      const as = {}
      const total = {
        value: 0,
        asRevenue: 0
      }
      each(ssp, (v, k) => {
        if (['lkqd', 'streamrail', 'springserve', 'aniview'].includes(k)) {
          as[k] = {
            revenue: {
              value: v.revenue,
              diff: v.revenue - v.asRevenue,
              diffPercent: (v.revenue / v.asRevenue) - 1,
              asRevenue: v.asRevenue
            }
          }
          total.value += v.revenue
          total.asRevenue += v.asRevenue
        }
      })
      total.diff = total.value - total.asRevenue
      total.diffPercent = total.asRevenue === 0 ? 0 : (total.value / total.asRevenue) - 1
      return {
        ssp: ssp.ssp,
        ...as,
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
        from: moment(this.state.date).format('X'),
        to: moment(this.state.date).add(1, 'day').format('X')
      }
      const response = await API.get('/reports/ssp-as', { params: form })
      this.setState({
        ...this.state,
        data: this.mapData(response.data.report.bySsp),
        isLoading: false,
        error: false
      })
    })
  }

  onDateChange = date => {
    const path = '/discrepancy/' + date.format('YYYY-MM-DD')
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
        <h3 className={classes.title}>Discrepancy</h3>
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
        <DiscrepancyReport data={this.state.data} date={this.state.date} />
      </div>
    )
  }
}

export default withStyles(styles)(DiscrepancyReportPage)
