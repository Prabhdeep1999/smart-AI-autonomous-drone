import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import { useTheme } from '@material-ui/core/styles';
import { BarChart, Bar, Tooltip, CartesianGrid, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './title.js';


// Generate Data
function createData(Time, Detection) {
  return { Time, Detection };
}

function changeDateFormat(date) {
  var d = new Date(date)
  var dd = String(d.getDate()).padStart(2, '0');
  var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = d.getFullYear();

  let returnDate = yyyy + '-' + mm + '-' + dd;

  return returnDate

}

export default function Chart(props) {
  const theme = useTheme();
  const [data, setData] = useState([createData('00:00', 0), createData('24:00', 0)]);
  
  useEffect(() => {
    let temp =[createData('00:00', 0)]
    let temp2 = {}
    const db = firebase.db
    var rootRef = db.ref(changeDateFormat(props.choosenDate));
    rootRef.on('value', function(snapshot){
        if(snapshot.exists()){
            // setInputData(snapshot.val())
            var data = snapshot.val()

            for (var k in data){
              var short = data[k].timestamp.slice(0,5)
              if (!(short in temp2)){
                temp2[short] = 1
              } else {
                temp2[short] = temp2[short] + 1
              }
            }
            for(k in temp2){
              temp.push(createData(k,temp2[k]))
            }
            temp.push(createData('24:00', 0))
            setData(temp)
            // console.log(temp, temp2)
        } else {
          setData([createData('00:00', 0), createData('24:00', 0)])
        }
    })
  }, [props.choosenDate])
  // console.log(props)

  return (
    <React.Fragment>
      <Title>Detections Vs. Time</Title>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 24,
          }}
        >
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="Time" stroke={theme.palette.text.secondary} >
          <Label
              angle={0}
              offset={-3}
              position="insideBottom"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Time
            </Label>
          </XAxis>
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Detections
            </Label>
          </YAxis>
          <Tooltip/>
          <Bar dataKey="Detection" fill='#b30000' />
          {/* <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} /> */}
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}