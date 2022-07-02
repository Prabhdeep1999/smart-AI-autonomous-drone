import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import "./style.css"
import firebase from '../firebase'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'

const styles = theme => ({
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
})


function Register(props) {
    const { classes } = props

  const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

    async function onRegister() {
		try {
      await firebase.register(name, email, password)
      console.log(name, email, password, props.history)
			props.history.replace('/dashboard')
		} catch(error) {
			alert(error.message)
		}
	}

  return (
    
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div class="container-fluid login-page">
          <div class="row">
              <div class="col-lg-4 form-layout padding-0 offset-lg-4">
                  <div class="card">
                      <div class="card-header">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="Logo" />    
                      </div>
                      <div class="card-body">
                          <h5 class="card-title">Register</h5>
                          <p class="card-text">Follow the easy steps</p>
                          <form class="row was-validated" onSubmit={e => e.preventDefault() && false}>
                              <div class="col-lg-12 field">
                                  <div class="input-group form-group">
                                    <TextField
                                      // variant="outlined"
                                      margin="normal"
                                      required
                                      fullWidth
                                      value={name}
                                      onInput={e => setName(e.target.value)}
                                      id="name"
                                      label="Username"
                                      autoComplete="name"
                                      autoFocus
                                    />
                                  </div>
                              </div>
                              <div class="col-lg-12 field">
                                  <div class="input-group form-group">
                                    <TextField
                                      // variant="outlined"
                                      margin="normal"
                                      required
                                      fullWidth
                                      value={email}
                                      onInput={e => setEmail(e.target.value)}
                                      id="email"
                                      label="Email"
                                      autoComplete="email"
                                      autoFocus
                                    />
                                  </div>
                              </div>
                              <div class="field">
                                  <div class="input-group form-group">
                                        <TextField
                                          // variant="outlined"
                                          margin="normal"
                                          required
                                          fullWidth
                                          value={password}
                                          onInput={e => setPassword(e.target.value)}
                                          label="Password"
                                          type="password"
                                          id="password"
                                          autoComplete="current-password"
                                        />
                                  </div>
                                </div>
                              <div class="col-lg-12 field">
                                  <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={onRegister}
                                    className="btn btn-submit btn-block"
                                  >
                                    Register
                                  </Button>
                              </div>
                              <div class="col-lg-12 field">
                                <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        component={Link}
                                        to="/login"
                                        className={classes.submit}
                                >
                                        Go back to Login
                                </Button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </Container>
  )
}

export default withRouter(withStyles(styles)(Register))