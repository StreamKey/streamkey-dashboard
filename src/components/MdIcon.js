import React, { Component } from 'react'
import ReactSVG from 'react-svg'

import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    root: {
      display: 'inline-block',
      color: 'currentColor',
      fill: 'currentColor',
      height: 24,
      width: 24,
      userSelect: 'none'
    },
    wrapper: {
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& > div': {
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  }
}

class MdIcon extends Component {
  render() {
    const { classes } = this.props
    return (
      <ReactSVG
        path={this.props.svg}
        className={classes.root}
        wrapperClassName={classes.wrapper}
        {...this.props}
        />
    )
  }
}

export default withStyles(styles)(MdIcon)
