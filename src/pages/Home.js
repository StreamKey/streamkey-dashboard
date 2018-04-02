import React from 'react'
import { withStyles } from 'material-ui/styles'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const styles = theme => {
  return {
    root: {
    },
    main: {
      backgroundColor: theme.palette.primary.main,
      paddingTop: theme.spacing.huge,
      paddingBottom: theme.spacing.big,
      '& h2': {
        textAlign: 'center',
        fontWeight: 300,
        paddingTop: theme.spacing.quad,
        paddingBottom: theme.spacing.quad,
      }
    }
  }
}

class Home extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.main}>
          <h2>StreamKey Admin</h2>
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(Home)
