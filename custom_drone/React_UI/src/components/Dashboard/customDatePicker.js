import React, { useState, useEffect } from 'react';
import firebase from '../firebase';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';



export default function CustomDatePicker() {
    const [inputData, setInputData] = useState();
    let restructuredData = {}
    restructuredData["None"] = [{class:'', date:'',lat:0,lng:0,timestamp:''}]
    let allDates = []
    const db = firebase.db
  
    useEffect(() => {
        var rootRef = db.ref('JetsonApiTest');
        rootRef.on('value', function(snapshot){
            setInputData(snapshot.val())
            // var key = Object.keys(snapshot.val());
            // console.log(key)
        })    
    }, [db])
    
    if(inputData != null) {
        for (var k in inputData) {
            if (!(inputData[k]["date"] in restructuredData)){
                allDates.push(new Date(inputData[k]["date"]))
            }
        }
    }

    const modifiers = {
        thursdays: allDates,
      };
      const modifiersStyles = {
        thursdays: {
          color: '#ffc107',
          backgroundColor: '#fffdee',
        },
      };

    return (
      <DayPicker
        month={new Date()}
        onDayClick={e=>console.log(e)}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
      />
    );
  }