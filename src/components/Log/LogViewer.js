import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { isObject } from 'lodash'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import JsonViewer from './JsonViewer'

const styles = theme => {
  return {
    table: {
      width: '100%',
      overflowX: 'scroll'
    },
    row: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default
      }
    }
  }
}

const SimpleLogViewer = props => {
  const { classes, rows } = props
  return (
    <Table className={classes.table}>
      <TableBody>
        {
          rows.map((r, n) => (
            <TableRow className={classes.row} key={n}>
              <TableCell>
                {r}
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

const WinstonLogViewer = props => {
  const { classes, rows } = props
  return (
    <Table className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell>
            Date
          </TableCell>
          <TableCell>
            Time
          </TableCell>
          <TableCell>
            Level
          </TableCell>
          <TableCell>
            Message
          </TableCell>
          <TableCell>
            Data
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          rows.map((r, n) => (
            <TableRow className={classes.row} key={n}>
              <TableCell>
                {r.date}
              </TableCell>
              <TableCell>
                {r.time}
              </TableCell>
              <TableCell>
                {r.level}
              </TableCell>
              <TableCell>
                {r.message}
              </TableCell>
              <TableCell>
                <JsonViewer jsonStr={r.data} />
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}

class LogViewer extends React.Component {
  render () {
    const { classes, rows } = this.props
    if (isObject(rows[0])) {
      return <WinstonLogViewer classes={classes} rows={rows} />
    } else {
      return <SimpleLogViewer classes={classes} rows={rows} />
    }
  }
}

export default withStyles(styles)(LogViewer)
