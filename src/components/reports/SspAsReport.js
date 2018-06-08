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
      fontWeight: 300
    }
  }
}

class SspAsReport extends React.Component {
  renderValue = type => cell => {
    const val = cell.value
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
    const { classes, data, total } = this.props
    const totalColumns = [
      {
        Header: '',
        Cell: 'Total'
      }, {
        Header: 'Revenue',
        accessor: 'revenue',
        Cell: this.renderValue('usd')
      }, {
        Header: 'Profit',
        accessor: 'profit',
        Cell: this.renderValue('usd')
      }, {
        Header: 'Margin',
        accessor: 'margin',
        Cell: this.renderValue('percent')
      }
    ]
    const columns = [{
      Header: 'Demand',
      accessor: 'ssp'
    }, {
      Header: 'LKQD',
      columns: [
        {
          Header: 'Profit',
          accessor: 'lkqd.profit',
          Cell: this.renderValue('usd')
        }, {
          Header: 'Margin',
          accessor: 'lkqd.margin',
          Cell: this.renderValue('percent')
        }
      ]
    }, {
      Header: 'StreamRail',
      columns: [
        {
          Header: 'Profit',
          accessor: 'streamrail.profit',
          Cell: this.renderValue('usd')
        }, {
          Header: 'Margin',
          accessor: 'streamrail.margin',
          Cell: this.renderValue('percent')
        }
      ]
    }, {
      Header: 'SpringServe',
      columns: [
        {
          Header: 'Profit',
          accessor: 'springserve.profit',
          Cell: this.renderValue('usd')
        }, {
          Header: 'Margin',
          accessor: 'springserve.margin',
          Cell: this.renderValue('percent')
        }
      ]
    }, {
      Header: 'Aniview',
      columns: [
        {
          Header: 'Profit',
          accessor: 'aniview.profit',
          Cell: this.renderValue('usd')
        }, {
          Header: 'Margin',
          accessor: 'aniview.margin',
          Cell: this.renderValue('percent')
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
            showPageJump={false}
            defaultPageSize={1}
            PaginationComponent={() => <div />}
          />
        </Paper>
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

export default withStyles(styles)(SspAsReport)
