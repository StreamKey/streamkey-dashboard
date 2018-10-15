import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import ConfigurationUI from '../components/ConfigurationUI'

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

class ConfigurationUIPage extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Configuration UI</h3>
        <ConfigurationUI />
      </div>
    )
  }
}

export default withStyles(styles)(ConfigurationUIPage)
