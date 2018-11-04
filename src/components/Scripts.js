import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

import API from './API'
import { asList, sspList, getPartnerName } from '../components/Utils'

const styles = theme => {
  return {
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: theme.spacing.double,
      marginBottom: theme.spacing.double
    },
    formControl: {
      margin: theme.spacing.double
    }
  }
}

class ConfigurationUI extends React.Component {
  constructor (props) {
    super(props)
    const state = {
      script: 'fetchData',
      as: {},
      ssp: {}
    }
    for (let p of asList) {
      state.as[p] = true
    }
    for (let p of sspList) {
      state.ssp[p] = true
    }
    this.state = state
  }

  onScriptChange = event => {
    this.setState({ script: event.target.value })
  }

  toggleAs = as => () => {
    const tmp = this.state.as
    for (let p in tmp) {
      if (p === as) {
        tmp[p] = !tmp[p]
      }
    }
    this.setState({ as: tmp })
  }

  toggleSsp = ssp => () => {
    const tmp = this.state.ssp
    for (let p in tmp) {
      if (p === ssp) {
        tmp[p] = !tmp[p]
      }
    }
    this.setState({ ssp: tmp })
  }

  render () {
    const { classes } = this.props
    const { script, as, ssp } = this.state
    return (
      <div className={classes.root}>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend'>Script</FormLabel>
          <RadioGroup
            aria-label='Script'
            name='script'
            className={classes.group}
            value={script}
            onChange={this.onScriptChange}
          >
            <FormControlLabel value='fetchData' control={<Radio />} label='Fetch Data' />
            <FormControlLabel value='createReport' control={<Radio />} label='Create Report' />
          </RadioGroup>
        </FormControl>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend'>Ad Servers</FormLabel>
          {
            asList.map(p => <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={as[p]} onChange={this.toggleAs(p)} />
                }
                label={getPartnerName(p)}
              />
            </FormGroup>)
          }
        </FormControl>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormLabel component='legend'>SSPs</FormLabel>
          {
            sspList.map(p => <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox checked={ssp[p]} onChange={this.toggleSsp(p)} />
                }
                label={getPartnerName(p)}
              />
            </FormGroup>)
          }
        </FormControl>
      </div>
    )
  }
}

export default withStyles(styles)(ConfigurationUI)
