import React, { useState, useEffect } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { mainListItems } from './listitems.js';
import Chart from './chart';
import Records from './records';
import { withRouter, useHistory } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import firebase from '../firebase';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import { store } from 'react-notifications-component';
import 'animate.css'


const theme = createMuiTheme({
    palette: {
      primary: {
        // Purple and green play nicely together.
        main: '#b30000',
      },
      secondary: {
        // This is green.A700 as hex.
        main: '#11cb5f',
      },
    },
  });

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    // overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 330,
  },
}));



function Dashboard() {
    const classes = useStyles();
    const history = useHistory();
    const [open, setOpen] = React.useState(false);
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const [allDates, setAllDates] = useState([]);
    const db = firebase.db

    const [currentDate, setCurrentDate] = useState(new Date());

    

    useEffect(() => {
        var rootRef = db.ref();
        const audio = new Audio("https://audio.jukehost.co.uk/ZNljSp6JHDUmVZn0qWsb4Wr4tAV2NR6x")
        rootRef.on('value', function(snapshot){
            setAllDates(Object.keys(snapshot.val()));
            audio.play()
            handleNotification()
        })
        const handleNotification = () => {
          store.addNotification({
              title: "Update",
              message: "Data is loaded",
              type: "info",
              insert: "top",
              container: "top-center",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 3000,
              },
            });
        }
    }, [db])

    if(allDates != null){
        allDates.forEach(function(part, index) {
            this[index] = new Date(part);
          }, allDates);
    }

    const modifiers = {
            available: allDates,
      };
    const modifiersStyles = {
        available: {
            color: '#ffffff',
            backgroundColor: '#b30000',
        },
    };

    async function logout() {
            await firebase.logout();
            history.push('/login')
        }

    const secondaryListItems = (
        <div>
        <ListItem button onClick={logout}>
            <ListItemIcon>
            <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
        </ListItem>
        </div>
    );

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <ThemeProvider theme={theme}>
        <div className={classes.root}>
        <CssBaseline />
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
            <Toolbar className={classes.toolbar}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
                <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                Dashboard
            </Typography>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
        >
            <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
                <ChevronLeftIcon />
            </IconButton>
            </div>
            <Divider />
            <List>{mainListItems}</List>
            <Divider />
            <List>{secondaryListItems}</List>
        </Drawer>
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Grid container spacing={3}>
                  {/* Chart */}
                  <Grid item xs={12} md={8} lg={9}>
                  <Paper className={fixedHeightPaper}>
                      <Chart choosenDate={currentDate}/>
                  </Paper>
                  </Grid>
                  {/* Year */}
                  <Grid item xs={12} md={4} lg={3}>
                  <Paper className={fixedHeightPaper}>
                  <DayPicker
                      month={currentDate}
                      onDayClick={e=>setCurrentDate(e)}
                      modifiers={modifiers}
                      modifiersStyles={modifiersStyles}
                  />
                  </Paper>
                  </Grid>
                  {/* Recent Orders */}
                  <Grid item xs={12}>
                  <Paper className={classes.paper}>
                      <Records choosenDate={currentDate}/>
                  </Paper>
                  </Grid>
              </Grid>
            </Container>
        </main>
        </div>
        </ThemeProvider>
    );
}

export default withRouter(Dashboard);