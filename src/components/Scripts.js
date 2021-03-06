import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import DatePicker from 'material-ui-pickers/DatePicker'

import Checkbox from '@material-ui/core/Checkbox'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import SuccessSvg from 'mdi-material-ui/Check'
import ErrorSvg from 'mdi-material-ui/AlertCircleOutline'

import API from './API'
import { asList, sspList, getPartnerName } from '../components/Utils'

const BEACHFRONT_REPORT_ID = process.env.RAZZLE_CREDENTIALS_BEACHFRONT_REPORT_ID
const beachfrontWarningMessage = `Beachfront data is pulled via a specific report ("Yesterday- API": ${BEACHFRONT_REPORT_ID}). Make sure this report date matches the date selected and check this checkbox before running the script.`

const styles = theme => {
  return {
    root: {
      width: '100%',
      ...theme.utils.container,
      marginTop: theme.spacing.double,
      marginBottom: theme.spacing.double
    },
    form: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap'
    },
    formControl: {
      margin: theme.spacing.double
    },
    datepicker: {
      maxWidth: 120
    },
    submitContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    beachfrontWarning: {
      alignSelf: 'flex-start'
    },
    button: {
      marginBottom: theme.spacing.double,
      paddingLeft: theme.spacing.quad,
      paddingRight: theme.spacing.quad
    },
    icon: {
      marginRight: theme.spacing.unit
    },
    progress: {
      marginRight: theme.spacing.unit,
      color: theme.palette.grey[500]
    },
    error: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.red[500],
      '& svg': {
        fill: theme.palette.red[400]
      }
    },
    success: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.green[500],
      '& svg': {
        fill: theme.palette.green[400]
      }
    }
  }
}

class Scripts extends React.Component {
  constructor (props) {
    super(props)
    const state = {
      script: 'fetchData',
      as: {},
      ssp: {},
      date: moment().startOf('day').subtract(1, 'days'),
      beachfrontCheck: null,
      isLoading: false,
      isDone: false,
      error: false
    }
    for (let p of asList) {
      state.as[p] = false
    }
    for (let p of sspList) {
      state.ssp[p] = false
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
    this.setState({ ssp: tmp }, this.beachfrontDisplayCheck)
  }

  onDateChange = date => {
    this.setState({ date }, this.beachfrontDisplayCheck)
  }

  beachfrontDisplayCheck = () => {
    if (this.state.ssp.beachfront === true && this.state.date.format('YYYY-MM-DD') !== moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD')) {
      this.setState({ beachfrontCheck: false })
    } else if (this.state.beachfrontCheck !== null) {
      this.setState({ beachfrontCheck: null })
    }
  }

  toggleBeachfrontCheck = () => {
    this.setState({ beachfrontCheck: !this.state.beachfrontCheck })
  }

  renderDate = date => {
    return date.format('YYYY-MM-DD')
  }

  exec = () => {
    this.setState({
      ...this.state,
      isLoading: true,
      isDone: false
    }, async () => {
      try {
        const form = {
          as: [],
          ssp: [],
          date: this.state.date.format('YYYY-MM-DD')
        }
        for (let p in this.state.as) {
          if (this.state.as[p]) {
            form.as.push(p)
          }
        }
        for (let p in this.state.ssp) {
          if (this.state.ssp[p]) {
            form.ssp.push(p)
          }
        }
        const res = await API.post('/exec/' + this.state.script, form)
        const { stderr } = res.data
        console.log('stderr', stderr)
        if (res.data.success !== true) {
          console.error(res)
        }
        this.setState({
          ...this.state,
          isLoading: false,
          isDone: true,
          error: res.data.success !== true ? res.data.error.message || 'Something went wrong' : (stderr.length > 0 ? stderr : false)
        })
      } catch (e) {
        console.error(e)
        this.setState({
          ...this.state,
          isLoading: false,
          isDone: true,
          error: e.message || 'Something went wrong'
        })
      }
    })
  }

  render () {
    const { classes } = this.props
    const { script, as, ssp, date, beachfrontCheck } = this.state
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
        <div className={classes.form}>
          <FormControl component='fieldset' className={classes.formControl}>
            <FormLabel component='legend'>Date</FormLabel>
            <DatePicker
              className={classes.datepicker}
              value={date}
              onChange={this.onDateChange}
              labelFunc={this.renderDate}
            />
          </FormControl>
          {
            script === 'fetchData' && <React.Fragment>
            <FormControl component='fieldset' className={classes.formControl}>
              <FormLabel component='legend'>Ad Servers</FormLabel>
              {
                asList.map(p => <FormGroup key={`as-${p}`}>
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
                sspList.map(p => <FormGroup key={`ssp-${p}`}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={ssp[p]} onChange={this.toggleSsp(p)} />
                    }
                    label={getPartnerName(p)}
                  />
                </FormGroup>)
              }
            </FormControl>
            </React.Fragment>
          }
        </div>
        <div className={classes.submitContainer}>
          {
            beachfrontCheck !== null && <FormControlLabel
              className={classes.beachfrontWarning}
              control={
                <Checkbox checked={beachfrontCheck} onChange={this.toggleBeachfrontCheck} />
              }
              label={beachfrontWarningMessage}
            />
          }
          <Button
            className={classes.button}
            color='primary'
            variant='contained'
            onClick={this.exec}
            disabled={this.state.isLoading || beachfrontCheck === false}
          >
            Run
          </Button>
          <div>
            {
              !this.state.isLoading && !this.state.isDone &&
              <span>&nbsp;</span>
            }
            {
              this.state.isLoading &&
              <CircularProgress size={24} className={classes.progress} />
            }
            {
              this.state.isDone && this.state.error &&
              <div className={classes.error}>
                <ErrorSvg className={classes.icon} />
                {this.state.error}
              </div>
            }
            {
              this.state.isDone && !this.state.error &&
              <div className={classes.success}>
                <SuccessSvg className={classes.icon} /> Done
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Scripts)
