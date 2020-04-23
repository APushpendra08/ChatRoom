const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const filter = new Filter()
const { generateMessage } = require('./utils/message')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
io = socketio(server)

let count =0 ;

const port = 3000 || process.env.PORT;
const dirname = path.join(__dirname,'../public')

app.use(express.static(dirname));

io.on('connection',(socket)=>{    

    
    socket.on('join', ({username,room},callback)=>{

        const {error, user } =  addUser({id:socket.id, username, room})

        if(user)    console.log(user)
        else        console.log(error)

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessage(`Hello ${username}`,"Chat-Bot"))
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined ${user.room} chatroom`,"Chat-bot"))
    
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on('sendMessage',(text,callback)=>{

        //check for profanity
        const refinedText = filter.clean(text);
        if(filter.isProfane(text))
        {
            return callback("Profanity is not allowed - Callback")
        }

        const user = getUser(socket.id)
        // console.log(user)
        
        io.to(user.room).emit('message',generateMessage(refinedText,user.username));
        callback("Message Delivered - Callback");
    })

    
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage(`${user.username} disconnected`, "Chat-Bot"));
        
            io.to(user.room).emit('roomData', {
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

        
    })

    socket.on('sendLocation',(posData,callback)=>{
        
        let mapLink = 'https://google.com/maps?q=' + posData.latitude.toString()  + "," + posData.longitude.toString();
        //console.log(mapLink);

        const user = getUser(socket.id)
        //console.log(user)
        //console.log(generateMessage(mapLink,user.username))
        io.to(user.room).emit('locationMessage', generateMessage(mapLink,user.username));
        callback();
    })

})

server.listen(port,()=> console.log("connected"));