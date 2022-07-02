import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect} from "react-router-dom";
import { CssBaseline, CircularProgress } from '@material-ui/core'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import firebase from '../firebase'
import './style.css'

//pages
import Dashboard from "../Dashboard/index.jsx";
import Login from "../Login/index.jsx";
import Register from "../Register/index.js";
import ResetPassword from "../ResetPassword/index.js";

const theme = createMuiTheme()

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false)

	useEffect(() => {
		firebase.isInitialized().then(val => {
			setFirebaseInitialized(val)
		})
	})


	return firebaseInitialized !== false ? (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Switch>
					<Route exact path="/">
						{<Redirect to="/login" />}
					</Route>
					<Route exact path="/login" component={Login} />
					<Route exact path="/register" component={Register} />
					<Route exact path="/dashboard" component={Dashboard} />
					<Route exact path="/resetPassword" component={ResetPassword} />
				</Switch>
			</Router>
		</MuiThemeProvider>
	) : <div id="loader"><CircularProgress /></div>
}


