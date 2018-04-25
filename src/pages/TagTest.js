import React from 'react'
import { withStyles } from 'material-ui/styles'

import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Checkbox from 'material-ui/Checkbox'
import {
  FormControlLabel
} from 'material-ui/Form'

import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

import TagParser from '../components/Report/TagParser'

const styles = theme => {
  return {
    root: {
    },
    container: {
      padding: theme.spacing.double,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    title: {
      textAlign: 'center',
      fontWeight: 300,
      paddingTop: theme.spacing.quad,
      paddingBottom: theme.spacing.double
    },
    form: {
      maxWidth: 900,
      '& > *': {
        marginBottom: theme.spacing.double
      }
    }
  }
}

class TagTest extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      input: '',
      isTremor: false,
      output: '',
      error: false
    }
  }

  handleChange = e => {
    this.setState({
      ...this.state,
      input: e.target.value
    })
  }

  toggleIsTremor = () => {
    this.setState({
      ...this.state,
      isTremor: !this.state.isTremor
    })
  }

  testTag = () => {
    try {
      const output = TagParser(this.state.input, this.state.isTremor ? 'telaria' : 'other')
      this.setState({
        ...this.state,
        output,
        error: false
      })
    } catch (e) {
      this.setState({
        ...this.state,
        output: e.message,
        error: true
      })
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <NavBar />
        <div className={classes.container}>
          <h3 className={classes.title}>Tag Tester</h3>
          <div className={classes.form}>
            <TextField
              label='Input'
              value={this.state.input}
              onChange={this.handleChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.isTremor}
                  onChange={this.toggleIsTremor}
                />
              }
              label='Tremor'
            />
            <Button variant='raised' onClick={this.testTag}>
              Test
            </Button>
            <TextField
              label='Output'
              value={this.state.output}
              error={this.state.error}
              multiline
              fullWidth
            />
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default withStyles(styles)(TagTest)
