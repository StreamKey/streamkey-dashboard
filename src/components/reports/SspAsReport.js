import React from 'react'
import { withStyles } from 'material-ui/styles'
import numeral from 'numeral'
import ReactTable from 'react-table'
import each from 'lodash/each'

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

class SspAsReport extends React.Component {
  renderValue = type => cell => {
    const val = cell.value
    if (!val) {
      return ''
    }
    const {
      current,
      diff
      // diffPercent
    } = val
    let currentVal
    let diffVal
    switch (type) {
      case 'integer':
        currentVal = numeral(current).format('0,')
        diffVal = numeral(diff).format('0,')
        break
      case 'float':
        currentVal = numeral(current).format('0,0.0')
        diffVal = numeral(diff).format('0,0.0')
        break
      case 'percent':
        currentVal = numeral(current).format('0a%')
        diffVal = numeral(diff).format('0a%')
        break
      case 'usd':
        currentVal = numeral(current).format('$0,0.0')
        diffVal = numeral(diff).format('$0,0.0')
        break
      default:
        currentVal = current
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

  calcDiffItem = (current, previous) => {
    const res = {}
    for (let k in current) {
      if (k === 'ssp') {
        continue
      }
      res[k] = {
        profit: {
          current: current[k].profit,
          previous: previous[k].profit,
          diff: current[k].profit - previous[k].profit,
          diffPercent: previous[k].profit === 0 ? 0 : (current[k].profit / previous[k].profit) - 1
        },
        margin: {
          current: current[k].margin,
          previous: previous[k].margin,
          diff: current[k].margin - previous[k].margin,
          diffPercent: previous[k].margin === 0 ? 0 : (current[k].margin / previous[k].margin) - 1
        }
      }
    }
    return res
  }

  calcDiff = data => {
    const { current, previous } = data
    if (!current || !previous) {
      return []
    }
    // Assumes the same SSP order in current/previous
    return current.map((c, i) => {
      return {
        ...c,
        ...this.calcDiffItem(c, previous[i])
      }
    })
  }

  calcTotal = data => {
    const { current, previous } = data
    const total = {
      revenue: {
        current: 0,
        previous: 0,
        diff: 0
      },
      profit: {
        current: 0,
        previous: 0,
        diff: 0
      },
      margin: {
        current: 0,
        previous: 0,
        diff: 0
      }
    }
    if (!current || !previous) {
      return total
    }
    // Assumes the same SSP order in current/previous
    each(current, (row, i) => {
      each(row, (v, k) => {
        if (['lkqd', 'streamrail', 'springserve', 'aniview'].includes(k)) {
          total.revenue.current += v.revenue
          total.revenue.previous += previous[i][k].revenue
          total.profit.current += v.profit
          total.profit.previous += previous[i][k].profit
        }
      })
    })
    total.margin.current += total.profit.current === 0 ? 0 : total.profit.current / total.revenue.current
    total.margin.previous += total.profit.previous === 0 ? 0 : total.profit.previous / total.revenue.previous
    total.margin.diff += total.margin.current - total.margin.previous
    total.revenue.diff = total.revenue.current - total.revenue.previous
    total.profit.diff = total.profit.current - total.profit.previous
    return total
  }

  calcTotalColumn = (data, column, type) => {
    if (type === 'sum') {
      const total = {
        current: 0,
        diff: 0
      }
      each(data, row => {
        if (type === 'sum') {
          total.current += Number(row[column].current || 0)
          total.diff += Number(row[column].diff || 0)
        }
      })
      return total
    } else if (type === 'margin') {
      const total = {
        current: {
          profit: 0,
          revenue: 0
        },
        previous: {
          profit: 0,
          revenue: 0
        }
      }
      const as = column.split('.')[0]
      each(this.props.data.current, row => {
        total.current.profit += row[as].profit
        total.current.revenue += row[as].revenue
      })
      each(this.props.data.previous, row => {
        total.previous.profit += row[as].profit
        total.previous.revenue += row[as].revenue
      })
      const currentMargin = total.current.revenue === 0 ? 0 : total.current.profit / total.current.revenue
      const prevMargin = total.previous.revenue === 0 ? 0 : total.previous.profit / total.previous.revenue
      return {
        current: currentMargin,
        diff: currentMargin - prevMargin
      }
    } else {
      return ''
    }
  }

  renderFooter = (column, type, sumType) => ({ data }) => {
    const total = this.calcTotalColumn(data, column, sumType)
    const cell = {
      value: total,
      column: {
        id: column
      }
    }
    return <strong>{this.renderValue(type)(cell)}</strong>
  }

  render () {
    const { classes, data } = this.props
    const total = this.calcTotal(data)
    const diffWithYesterday = this.calcDiff(data)
    const totalColumns = [
      {
        Header: '',
        Cell: 'Total',
        minWidth: 80
      }, {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: this.renderValue('usd'),
        minWidth: 180
      }, {
        Header: 'Profit',
        accessor: 'profit',
        Cell: this.renderValue('usd'),
        minWidth: 180
      }, {
        Header: 'Margin',
        accessor: 'margin',
        Cell: this.renderValue('percent'),
        minWidth: 120
      }
    ]
    const columns = [{
      Header: 'Demand',
      accessor: 'ssp',
      Footer: <strong>Total</strong>
    }, {
      Header: 'LKQD',
      columns: [
        {
          Header: 'Profit',
          accessor: 'lkqd.profit',
          Cell: this.renderValue('usd'),
          minWidth: 120,
          Footer: this.renderFooter('lkqd.profit', 'usd', 'sum')
        }, {
          Header: 'Margin',
          accessor: 'lkqd.margin',
          Cell: this.renderValue('percent'),
          Footer: this.renderFooter('lkqd.profit', 'percent', 'margin')
        }
      ]
    }, {
      Header: 'StreamRail',
      columns: [
        {
          Header: 'Profit',
          accessor: 'streamrail.profit',
          Cell: this.renderValue('usd'),
          minWidth: 120,
          Footer: this.renderFooter('lkqd.profit', 'usd', 'sum')
        }, {
          Header: 'Margin',
          accessor: 'streamrail.margin',
          Cell: this.renderValue('percent'),
          Footer: this.renderFooter('streamrail.profit', 'percent', 'margin')
        }
      ]
    }, {
      Header: 'SpringServe',
      columns: [
        {
          Header: 'Profit',
          accessor: 'springserve.profit',
          Cell: this.renderValue('usd'),
          minWidth: 120,
          Footer: this.renderFooter('lkqd.profit', 'usd', 'sum')
        }, {
          Header: 'Margin',
          accessor: 'springserve.margin',
          Cell: this.renderValue('percent'),
          Footer: this.renderFooter('springserve.profit', 'percent', 'margin')
        }
      ]
    }, {
      Header: 'Aniview',
      columns: [
        {
          Header: 'Profit',
          accessor: 'aniview.profit',
          Cell: this.renderValue('usd'),
          minWidth: 120,
          Footer: this.renderFooter('lkqd.profit', 'usd', 'sum')
        }, {
          Header: 'Margin',
          accessor: 'aniview.margin',
          Cell: this.renderValue('percent'),
          Footer: this.renderFooter('aniview.profit', 'percent', 'margin')
        }
      ]
    }]
    return (
      <div className={classes.root}>
        <Paper className={classes.tableContainer}>
          <ReactTable
            className={classes.table}
            data={[total]}
            columns={totalColumns}
            sortable={false}
            showPageJump={false}
            defaultPageSize={1}
            PaginationComponent={() => <div />}
          />
        </Paper>
        <Paper className={classes.tableContainer}>
          <ReactTable
            className={classes.table}
            data={diffWithYesterday}
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

export default withStyles(styles)(SspAsReport)
