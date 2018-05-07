import React from 'react'
import { withStyles } from 'material-ui/styles'
import ReactJson from 'react-json-view'

const styles = theme => {
  return {
    root: {
      fontFamily: 'monospace'
    },
    clickable: {
      cursor: 'pointer',
      opacity: 0.7,
      '&:hover': {
        opacity: 1
      }
    }
  }
}

class JsonViewer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      json: {}
    }
  }

  open = () => {
    if (this.state.isOpen) {
      return
    }
    const json = JSON.parse(this.props.jsonStr)
    this.setState({
      ...this.state,
      isOpen: true,
      json
    })
  }

  render () {
    const { classes, jsonStr } = this.props
    const { isOpen, json } = this.state
    const rootClass = classes.root + (isOpen ? '' : ' ' + classes.clickable)
    return (
      <div className={rootClass} onClick={this.open}>
        {
          isOpen &&
            <ReactJson
              src={json}
              displayObjectSize={false}
              displayDataTypes={false}
              indentWidth={2}
              collapseStringsAfterLength={20}
            />
        }
        {
          !isOpen && <span>
            {jsonStr.substring(0, 30)}
            {jsonStr.length > 30 ? '...' : ''}
          </span>
        }
      </div>
    )
  }
}

export default withStyles(styles)(JsonViewer)
