import React from 'react'
import { withStyles } from 'material-ui/styles'
import numeral from 'numeral'
import ReactTable from 'react-table'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
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
  render () {
    const { classes, data } = this.props
    const total = {
      revenue: 1234.1234,
      profit: 1234.1234,
      margin: 34.1234
    }
    const columns = [{
      Header: 'Demand',
      accessor: 'ssp'
    }, {
      Header: 'LKQD',
      columns: [
        {
          Header: 'Profit',
          accessor: 'lkqd.profit'
        }, {
          Header: 'Margin',
          accessor: 'lkqd.margin'
        }
      ]
    }, {
      Header: 'StreamRail',
      columns: [
        {
          Header: 'Profit',
          accessor: 'streamrail.profit'
        }, {
          Header: 'Margin',
          accessor: 'streamrail.margin'
        }
      ]
    }, {
      Header: 'SpringServe',
      columns: [
        {
          Header: 'Profit',
          accessor: 'springserve.profit'
        }, {
          Header: 'Margin',
          accessor: 'springserve.margin'
        }
      ]
    }, {
      Header: 'Aniview',
      columns: [
        {
          Header: 'Profit',
          accessor: 'aniview.profit'
        }, {
          Header: 'Margin',
          accessor: 'aniview.margin'
        }
      ]
    }]
    return (
      <div className={classes.root}>
        <Paper className={classes.tableContainer}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Revenue</TableCell>
                <TableCell>Profit</TableCell>
                <TableCell>Margin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{numeral(total.revenue).format('$0,0.0')}</TableCell>
                <TableCell>{numeral(total.profit).format('$0,0.0')}</TableCell>
                <TableCell>{numeral(total.margin).format('0a%')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
