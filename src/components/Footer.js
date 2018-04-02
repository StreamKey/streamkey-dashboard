import React from 'react'
import { withStyles } from 'material-ui/styles'

import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'

const styles = theme => {
  return {
    root: {
      padding: theme.spacing.triple,
      paddingRight: 0,
      ...theme.typography.caption,
      display: 'flex',
      justifyContent: 'space-between',
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

const buttonStyles = theme => {
  return {
    root: {
      ...theme.typography.caption,
      color: theme.palette.text.secondary,
      textTransform: 'none',
      '&:hover': {
        color: theme.palette.text.primary,
        backgroundColor: 'transparent'
      }
    }
  }
}
const StyledButton = withStyles(buttonStyles)(Button)

class Footer extends React.Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.root} with-border={this.props.withBorder ? 'true' : 'false'}>
        <div className={classes.text}>
          StreamKey
        </div>
        <div>
          <StyledButton to='/terms' component={Link} disableRipple>
            Terms
          </StyledButton>
          <StyledButton to='/privacy' component={Link} disableRipple>
            Privacy
          </StyledButton>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Footer)
