import React from 'react'
import { withStyles } from 'material-ui/styles'

import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import API from '../components/API'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const styles = theme => {
  return {
    root: {
    },
    container: {
      ...theme.utils.container,
      padding: theme.spacing.double
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    },
    reportContainer: {},
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

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      header: [],
      data: [],
      isLoading: false,
      error: false
    }
  }

  componentDidMount () {
    this.getReport()
  }

  getReport () {
    this.setState({
      ...this.state,
      isLoading: true,
      error: false
    }, async () => {
      const form = {}
      const response = await API.get('/report', form)
      this.setState({
        ...this.state,
        header: response.data.report.header,
        data: response.data.report.data,
        isLoading: false,
        error: false
      })
    })
  }

  renderHeader = () => {
    return <TableHead>
      <TableRow>
        {
          this.state.header.map((h, i) => <TableCell
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
        this.state.data.map((d, i) => {
          return this.renderRow(d, i)
        })
      }
    </TableBody>
  }

  renderRow = (row, n) => {
    const { classes } = this.props
    return <TableRow className={classes.row} key={n}>
      {
        this.state.header.map((h, i) => <TableCell
          key={i}
          numeric={h.type === 'integer' ? true : undefined}>
          {row[h.key]}
        </TableCell>)
      }
    </TableRow>
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.container}>
          <h3 className={classes.title}>Daily Report</h3>
          <Paper className={classes.reportContainer}>
            <Table className={classes.table}>
              {this.renderHeader()}
              {this.renderBody()}
            </Table>
          </Paper>
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(Home)
