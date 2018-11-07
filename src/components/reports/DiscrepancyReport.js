import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import numeral from 'numeral'
import ReactTable from 'react-table'
import each from 'lodash/each'

import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'

import { getPartnerName } from '../Utils'

import 'react-table/react-table.css'

const styles = theme => {
  return {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    tableContainer: {
      maxWidth: '100%',
      overflowX: 'scroll',
      marginBottom: theme.spacing.big
    },
    table: {
      fontSize: 14,
      fontWeight: 300,
      '& .rt-th:focus': {
        outline: 'none'
      }
    },
    cellContainer: {
      textAlign: 'center'
    },
    positiveDiff: {
      color: theme.palette.green[900],
      fontWeight: 500
    },
    negativeDiff: {
      color: theme.palette.red[700],
      fontWeight: 500
    },
    neutralDiff: {
      color: theme.palette.grey[900]
    },
    usdDiff: {
      marginLeft: theme.spacing.unit,
      fontSize: 11,
      fontStyle: 'italic',
      fontWeight: 300
    }
  }
}

class DiscrepancyReport extends React.Component {
  cellClass = (diff, diffPercent) => {
    const { classes } = this.props
    let cls = 'neutralDiff'
    if (diff >= 10 && diffPercent >= 0.03) {
      cls = 'positiveDiff'
    } else if (diff <= -10 && diffPercent <= -0.03) {
      cls = 'negativeDiff'
    }
    return classes[cls]
  }

  renderCell = cell => {
    const { classes } = this.props
    const val = cell.value
    if (!val) {
      return ''
    }
    const {
      value,
      diff,
      diffPercent,
      asRevenue
    } = val
    const currentVal = numeral(value).format('$0,0.0')
    const diffVal = numeral(diff).format('$0,0.0')
    const diffPercentVal = numeral(diffPercent).format('0a%')
    const asRevenueVal = numeral(asRevenue).format('$0,0.0')
    const tooltip = (
      <div>
        <div>SSP Revenue: {currentVal}</div>
        <div>AS Revenue: {asRevenueVal}</div>
      </div>
    )
    const cls = this.cellClass(diff, diffPercent)
    return (
      <Tooltip className={this.props.classes.cellContainer} title={tooltip} placement='top' enterDelay={300}>
        <div className={classes.cellContainer}>
          <span className={cls}>
            {diffPercentVal}
          </span>
          <span className={`${cls} ${classes.usdDiff}`}>
            {(diff > 0 ? '+' : '') + diffVal}
          </span>
        </div>
      </Tooltip>
    )
  }

  calcTotalColumn = (data, column) => {
    const totalCell = {
      value: 0,
      diff: 0,
      diffPercent: 0,
      asRevenue: 0
    }
    each(data, row => {
      const cell = row[column]
      totalCell.value += cell.value
      totalCell.asRevenue += cell.asRevenue
    })
    totalCell.diff = totalCell.value - totalCell.asRevenue
    totalCell.diffPercent = totalCell.asRevenue === 0 ? 0 : (totalCell.value / totalCell.asRevenue) - 1
    return totalCell
  }

  renderFooter = column => ({ data }) => {
    const totalCell = this.calcTotalColumn(data, column)
    return <strong>{this.renderCell({ value: totalCell })}</strong>
  }

  render () {
    const { classes, data } = this.props
    const columns = [{
      Header: 'SSP',
      columns: [{
        accessor: 'ssp',
        Header: <strong>Total</strong>,
        Cell: cell => <span>{cell.value ? getPartnerName(cell.value) : ''}</span>
      }]
    }, {
      Header: 'Total',
      columns: [{
        accessor: 'total',
        Cell: this.renderCell,
        minWidth: 180,
        Header: this.renderFooter('total')
      }]
    }, {
      Header: getPartnerName('lkqd'),
      columns: [{
        accessor: 'lkqd.revenue',
        Cell: this.renderCell,
        minWidth: 180,
        Header: this.renderFooter('lkqd.revenue')
      }]
    }, {
      Header: getPartnerName('streamrail'),
      columns: [{
        accessor: 'streamrail.revenue',
        Cell: this.renderCell,
        minWidth: 180,
        Header: this.renderFooter('streamrail.revenue')
      }]
    }, {
      Header: getPartnerName('springserve'),
      columns: [{
        accessor: 'springserve.revenue',
        Cell: this.renderCell,
        minWidth: 180,
        Header: this.renderFooter('springserve.revenue')
      }]
    }, {
      Header: getPartnerName('aniview'),
      columns: [{
        accessor: 'aniview.revenue',
        Cell: this.renderCell,
        minWidth: 180,
        Header: this.renderFooter('aniview.revenue')
      }]
    }]
    return (
      <div className={classes.root}>
        <Paper className={classes.tableContainer}>
          <ReactTable
            className={classes.table}
            data={data}
            columns={columns}
            showPageJump={false}
            defaultPageSize={9}
            PaginationComponent={() => <div />}
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(DiscrepancyReport)
