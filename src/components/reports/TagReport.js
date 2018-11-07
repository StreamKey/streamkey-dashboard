import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import ReactTable from 'react-table'
import numeral from 'numeral'
import each from 'lodash/each'
import csvStringify from 'csv-stringify/lib/sync'
import FileSaver from 'file-saver'
import Blob from 'blob'

import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import DownloadSvg from 'mdi-material-ui/Download'
import GoogleSheetsSvg from 'mdi-material-ui/GoogleDrive'

import 'react-table/react-table.css'

const styles = theme => {
  return {
    root: {
      width: '100%'
    },
    downloadContainer: {
      display: 'flex',
      flexDirection: 'row-reverse'
    },
    downloadButton: {
      height: theme.spacing.quad,
      width: theme.spacing.quad,
      '&:hover svg': {
        fill: theme.palette.grey[800]
      }
    },
    downloadIcon: {
      height: theme.spacing.double,
      width: theme.spacing.double,
      fill: theme.palette.grey[500]
    },
    tableContainer: {
      maxWidth: '100%',
      overflowX: 'scroll'
    },
    table: {
      fontSize: 14,
      height: '80vh',
      fontWeight: 300,
      '& .rt-th:focus': {
        outline: 'none'
      }
    },
    numericCell: {
      fontFamily: `'Roboto Mono', monospace`,
      textAlign: 'right'
    },
    cellPaddingRight: {
      '&.rt-td': {
        paddingRight: 40
      }
    },
    sspCell: {
      backgroundColor: theme.palette.green[100]
    },
    asCell: {
      backgroundColor: theme.palette.red[100]
    }
  }
}

class TagReport extends React.Component {
  constructor (props) {
    super(props)
    this.reactTableRef = React.createRef()
  }

  // TODO consolidate all column definitions to a single place

  cellTypes = {
    profit: 'usd',
    margin: 'percent',
    sspOpp: 'integer',
    sspImp: 'integer',
    sspCpm: 'usd',
    sspRev: 'usd',
    sspScost: 'usd',
    asImp: 'integer',
    asOpp: 'integer',
    asCpm: 'usd',
    asPcpm: 'usd',
    asRev: 'usd',
    asCost: 'usd',
    asScost: 'usd',
    diffCpm: 'usd',
    diffImp: 'integer',
    diffRev: 'usd'
  }

  totals = {
    tag: {
      type: 'text',
      value: 'Total'
    },
    profit: {
      type: 'function',
      fn: (data, column) => {
        let total = 0
        each(data, row => {
          if (row.ssp) {
            total += row.sspRev - row.sspScost - row.asScost - row.asCost
          } else {
            total += row.asRev - row.asCost - row.asScost
          }
        })
        return total
      }
    },
    margin: {
      type: 'function',
      fn: (data, column) => {
        let profit = 0
        let revenue = 0
        each(data, row => {
          if (row.ssp) {
            profit += row.sspRev - row.sspScost - row.asScost - row.asCost
            revenue += row.sspRev
          } else {
            profit += row.asRev - row.asCost - row.asScost
            revenue += row.asRev
          }
        })
        return revenue === 0 ? 0 : profit / revenue
      }
    },
    sspOpp: {
      type: 'sum'
    },
    sspImp: {
      type: 'sum'
    },
    sspCpm: {
      type: 'sum'
    },
    sspRev: {
      type: 'sum'
    },
    sspScost: {
      type: 'sum'
    },
    asImp: {
      type: 'sum'
    },
    asOpp: {
      type: 'sum'
    },
    asRev: {
      type: 'sum'
    },
    asCpm: {
      type: 'sum'
    },
    asPcpm: {
      type: 'sum'
    },
    asCost: {
      type: 'sum'
    },
    asScost: {
      type: 'sum'
    },
    diffCpm: {
      type: 'sum'
    },
    diffImp: {
      type: 'sum'
    },
    diffRev: {
      type: 'sum'
    }
  }

  calcTotal = (data, column) => {
    if (!this.totals[column]) {
      return ''
    }
    const type = this.totals[column].type
    if (type === 'text') {
      return this.totals[column].value
    } else if (type === 'sum') {
      let total = 0
      each(data, row => {
        if (type === 'sum') {
          total += Number(row[column])
        }
      })
      return total
    } else if (type === 'function') {
      return this.totals[column].fn(data, column)
    } else {
      return ''
    }
  }

  renderTotal = column => ({ data }) => {
    const total = this.calcTotal(data, column)
    const cell = {
      value: total,
      column: {
        id: column
      }
    }
    return <strong>{this.renderValue(cell)}</strong>
  }

  renderValue = cell => {
    const val = cell.value
    const type = this.cellTypes[cell.column.id]
    if (val === null) {
      return ''
    }
    switch (type) {
      case 'integer':
        return numeral(val).format('0,')
      case 'float':
        return numeral(val).format('0,0.0')
      case 'percent':
        return numeral(val).format('0a%')
      case 'usd':
        return numeral(val).format('$0,0.0')
      default:
        return val
    }
  }

  downloadCsv = () => {
    const data = this.reactTableRef.getResolvedState().sortedData
    const columns = [
      'tag',
      'ssp',
      'profit',
      'margin',
      'sspOpp',
      'sspImp',
      'sspCpm',
      'sspRev',
      'sspScost',
      'as',
      'asImp',
      'asOpp',
      'asRev',
      'asCpm',
      'asPcpm',
      'asCost',
      'asScost',
      'diffCpm',
      'diffImp',
      'diffRev'
    ]
    const csv = csvStringify(data, {
      columns,
      header: true
    })
    const blob = new Blob([csv], {type: 'text/plain;charset=utf-8'})
    FileSaver.saveAs(blob, `streamkey-report-${this.props.startDate.format('YYYY-MM-DD')}:${this.props.endDate.format('YYYY-MM-DD')}.csv`)
  }

