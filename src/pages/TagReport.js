import React from 'react'
import { withStyles } from 'material-ui/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'
// import _orderBy from 'lodash/orderBy'
// import csvStringify from 'csv-stringify/lib/sync'
// import FileSaver from 'file-saver'
// import Blob from 'blob'

import IconButton from 'material-ui/IconButton'
// import TextField from 'material-ui/TextField'
// import Tooltip from 'material-ui/Tooltip'
import MdIcon from '../components/MdIcon'
import LeftSvg from 'mdi-svg/svg/chevron-left.svg'
import RightSvg from 'mdi-svg/svg/chevron-right.svg'
// import DownloadSvg from 'mdi-svg/svg/download.svg'

import TagReport from '../components/TagReport/'
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

class TagReportPage extends React.Component {
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

  downloadCsv = () => {
    // const csv = csvStringify(this.state.filtered, {
    //   columns: this.state.header.map(h => h.key),
    //   header: true
    // })
    // const blob = new Blob([csv], {type: 'text/plain;charset=utf-8'})
    // FileSaver.saveAs(blob, `streamkey-report-${this.state.date.format('YYYY-MM-DD')}.csv`)
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
        {
          /*
          <div className={classes.toolsContainer}>
            <Tooltip title='Download CSV' placement='top' enterDelay={300}>
              <IconButton
                onClick={this.downloadCsv}
              >
                <MdIcon svg={DownloadSvg} className={classes.menuIcon} />
              </IconButton>
            </Tooltip>
          </div>
          */
        }
        <TagReport data={this.state.filtered} />
      </div>
    )
  }
}

export default withStyles(styles)(TagReportPage)
