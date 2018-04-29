import React from 'react'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'
import _orderBy from 'lodash/orderBy'
import csvStringify from 'csv-stringify/lib/sync'
import FileSaver from 'file-saver'
import Blob from 'blob'

import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import MdIcon from '../components/MdIcon'
import LeftSvg from 'mdi-svg/svg/chevron-left.svg'
import RightSvg from 'mdi-svg/svg/chevron-right.svg'
import DownloadSvg from 'mdi-svg/svg/download.svg'

import Report from '../components/Report/'
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
    datepicker: {
      marginBottom: theme.spacing.quad,
      '& [class*="MuiInput-input-"]': {
        textAlign: 'center'
      }
    },
    toolsContainer: {
      ...theme.utils.container,
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.double
    },
    tagFilter: {
      width: 240
    }
  }
}

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      date: moment().startOf('day'),
      header: [],
      data: [],
      filtered: [],
      tagFilter: '',
      sspFilter: '',
      asFilter: '',
      orderBy: null,
      order: 'asc',
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
        header: response.data.report.header,
        data: response.data.report.data,
        filtered: response.data.report.data,
        tagFilter: '',
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

  onChangeOrder = ({ orderBy, order }) => {
    this.setState({
      ...this.state,
      orderBy,
      order,
      filtered: _orderBy(this.state.filtered, [orderBy], [order])
    })
  }

  onTagFilterChange = e => {
    this.setState({
      ...this.state,
      tagFilter: e.target.value
    }, this.onFilterChange)
  }

  onSspFilterChange = e => {
    this.setState({
      ...this.state,
      sspFilter: e.target.value
    }, this.onFilterChange)
  }

  onAsFilterChange = e => {
    this.setState({
      ...this.state,
      asFilter: e.target.value
    }, this.onFilterChange)
  }

  onFilterChange = () => {
    const tagFilter = new RegExp(this.state.tagFilter, 'i')
    const sspFilter = new RegExp(this.state.sspFilter, 'i')
    const asFilter = new RegExp(this.state.asFilter, 'i')
    this.setState({
      ...this.state,
      filtered: this.state.data.filter(d => {
        return d.tag.match(tagFilter) &&
          d.ssp.match(sspFilter) &&
          d.as.match(asFilter)
      })
    })
  }

  downloadCsv = () => {
    const csv = csvStringify(this.state.filtered, {
      columns: this.state.header.map(h => h.key),
      header: true
    })
    const blob = new Blob([csv], {type: 'text/plain;charset=utf-8'})
    FileSaver.saveAs(blob, `streamkey-report-${this.state.date.format('YYYY-MM-DD')}.csv`)
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.container}>
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
          <div className={classes.toolsContainer}>
            <div>
              <TextField
                className={classes.tagFilter}
                label='Tag Filter'
                value={this.state.tagFilter}
                onChange={this.onTagFilterChange}
              />
              <TextField
                label='SSP Filter'
                value={this.state.sspFilter}
                onChange={this.onSspFilterChange}
              />
              <TextField
                label='AS Filter'
                value={this.state.asFilter}
                onChange={this.onAsFilterChange}
              />
            </div>
            <IconButton
              onClick={this.downloadCsv}
            >
              <MdIcon svg={DownloadSvg} className={classes.menuIcon} />
            </IconButton>
          </div>
          <Report
            header={this.state.header}
            data={this.state.filtered}
            orderBy={this.state.orderBy}
            order={this.state.order}
            onChangeOrder={this.onChangeOrder}
          />
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(Home)
