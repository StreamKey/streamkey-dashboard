import React from 'react'
import { Redirect } from 'react-router-dom'
import moment from 'moment'

class RedirectToYesterday extends React.PureComponent {
  render () {
    const yesterday = moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD')
    return (
      <Redirect
        to={{
          pathname: `${this.props.match.url}/${yesterday}:${yesterday}`
        }}
      />
    )
  }
}

export default RedirectToYesterday
