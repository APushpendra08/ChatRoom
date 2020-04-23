const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')


const app = express();
const server = http.createServer(app)
io = socketio(server)

// Test code.
let count =0 ;

const port = 3000 || process.env.PORT;
const dirname = path.join(__dirname,'../public')

app.use(express.static(dirname));

io.on('connection',(socket)=>{
    
    console.log("New WebSocket Connection")

    //Emitting countUpdated.
    // socket.emit('countUpdated', count); // emitting an event.
    
    
    // //defining increment.
    // socket.on('increment',()=>{
    //     count++;
    //     io.emit('countUpdated', count);
    // })

    socket.emit('message','AP');

    socket.on('sendMessage',(text)=>{
        io.emit('message',text);
    })

})

server.listen(port,()=> console.log("connected"));





