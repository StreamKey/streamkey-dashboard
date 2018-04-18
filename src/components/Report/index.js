import React from 'react'
import { withStyles } from 'material-ui/styles'
import numeral from 'numeral'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

const styles = theme => {
  return {
    root: {
      maxWidth: '100%',
      overflowX: 'scroll'
    },
    table: {
      minWidth: 700
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default
      }
    }
  }
}

class Report extends React.Component {
  renderHeader = () => {
    return <TableHead>
      <TableRow>
        {
          this.props.header.map((h, i) => <TableCell
            key={i}
            numeric={h.type === 'integer' ? true : undefined}>
            {h.title}
          </TableCell>)
        }
      </TableRow>
    </TableHead>
  }

  renderBody = () => {
    return <TableBody>
      {
        this.props.data.map((d, i) => {
          return this.renderRow(d, i)
        })
      }
    </TableBody>
  }

  renderRow = (row, n) => {
    const { classes } = this.props
    return <TableRow className={classes.row} key={n}>
      {
        this.props.header.map((h, i) => <TableCell
          key={i}
          numeric={h.type !== 'string' ? true : undefined}>
          {this.renderValue(h.type, row[h.key])}
        </TableCell>)
      }
    </TableRow>
  }

  renderValue = (type, val) => {
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
    const { classes } = this.props
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          {this.renderHeader()}
          {this.renderBody()}
        </Table>
      </Paper>
    )
  }
}

export default withStyles(styles)(Report)
