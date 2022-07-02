import React from 'react';
import firebase from '../firebase';
import { withRouter} from 'react-router-dom'
import Dashboard from './dashboard.js'
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'



const CapturedData = (props) => {
  if(!firebase.getCurrentUsername()) {
		// not logged in
		alert('Please login first')
		props.history.replace('/')
		return null
  }
  return (<div><ReactNotification /><Dashboard /></div>);
};

export default withRouter(CapturedData);

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     marginTop: theme.spacing(3)
//   },
//   textField: {
//     marginLeft: theme.spacing(10),
//     marginRight: theme.spacing(1),
//     marginTop: theme.spacing(10),
//     width: 200,
//   },
//   table: {
//     marginTop: theme.spacing(5),
//     minWidth: 650,
//   },
//   margin: {
//     margin: theme.spacing(5),
//   },
//   dateField: {
//     padding: theme.spacing(2),
//   },
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 0.05,
//   },
//   tableRowsStyle: {
//     '& > *': {
//       borderBottom: 'unset',
//     },
//   },

// }));


// function Row(props) {
//   const { row } = props;
//   const [open, setOpen] = React.useState(false);
//   const classes = useStyles();

//   return (
//     <React.Fragment>
//       <TableRow className={classes.root}>
//         <TableCell>
//           <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row" align="left">
//           {row.class}
//         </TableCell>
//         <TableCell align="left">{row.date}</TableCell>
//         <TableCell align="left">{row.lat}</TableCell>
//         <TableCell align="left">{row.long}</TableCell>
//         <TableCell align="left">{row.timestamp}</TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box margin={1}>
//               <Typography variant="h6" gutterBottom component="div">
//                 History
//               </Typography>
//               <Table size="small" aria-label="purchases">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Image</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   <TableRow>
//                     <TableCell component="th" scope="row">
//                       <img src={row.image} alt="Not Available"/>
//                     </TableCell>
//                   </TableRow>
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </React.Fragment>
//   );
// }

// Row.propTypes = {
//   row: PropTypes.shape({
//     class: PropTypes.string.isRequired,
//     date: PropTypes.string.isRequired,
//     lat: PropTypes.number.isRequired,
//     lng: PropTypes.number.isRequired,
//     timestamp: PropTypes.string.isRequired,
//   }).isRequired,
// };


// // converts a date object in the form yyyy-mm-dd
// function changeDateFormat(date) {
//   var d = new Date(date)
//   var dd = String(d.getDate()).padStart(2, '0');
//   var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
//   var yyyy = d.getFullYear();

//   let returnDate = yyyy + '-' + mm + '-' + dd;

//   return returnDate

// }

// function yearRange() {
//   let start = 2020
//   let end = new Date()
//   end = Number(end.toString().split(" ")[3])
//   var ans = [];
//   for (let i = start; i <= end; i++) {
//       ans.push(i);
//   }
//   return ans;
  
// }

// const Data = () => {
//   const classes = useStyles();
//   let history = useHistory();
//   const [inputData, setInputData] = useState();
//   const [displayData, setDisplayData] = useState([{class:'', date:'',lat:0,lng:0,timestamp:''}]);
//   const [startDate, setStartDate] = useState(new Date());
//   let restructuredData = {}
//   restructuredData["None"] = [{class:'', date:'',lat:0,lng:0,timestamp:''}]
//   let allDates = []
//   const years = yearRange()
//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December"
//   ];

//   const db = firebase.db
  
//   useEffect(() => {
//     var rootRef = db.ref('JetsonApiTest');
//     rootRef.on('value', function(snapshot){
//           setInputData(snapshot.val())
//           // var key = Object.keys(snapshot.val());
//           // console.log(key)
//       })

//     console.log("rendered")
//     NotificationManager.info('New Data');
  
//   }, [db, inputData])
  
//   async function logout() {
//     await firebase.logout();
//     // props.history.replace('/')
//     history.push('/login')
// 	}

//   // restructure data key:value :: date:list of data
//   if(inputData != null) {
//     for (var k in inputData) {
//       if (!(inputData[k]["date"] in restructuredData)){
//         restructuredData[(inputData[k]["date"])] = [inputData[k]]
//         allDates.push(new Date(inputData[k]["date"]))
//       } else {
//         restructuredData[(inputData[k]["date"])].push(inputData[k])
//       }
//     }
//   }
  
  
//   const handleChange = (event) =>{
//     let inp = event
//     if (typeof(restructuredData[inp]) === "undefined" ){
//       inp = "None"
//     }
//     setDisplayData(restructuredData[inp].sort().reverse())    
//   }


//   const ExampleCustomInput = ({ value, onClick }) => (
//     <button className={classes.dateField} onClick={onClick}>
//       {value}
//     </button>
//   );
  
 
//   return (
//     <div>
//       <div className={classes.root}>
//       <AppBar position="static">
//         <Toolbar  variant="regular">
//           {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
//             <MenuIcon />
//           </IconButton> */}
//           <Typography variant="h6" className={classes.title}>
//             Captured Data
//           </Typography>
//           <DatePicker
//             renderCustomHeader={({
//               date,
//               changeYear,
//               changeMonth,
//             }) => (
//               <div
//                 style={{
//                   margin: 10,
//                   display: "flex",
//                   justifyContent: "center"
//                 }}
//               >
//                 <select
//                   value={new Date(date).getYear}
//                   onChange={({ target: { value } }) => changeYear(value)}
//                 >
//                   {years.map(option => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
      
//                 <select
//                   value={months[new Date(date).getMonth]}
//                   onChange={({ target: { value } }) =>
//                     changeMonth(months.indexOf(value))
//                   }
//                 >
//                   {months.map(option => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             selected={startDate}
//             onChange={date => setStartDate(date)}
//             onSelect={event => {handleChange(changeDateFormat(event)); setStartDate(event)}}
//             highlightDates={allDates}
//             placeholderText="This highlights a week ago and a week from today"
//             customInput={<ExampleCustomInput />}
//           />
//           <button className='btn btn-info'
//           onClick={logout}
//           >Logout
//           </button>
//         </Toolbar>
//       </AppBar>
//       </div>

//       <div>
//       <Container maxWidth="md" className={classes.container}>
//       <TableContainer component={Paper}>
//         <Table aria-label="collapsible table" size="small">
//           <TableHead>
//             <TableRow>
//               <TableCell align="left"></TableCell>
//               <TableCell align="left">Class</TableCell>
//               <TableCell align="left">Date</TableCell>
//               <TableCell align="left">Latitude</TableCell>
//               <TableCell align="left">Longitude</TableCell>
//               <TableCell align="left">Time&nbsp;Stamp</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {displayData.map((row, i) => (
//               <Row key={i} row={row} />
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       </Container>
//       </div>
//       <NotificationContainer/>
//     </div>
    

    

    
//   );
// };


 

