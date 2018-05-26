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
      height: '80vh'
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
      type: 'sum'
    },
    margin: {
      type: 'sum'
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
    let total
    if (!this.totals[column]) {
      return ''
    }
    const type = this.totals[column].type
    if (type === 'text') {
      return this.totals[column].value
    } else if (type === 'sum') {
      total = 0
    } else {
      return ''
    }
    each(data, row => {
      if (type === 'sum') {
        total += Number(row[column])
      }
    })
    return total
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
      Footer: this.renderFooter('profit')
    },
    {
      Header: 'Margin',
      accessor: 'margin',
      Cell: this.renderValue,
      Footer: this.renderFooter('margin')
    },
    {
      Header: 'SSP',
      columns: [
        {
          Header: 'ID',
          accessor: 'ssp'
        }, {
          Header: 'Opp',
          accessor: 'sspOpp',
          Cell: this.renderValue,
          Footer: this.renderFooter('sspOpp')
        }, {
          Header: 'Imp',
          accessor: 'sspImp',
          Cell: this.renderValue,
          Footer: this.renderFooter('sspImp')
        }, {
          Header: 'CPM',
          accessor: 'sspCpm',
          Cell: this.renderValue,
          Footer: this.renderFooter('sspCpm')
        }, {
          Header: 'Revenue',
          accessor: 'sspRev',
          Cell: this.renderValue,
          Footer: this.renderFooter('sspRev')
        }, {
          Header: 'sCost',
          accessor: 'sspScost',
          Cell: this.renderValue,
          Footer: this.renderFooter('sCost')
        }
      ]
    }, {
      Header: 'AS',
      columns: [
        {
          Header: 'ID',
          accessor: 'as'
        }, {
          Header: 'Opp',
          accessor: 'asOpp',
          Cell: this.renderValue,
          Footer: this.renderFooter('asOpp')
        }, {
          Header: 'Imp',
          accessor: 'asImp',
          Cell: this.renderValue,
          Footer: this.renderFooter('asImp')
        }, {
          Header: 'CPM',
          accessor: 'asCpm',
          Cell: this.renderValue,
          Footer: this.renderFooter('asCpm')
        }, {
          Header: 'pCPM',
          accessor: 'asPcpm',
          Cell: this.renderValue,
          Footer: this.renderFooter('asPcpm')
        }, {
          Header: 'Revenue',
          accessor: 'asRev',
          Cell: this.renderValue,
          Footer: this.renderFooter('asRev')
        }, {
          Header: 'Cost',
          accessor: 'asCost',
          Cell: this.renderValue,
          Footer: this.renderFooter('asCost')
        }, {
          Header: 'sCost',
          accessor: 'asScost',
          Cell: this.renderValue,
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
          Footer: this.renderFooter('diffCpm')
        }, {
          Header: 'Imp',
          accessor: 'diffImp',
          Cell: this.renderValue,
          Footer: this.renderFooter('diffImp')
        }, {
          Header: 'Revenue',
          accessor: 'diffRev',
          Cell: this.renderValue,
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