  openLink = links => () => {
    const link = links[links.length - 1]
    window.open(link.url, '_blank')
  }

  filter = (filter, row) => {
    const re = new RegExp(filter.value, 'ig')
    return re.test(row[filter.id])
  }

  render () {
    const { classes, data } = this.props
    // TODO add 3rd header row when this PR is merged:
    // https://github.com/react-tools/react-table/pull/1077
    const columns = [{
      Header: 'Tag',
      columns: [
        {
          accessor: 'tag',
          minWidth: 240,
          Header: this.renderTotal('tag')
        }
      ]
    }, {
      Header: 'Profit',
      columns: [
        {
          accessor: 'profit',
          Cell: this.renderValue,
          className: classes.numericCell,
          Header: this.renderTotal('profit')
        }
      ]
    },
    {
      Header: 'Margin',
      columns: [
        {
          accessor: 'margin',
          Cell: this.renderValue,
          className: classes.numericCell,
          Header: this.renderTotal('margin')
        }
      ]
    }, {
      Header: 'Diff CPM',
      columns: [{
        accessor: 'diffCpm',
        Cell: this.renderValue,
        className: classes.numericCell,
        Header: this.renderTotal('diffCpm')
      }]
    }, {
      Header: 'Diff Imp',
      columns: [{
        accessor: 'diffImp',
        Cell: this.renderValue,
        className: classes.numericCell,
        Header: this.renderTotal('diffImp')
      }]
    }, {
      Header: 'Diff Revenue',
      columns: [{
        accessor: 'diffRev',
        Cell: this.renderValue,
        minWidth: 120,
        className: `${classes.numericCell} ${classes.cellPaddingRight}`,
        Header: this.renderTotal('diffRev')
      }]
    }, {
      Header: 'SSP',
      columns: [{
        accessor: 'ssp',
        className: classes.sspCell
      }]
    }, {
      Header: 'SSP Opp',
      columns: [{
        accessor: 'sspOpp',
        Cell: this.renderValue,
        className: `${classes.sspCell} ${classes.numericCell}`,
        Header: this.renderTotal('sspOpp')
      }]
    }, {
      Header: 'SSP Imp',
      columns: [{
        accessor: 'sspImp',
        Cell: this.renderValue,
        className: `${classes.sspCell} ${classes.numericCell}`,
        Header: this.renderTotal('sspImp')
      }]
    }, {
      Header: 'SSP CPM',
      columns: [{
        accessor: 'sspCpm',
        Cell: this.renderValue,
        className: `${classes.sspCell} ${classes.numericCell}`,
        Header: this.renderTotal('sspCpm')
      }]
    }, {
      Header: 'SSP Revenue',
      columns: [{
        accessor: 'sspRev',
        Cell: this.renderValue,
        className: `${classes.sspCell} ${classes.numericCell}`,
        Header: this.renderTotal('sspRev')
      }]
    }, {
      Header: 'SSP sCost',
      columns: [{
        accessor: 'sspScost',
        Cell: this.renderValue,
        className: `${classes.sspCell} ${classes.numericCell}`,
        Header: this.renderTotal('sspScost')
      }]
    }, {
      Header: 'AS',
      columns: [{
        accessor: 'as',
        className: classes.asCell
      }]
    }, {
      Header: 'AS Opp',
      columns: [{
        accessor: 'asOpp',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asOpp')
      }]
    }, {
      Header: 'AS Imp',
      columns: [{
        accessor: 'asImp',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asImp')
      }]
    }, {
      Header: 'AS CPM',
      columns: [{
        accessor: 'asCpm',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asCpm')
      }]
    }, {
      Header: 'AS pCPM',
      columns: [{
        accessor: 'asPcpm',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asPcpm')
      }]
    }, {
      Header: 'AS Revenue',
      columns: [{
        accessor: 'asRev',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asRev')
      }]
    }, {
      Header: 'AS Cost',
      columns: [{
        accessor: 'asCost',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asCost')
      }]
    }, {
      Header: 'AS sCost',
      columns: [{
        accessor: 'asScost',
        Cell: this.renderValue,
        className: `${classes.asCell} ${classes.numericCell}`,
        Header: this.renderTotal('asScost')
      }]
    }]
    return (
      <div className={classes.root}>
        <div className={classes.downloadContainer}>
          <Tooltip title='Download CSV' placement='top' enterDelay={300}>
            <IconButton
              onClick={this.downloadCsv}
              className={classes.downloadButton}
            >
              <DownloadSvg className={classes.downloadIcon} />
            </IconButton>
          </Tooltip>
          {
            this.props.links.length > 0 &&
            <Tooltip title='Google Sheets' placement='top' enterDelay={300}>
              <IconButton
                onClick={this.openLink(this.props.links)}
                className={classes.downloadButton}
              >
                <GoogleSheetsSvg className={classes.downloadIcon} />
              </IconButton>
            </Tooltip>
          }
        </div>
        <Paper className={classes.tableContainer}>
          <ReactTable
            className={`${classes.table} -striped -highlight`}
            data={data}
            columns={columns}
            showPageJump={false}
            freezeWhenExpanded
            filterable
            defaultPageSize={100}
            pageSizeOptions={[50, 100, 500, 1000]}
            ref={r => { this.reactTableRef = r }}
            defaultFilterMethod={this.filter}
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(TagReport)
