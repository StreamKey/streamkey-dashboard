import React from 'react'
import { withStyles } from 'material-ui/styles'
import numeral from 'numeral'
import each from 'lodash/each'

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel
} from 'material-ui/Table'
import Paper from 'material-ui/Paper'

const styles = theme => {
  return {
    root: {
      maxWidth: '100%',
      overflowX: 'scroll',
      position: 'relative'
    },
    inner: {
      overflowX: 'scroll',
      overflowY: 'visible',
      marginLeft: 260
    },
    table: {
      width: 'auto',
      tableLayout: 'fixed'
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default
      }
    },
    fixedCell: {
      height: 'inherit',
      position: 'absolute',
      marginLeft: -260,
      width: 260,
      overflowX: 'hidden',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      transform: 'translateY(1px)'
    },
    sspCell: {
      backgroundColor: theme.palette.green[50]
    },
    asCell: {
      backgroundColor: theme.palette.red[50]
    }
  }
}

class Report extends React.Component {
  changeOrderBy = key => {
    this.props.onChangeOrder && this.props.onChangeOrder({
      orderBy: key,
      order: this.props.orderBy === key && this.props.order === 'asc' ? 'desc' : 'asc'
    })
  }

  calcTotal = () => {
    const { header, data } = this.props
    const total = {}
    each(header, (h, n) => {
      if (h.key === 'tag') {
        total[h.key] = 'Total'
      } else if (h.type === 'string') {
        total[h.key] = ''
      } else {
        total[h.key] = 0
      }
    })
    each(data, row => {
      each(header, (h, n) => {
        if (h.key !== 'tag' && h.type !== 'string') {
          total[h.key] += Number(row[h.key])
        }
      })
    })
    return total
  }

  renderHeader = () => {
    const { header, orderBy, order, classes } = this.props
    return <TableHead>
      <TableRow>
        {
          header.map((h, n) => <TableCell
            key={h.key}
            numeric={h.type === 'string' ? undefined : true}
            className={n === 0 ? classes.fixedCell : classes.cell}
          >
            <TableSortLabel
              active={orderBy === h.key}
              direction={order}
              onClick={() => this.changeOrderBy(h.key)}
            >
              {h.title}
            </TableSortLabel>
          </TableCell>)
        }
      </TableRow>
    </TableHead>
  }

  renderBody = () => {
    const total = this.calcTotal()
    return <TableBody>
      {
        this.props.data.map((d, i) => {
          return this.renderRow(d, i)
        })
      }
      {
        this.renderRow(total, 0)
      }
    </TableBody>
  }

  renderRow = (row, n) => {
    const { classes } = this.props
    return <TableRow className={classes.row} key={n}>
      {
        this.props.header.map((h, i) => <TableCell
          key={i}
          className={i === 0 ? classes.fixedCell : (h.group === 'ssp' ? classes.sspCell : (h.group === 'as' ? classes.asCell : classes.cell))}
          numeric={h.type !== 'string' ? true : undefined}
        >
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
        <div className={classes.inner}>
          <Table className={classes.table}>
            {this.renderHeader()}
            {this.renderBody()}
          </Table>
        </div>
      </Paper>
    )
  }
}

export default withStyles(styles)(Report)
