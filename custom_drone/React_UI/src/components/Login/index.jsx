import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { Link, withRouter, useHistory } from 'react-router-dom'
import "./style.css"
import firebase from '../firebase'


const LoginPage = (props) => {
  if(firebase.getCurrentUsername()) {
		// not logged in
		alert('Already Logged In')
		props.history.replace('/dashboard')
		return null
  }
  return <Login/>;
};

const useStyles = makeStyles((theme) => ({
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
}));

function Login() {
  
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function login() {
		try {
			await firebase.login(email, password)
			history.replace('/dashboard')
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
                          <h5 class="card-title">Signin</h5>
                          <p class="card-text">Follow the easy steps</p>
                          <form class="row was-validated" onSubmit={e => e.preventDefault() && false}>
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
                                      label="Email Username"
                                      autoComplete="email"
                                      autoFocus
                                    />
                                  </div>
                                  <div class="error-log">
                                      <small class="error-message">username required</small>
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
                                  <div class="error-log">
                                      <small class="error-message">password required</small>
                                  </div>
                              </div>
                              <div class="col-lg-12 field">
                                  <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className="btn btn-submit btn-block"
                                    onClick={login}
                                  >
                                    Sign In
                                  </Button>
                              </div>
                              <div class="col-lg-12 field">
                                <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        component={Link}
                                        to="/register"
                                        className={classes.submit}
                                >
                                        Register
                                </Button>
                              </div>
                              <div class="col-lg-12 field">
                                  {/* <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        component={Link}
                                        to="/resetPassword"
                                        className={classes.submit}
                                >
                                        Forgot Password?
                                </Button> */}
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </Container>
  );
}

export default withRouter(LoginPage)