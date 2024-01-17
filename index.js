const express = require("express");
const app  = express();
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const http = require("http");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const formatMessage = require("./utils/message-format");
const User = require("./models/user")
// middleware to serve static files in nodejs : built-in express middleware
app.use(express.static("public"));
const mongoose = require("mongoose");
//create mongoose connection 
mongoose.connect(process.env.CONNECTION_STRING);

const db = mongoose.connection;
db.on("error", (err) => {
    console.log({message: err.message})
});

db.once("open", () => {
    console.log("Database Connected");
})
//whenever client tries to connect => "connection" event 

io.on('connection', (socket) => {
    const botName = "ChatBot";

    // join user to the room 
    socket.on("joinRoom", async ({username, room}) => {
        // join user to room
       
   const newUser = new User({
         username: username,
         room: room,
         userId: socket.id 
   });
  
   const user = await newUser.save();
   socket.join(user.room);

      // Welcome message to client 
socket.emit("message", formatMessage(botName, "Welcome to BBChat pp"));
// broadcast to all other clients (except the user trying to connect) that user has connected
socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has entered the chat`));

// now get room users
const users = await User.find({room: user.room});
io.to(user.room).emit("roomUser", {
    room: user.room,
    users: users
} )
    })


// broadcasts to all client upon disconnection => "disconnect" event
socket.on("disconnect", async ()=> {
   
    const user = await User.findOneAndDelete({userId: socket.id});
const users = await User.find({room: user.room});
    socket.broadcast.to(user.room).emit("roomUser", {
        room: user.room,
        users: users
    });
    io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left from the chat`));
    
})

// client tries to send message 
socket.on("chatMessage", async (message) => {
    // get user from message object
    const user = await User.find({userId: socket.id})
io.to(user[0].room).emit("message", formatMessage(user[0].username, message));
});


})


// app.get("/" , (req, res) => {
//     res.sendFile("index.html");
// })

app.use("/", require("./routes/users"));
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})
