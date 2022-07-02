import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './title';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import TablePagination from '@material-ui/core/TablePagination';
import MyMapComponent from './gmaps.js'

import "react-datepicker/dist/react-datepicker.css";
import 'react-notifications/lib/notifications.css';

function changeDateFormat(date) {
    var d = new Date(date)
    var dd = String(d.getDate()).padStart(2, '0');
    var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = d.getFullYear();
  
    let returnDate = yyyy + '-' + mm + '-' + dd;
  
    return returnDate
  
  }

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

function Row(props) {
    const { row } = props;
    const lat = row.lat //21.1378419; //Chnage to row.lat when using for production
    const lng = row.lat //78.7403725; //change to row.lng when using for production
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
  
    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" align="left">
            {row.class}
          </TableCell>
          <TableCell align="left">{row.date}</TableCell>
          {/* <TableCell align="left">{row.lat}</TableCell>
          <TableCell align="left">{row.long}</TableCell> */}
          <TableCell align="left">{row.timestamp}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}> {/*If displaying lat lng change colspan to 6*/}
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell colSpan={2}>Image</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        <img src={row.image} alt="Not Available"/>
                      </TableCell>
                      <TableCell>{<MyMapComponent lat={lat} lng={lng} />}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }
  
  Row.propTypes = {
    row: PropTypes.shape({
      class: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      timestamp: PropTypes.string.isRequired,
    }).isRequired,
  };
  

export default function Records(props) {
    const [displayData, setDisplayData] = useState([{class:'', date:'',lat:0,lng:0,timestamp:''}]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    useEffect(() => {
        const db = firebase.db
        var rootRef = db.ref(changeDateFormat(props.choosenDate));
        rootRef.on('value', function(snapshot){
            if(snapshot.exists()){
                // setInputData(snapshot.val())
                var data = snapshot.val()
                var listOfObjects = []
                for (var k in data){
                    listOfObjects.push(data[k])
                }
                setDisplayData(listOfObjects.reverse())
            } else {
              setDisplayData([{class:'', date:'',lat:0,lng:0,timestamp:''}])
            }
        })
    }, [props.choosenDate])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };    

    return (
        <React.Fragment>
        <Title>Captured Data</Title>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left"></TableCell>
              <TableCell align="left">Class</TableCell>
              <TableCell align="left">Date</TableCell>
              {/* <TableCell align="left">Latitude</TableCell>
              <TableCell align="left">Longitude</TableCell> */}
              <TableCell align="left">Time&nbsp;Stamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {(rowsPerPage > 0
            ? displayData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : displayData
            ).map((row, i) => (
              <Row key={i} row={row} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={displayData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </React.Fragment>
    );
}