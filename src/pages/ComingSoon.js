import React from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.double,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '100%',
      minHeight: 400
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    }
  }
}

class ComingSoon extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <h3 className={classes.title}>Coming Soon</h3>
      </div>
    )
  }
}

export default withStyles(styles)(ComingSoon)
