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
    }
  }
}

class DiscrepancyReport extends React.Component {
  renderValue = (type, color = false) => cell => {
    const val = cell.value
    if (val === null) {
      return ''
    }
    let formattedVal
    switch (type) {
      case 'integer':
        formattedVal = numeral(val).format('0,')
        break
      case 'float':
        formattedVal = numeral(val).format('0,0.0')
        break
      case 'percent':
        formattedVal = numeral(val).format('0a%')
        break
      case 'usd':
        formattedVal = numeral(val).format('$0,0.0')
        break
      default:
        formattedVal = val
    }
    if (color) {
      return <span>{formattedVal}</span>
    } else {
      return formattedVal
    }
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
          Cell: this.renderValue('usd')
        }, {
          Header: 'StreamRail',
          accessor: 'streamrail.revenue',
          Cell: this.renderValue('usd')
        }, {
          Header: 'SpringServe',
          accessor: 'springserve.revenue',
          Cell: this.renderValue('usd')
        }, {
          Header: 'Aniview',
          accessor: 'aniview.revenue',
          Cell: this.renderValue('usd')
        }
      ]
    }, {
      Header: 'Diff',
      columns: [
        {
          Header: '$',
          accessor: 'diff.usd',
          Cell: this.renderValue('usd', true)
        }, {
          Header: '%',
          accessor: 'diff.percent',
          Cell: this.renderValue('percent', true)
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
