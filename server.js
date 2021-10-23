const { Socket } = require('dgram');
const express = require('express');
// Loading express module  in express variable
/*
Express is a standard server framework for Node.js web application server specifically designed for building single-page, multi-page, and hybrid web applications .
*/

const app = express()
/*
Calls the express function "express()" and puts new Express application inside the app variable (to start a new Express application). It's something like you are creating an object of a class. Where "express()" is just like class and app is it's newly created object.
*/
const server = require('http').Server(app)
const io = require('socket.io')(server) //for real-time communication

const { v4: uuidV4 } = require('uuid') //To generate a dynamic url/ unique user id

//v4 is for random, v1 is for time-based
//Version-1 UUIDs are generated from a time and a node ID (usually the MAC address); version-2 UUIDs are generated from an identifier (usually a group or user ID), time, and a node ID; versions 3 and 5 produce deterministic UUIDs generated by hashing a namespace identifier and name; and version-4 UUIDs are generated using a random or pseudo-random number.

app.set('view engine','ejs')

/*
EJS: EJS or Embedded Javascript Templating is a templating engine used by Node.js to create an HTML template with minimal code and embeddind JS into it . Also, it can inject data into HTML template at the client side and produce the final HTML. 
*/


//Since the default behavior of EJS is that it looks into the ‘views’ folder for the templates to render, we will make 1 
app.use(express.static('public'))
//To serve static files such as images, CSS files, and JavaScript files, we used the express.static built-in middleware function in Express. in a dir named 'public'


//when anytime u get '/' ,we will make a rediredct the user to a new page with randomly generated uuid
app.get('/',(req,res)=>{
    res.redirect(`/${uuidV4()}`)  // THis is to make dynamic room
    //http://localhost:3000/633eb470-4398-4f74-b8bf-025bcc34b6f5//
    //Like above we will get random urls everytime we go to homepage
})

//TO make a realtime chat-room which will refer to views folder by default
app.get('/:room',(req,res)=>{
    res.render('room',{ roomId:req.params.room})
})

//Below runs anytime whenever som1 connects to our webpage we just admit sockets , the socket user is connecting to , so we will listen the event here

io.on('connection',socket=>{
    //After conecting to socket io,  we listern to below event'join-room' , to admit him into the roomID using his userID
    socket.on('join-room',(roomId,userId)=>{
        // console.log(roomID,userID);
        socket.join(roomId) //joining then roomID
        socket.broadcast.to(roomId).emit('user-connected', userId)  // send message room Id to every1 not existing indside person and then emit the event 'user-connected' 
        socket.on('disconnect',()=>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId) 
        })
    })
})


//NOW we will use WebRtc
/*
WebRTC provides web browsers and mobile applications with real-time communication via API, we will use peer framework which wraps browser's WebRTC 
*/

server.listen(3000)