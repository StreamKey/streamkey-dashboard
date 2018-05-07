import React from 'react'
import { withStyles } from 'material-ui/styles'

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from 'material-ui/Table'

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

class LogViewer extends React.Component {
  render () {
    const { classes, rows } = this.props
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
}

export default withStyles(styles)(LogViewer)
