import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.triple,
      paddingRight: 0,
      ...theme.typography.caption,
      display: 'flex',
      justifyContent: 'center',
      '&[with-border=true]': {
        borderTop: '1px solid ' + theme.palette.divider
      },
      ...theme.utils.container
    },
    text: {
      padding: theme.spacing.unit,
      paddingLeft: 0
    }
  }
}

class Footer extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root} with-border={this.props.withBorder ? 'true' : 'false'}>
        <div className={classes.text}>
          StreamKey
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Footer)
