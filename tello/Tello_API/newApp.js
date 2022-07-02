const dgram = require('dgram')
const express = require('express')


class Tello {
    constructor(ipa,port){
        this.port = port
        this.ipa = ipa
        
        this.socket
        this.establishhNewSocketAndEnterSDKMode()
	this.listenForEvents()
    }

    listenForEvents() {
        this.socket.on('message', (msg,info)=>{
            console.log(msg.toString())
        })
    }

    establishhNewSocketAndEnterSDKMode() {
        const droneSocket = dgram.createSocket('udp4')
        droneSocket.bind(8889)
        this.socket = droneSocket
        var message = new Buffer('command')
        droneSocket.send(message,this.port,this.ipa,(err,bytes)=>{
            if(err) {
                return 
            } else {
                console.log("Done")
                return
            }
        })
    }

    sendCommand(command){
        var newCommand = new Buffer(command)
        this.socket.send(newCommand,this.port,this.ipa,(err,bytes)=>{
            if(err){
                return
            } else {
                console.log("Done")
            }
        })
    }
    
    asyncSendCommand(command){
        var newCommand = new Buffer(command)
            return new Promise(resolve=> {
                this.socket.send(newCommand,this.port,this.ipa,(err,bytes)=>{
                    if(err){
                        throw err
                    } else {
                        resolve(newCommand)
                    }
                })
            }
        )
    }
}


const tello = new Tello('192.168.10.1',8889)

const app = express()

function getMessageFromTello() {
    return new Promise(resolve => {
        tello.socket.on('message', async (msg,info)=>{
            return resolve(msg.toString())
        })
    })
}

//tello.socket.on('message', (msg,info)=>{
//    console.log(msg.toString())
//})

app.get('/hover/:flag', async (req,res)=>{
    var message = ''
    if(req.params.flag === '0' ){
        try {
            message =  await tello.asyncSendCommand('ccw 1')
            
       } catch(err) {
            message = "ERROR"
       }
    } else {
        try {
            message =  await tello.asyncSendCommand('cw 1')
            
       } catch(err) {
            message = "ERROR"
       }
    }

    var messageFromDron = await getMessageFromTello()
    req.send(message + messageFromDrone)
})

app.get('/rc',async(req,res)=>{
  var message = ''
  try {
    message = await tello.asyncSendCommand('rc 10 10 10 10')
  } catch(err) {
     message = "ERROR"
  }

  var messageFromDrone = await getMessageFromTello()
  res.send(message + messageFromDrone)
})

app.get('/rc/:id1/:id2/:id3/:id4',(req,res)=>{
  var message = ''
  var command = 'rc ' + req.params.id1 + ' ' + req.params.id2 + ' ' + req.params.id3 + ' ' + req.params.id4
  tello.asyncSendCommand(command)
  res.send("OK")
})

app.get('/rcStop',async(req,res)=>{
  var message = ''
  try {
    message = await tello.asyncSendCommand('rc 0 0 0 0')
  } catch(err) {
    message = "ERROR"
  }
  var messageFromDrone = await getMessageFromTello()
  res.send(message + messageFromDrone)
})

app.get('/testing',async(req,res)=>{
    var message = await tello.sendCommand('land')
    res.send(message)
})

app.get('/command/:comm/:value',async (req,res)=>{
    var message = ' '
    var batteryPercentage = 'Battery percentage'
    try {
         message = await await tello.asyncSendCommand(req.params.comm + ' ' + req.params.value)
         //batteryPercentage = 'Battery percentage' + await tello.asyncSendCommand('battery?')
    } catch(err) {
         message = "ERROR"
    }
    
    var messageFromDrone = await getMessageFromTello()
    res.send(message + messageFromDrone)
})

app.get('/test/:comm',async (req,res)=>{
    var message = ' '
    var batteryPercentage = 'Battery percentage'
    try {
         message = await tello.asyncSendCommand(req.params.comm)
         //batteryPercentage = 'Battery percentage' + await tello.asyncSendCommand('battery?')
    } catch(err) {
         message = "ERROR"
    }
    
    var messageFromDrone = await getMessageFromTello() 
    res.send(message + messageFromDrone)
})

app.listen(4000, 'localhost', ()=>{
    console.log("Listening on port 4000")
})