import React from 'react'
import { withStyles } from 'material-ui/styles'

import Logo from '../assets/streamkey-logo-greyscale.png'

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
    },
    logo: {
      opacity: 0.5,
      maxHeight: 30,
      height: '100%',
      width: 'auto'
    }
  }
}

class Footer extends React.Component {
  render () {
    const { classes } = this.props
    return (
      <div className={classes.root} with-border={this.props.withBorder ? 'true' : 'false'}>
        <div className={classes.text}>
          <img className={classes.logo} src={Logo} alt='StreamKey Logo' />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Footer)
