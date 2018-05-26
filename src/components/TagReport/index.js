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

  calcTotal = () => {
    const { header, data } = this.props
    const total = {}
    each(header, (h, n) => {
      if (h.key === 'tag') {
        total[h.key] = 'Total'
      } else if (h.total === false) {
        total[h.key] = ''
      } else {
        total[h.key] = 0
      }
    })
    each(data, row => {
      each(header, (h, n) => {
        if (h.key !== 'tag' && h.total !== false && h.type !== 'string') {
          total[h.key] += Number(row[h.key])
        }
      })
    })
    return total
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
      minWidth: 240
    }, {
      Header: 'Profit',
      accessor: 'profit',
      Cell: this.renderValue
    },
    {
      Header: 'Margin',
      accessor: 'margin',
      Cell: this.renderValue
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
          Cell: this.renderValue
        }, {
          Header: 'Imp',
          accessor: 'sspImp',
          Cell: this.renderValue
        }, {
          Header: 'CPM',
          accessor: 'sspCpm',
          Cell: this.renderValue
        }, {
          Header: 'Revenue',
          accessor: 'sspRev',
          Cell: this.renderValue
        }, {
          Header: 'sCost',
          accessor: 'sspScost',
          Cell: this.renderValue
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
          Cell: this.renderValue
        }, {
          Header: 'Imp',
          accessor: 'asImp',
          Cell: this.renderValue
        }, {
          Header: 'CPM',
          accessor: 'asCpm',
          Cell: this.renderValue
        }, {
          Header: 'pCPM',
          accessor: 'asPcpm',
          Cell: this.renderValue
        }, {
          Header: 'Revenue',
          accessor: 'asRev',
          Cell: this.renderValue
        }, {
          Header: 'Cost',
          accessor: 'asCost',
          Cell: this.renderValue
        }, {
          Header: 'sCost',
          accessor: 'asScost',
          Cell: this.renderValue
        }
      ]
    }, {
      Header: 'Diff',
      columns: [
        {
          Header: 'CPM',
          accessor: 'diffCpm',
          Cell: this.renderValue
        }, {
          Header: 'Imp',
          accessor: 'diffImp',
          Cell: this.renderValue
        }, {
          Header: 'Revenue',
          accessor: 'diffRev',
          Cell: this.renderValue
        }
      ]
    }]
    return (
      <Paper className={classes.root}>
        <ReactTable
          data={data}
          columns={columns}
          showPageJump={false}
          freezeWhenExpanded
          filterable
          defaultPageSize={100}
          pageSizeOptions={[50, 100, 500, 1000]}
          style={{
            height: '80vh'
          }}
          className='-striped -highlight'
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(TagReport)
