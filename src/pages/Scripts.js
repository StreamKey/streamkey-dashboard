import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Scripts from '../components/Scripts'

const styles = theme => {
  return {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: theme.spacing.quad,
      paddingLeft: theme.spacing.double,
      paddingRight: theme.spacing.double
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      marginTop: theme.spacing.quad,
      marginBottom: 0,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    }
  }
}

class ScriptsPage extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Scripts</h3>
        <Scripts />
      </div>
    )
  }
}

export default withStyles(styles)(ScriptsPage)
