import React from 'react'
import { withStyles } from 'material-ui/styles'
import numeral from 'numeral'
import ReactTable from 'react-table'

import Paper from 'material-ui/Paper'

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
      fontSize: 11,
      fontStyle: 'italic',
      marginLeft: theme.spacing.unit,
      color: theme.palette.green[700]
    },
    negativeDiff: {
      fontSize: 11,
      fontStyle: 'italic',
      marginLeft: theme.spacing.unit,
      color: theme.palette.red[700]
    },
    neutralDiff: {
      fontSize: 11,
      fontStyle: 'italic',
      marginLeft: theme.spacing.unit,
      color: theme.palette.grey[500]
    }
  }
}

class DiscrepancyReport extends React.Component {
  renderValue = type => cell => {
    const val = cell.value
    if (!val) {
      return ''
    }
    const {
      value,
      diff
      // diffPercent
    } = val
    let currentVal
    let diffVal
    switch (type) {
      case 'integer':
        currentVal = numeral(value).format('0,')
        diffVal = numeral(diff).format('0,')
        break
      case 'float':
        currentVal = numeral(value).format('0,0.0')
        diffVal = numeral(diff).format('0,0.0')
        break
      case 'percent':
        currentVal = numeral(value).format('0a%')
        diffVal = numeral(diff).format('0a%')
        break
      case 'usd':
        currentVal = numeral(value).format('$0,0.0')
        diffVal = numeral(diff).format('$0,0.0')
        break
      default:
        currentVal = value
        diffVal = ''
    }
    return (
      <div className={this.props.classes.cellContainer}>
        <span>
          {currentVal}
        </span>
        <span className={this.props.classes[diff > 0 ? 'positiveDiff' : (diff < 0 ? 'negativeDiff' : 'neutralDiff')]}>
          {(diff > 0 ? '+' : '') + diffVal}
        </span>
      </div>
    )
  }

  render () {
    const { classes, data } = this.props
    const columns = [{
      Header: 'SSP',
      columns: [{
        accessor: 'ssp'
      }]
    }, {
      Header: 'AS',
      columns: [
        {
          Header: 'LKQD',
          accessor: 'lkqd.revenue',
          Cell: this.renderValue('usd'),
          minWidth: 180
        }, {
          Header: 'StreamRail',
          accessor: 'streamrail.revenue',
          Cell: this.renderValue('usd'),
          minWidth: 180
        }, {
          Header: 'SpringServe',
          accessor: 'springserve.revenue',
          Cell: this.renderValue('usd'),
          minWidth: 180
        }, {
          Header: 'Aniview',
          accessor: 'aniview.revenue',
          Cell: this.renderValue('usd'),
          minWidth: 180
        }
      ]
    }]
    return (
      <div className={classes.root}>
        <Paper className={classes.tableContainer}>
          <ReactTable
            className={classes.table}
            data={data}
            columns={columns}
            showPageJump={false}
            defaultPageSize={6}
            PaginationComponent={() => <div />}
          />
        </Paper>
      </div>
    )
  }
}

export default withStyles(styles)(DiscrepancyReport)
