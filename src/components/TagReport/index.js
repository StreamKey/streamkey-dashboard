import React from 'react'
import { withStyles } from 'material-ui/styles'

import ReactTable from 'react-table'
import numeral from 'numeral'
import each from 'lodash/each'

import 'react-table/react-table.css'

import Paper from 'material-ui/Paper'

const styles = theme => {
  return {
    root: {
      maxWidth: '100%',
      overflowX: 'scroll',
      position: 'relative'
    },
    table: {
      fontSize: 14,
      height: '80vh',
      fontWeight: 300
    },
    numericCell: {
      fontFamily: `'Roboto Mono', monospace`,
      textAlign: 'right'
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

  renderFooter = column => ({ data }) => {
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

  render () {
    const { classes, data } = this.props
    const columns = [{
      Header: 'Tag',
      accessor: 'tag',
      minWidth: 240,
      Footer: this.renderFooter('tag')
    }, {
      Header: 'Profit',
      accessor: 'profit',
      Cell: this.renderValue,
      className: classes.numericCell,
      Footer: this.renderFooter('profit')
    },
    {
      Header: 'Margin',
      accessor: 'margin',
      Cell: this.renderValue,
      className: classes.numericCell,
      Footer: this.renderFooter('margin')
    },
    {
      Header: 'SSP',
      columns: [
        {
          Header: 'ID',
          accessor: 'ssp',
          className: classes.sspCell
        }, {
          Header: 'Opp',
          accessor: 'sspOpp',
          Cell: this.renderValue,
          className: `${classes.sspCell} ${classes.numericCell}`,
          Footer: this.renderFooter('sspOpp')
        }, {
          Header: 'Imp',
          accessor: 'sspImp',
          Cell: this.renderValue,
          className: `${classes.sspCell} ${classes.numericCell}`,
          Footer: this.renderFooter('sspImp')
        }, {
          Header: 'CPM',
          accessor: 'sspCpm',
          Cell: this.renderValue,
          className: `${classes.sspCell} ${classes.numericCell}`,
          Footer: this.renderFooter('sspCpm')
        }, {
          Header: 'Revenue',
          accessor: 'sspRev',
          Cell: this.renderValue,
          className: `${classes.sspCell} ${classes.numericCell}`,
          Footer: this.renderFooter('sspRev')
        }, {
          Header: 'sCost',
          accessor: 'sspScost',
          Cell: this.renderValue,
          className: `${classes.sspCell} ${classes.numericCell}`,
          Footer: this.renderFooter('sspScost')
        }
      ]
    }, {
      Header: 'AS',
      columns: [
        {
          Header: 'ID',
          accessor: 'as',
          className: classes.asCell
        }, {
          Header: 'Opp',
          accessor: 'asOpp',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asOpp')
        }, {
          Header: 'Imp',
          accessor: 'asImp',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asImp')
        }, {
          Header: 'CPM',
          accessor: 'asCpm',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asCpm')
        }, {
          Header: 'pCPM',
          accessor: 'asPcpm',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asPcpm')
        }, {
          Header: 'Revenue',
          accessor: 'asRev',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asRev')
        }, {
          Header: 'Cost',
          accessor: 'asCost',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asCost')
        }, {
          Header: 'sCost',
          accessor: 'asScost',
          Cell: this.renderValue,
          className: `${classes.asCell} ${classes.numericCell}`,
          Footer: this.renderFooter('asScost')
        }
      ]
    }, {
      Header: 'Diff',
      columns: [
        {
          Header: 'CPM',
          accessor: 'diffCpm',
          Cell: this.renderValue,
          className: classes.numericCell,
          Footer: this.renderFooter('diffCpm')
        }, {
          Header: 'Imp',
          accessor: 'diffImp',
          Cell: this.renderValue,
          className: classes.numericCell,
          Footer: this.renderFooter('diffImp')
        }, {
          Header: 'Revenue',
          accessor: 'diffRev',
          Cell: this.renderValue,
          className: classes.numericCell,
          Footer: this.renderFooter('diffRev')
        }
      ]
    }]
    return (
      <Paper className={classes.root}>
        <ReactTable
          className={`${classes.table} -striped -highlight`}
          data={data}
          columns={columns}
          showPageJump={false}
          freezeWhenExpanded
          filterable
          defaultPageSize={100}
          pageSizeOptions={[50, 100, 500, 1000]}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(TagReport)
