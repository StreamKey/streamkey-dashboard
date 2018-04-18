import React from 'react'
import { withStyles } from 'material-ui/styles'

import Report from '../components/Report/'
import API from '../components/API'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const styles = theme => {
  return {
    root: {
    },
    container: {
      padding: theme.spacing.double,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '100%'
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
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

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.container}>
          <h3 className={classes.title}>Daily Report</h3>
          <Report
            header={this.state.header}
            data={this.state.data}
            />
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(Home)
