const express = require("express")
const app = express()
const http = require("http")
const path = require("path")
const { Server } = require("socket.io")

const server = http.createServer(app)
const io = new Server(server);  //this will handle the web socket connections

//Socket connection
io.on('connection',(socket)=>{
    console.log(`User connected ${socket.id}`) // every socket has a unique id
})

app.use(express.static("/public"));

app.get("/", (req, res)=>{
    return res.sendFile(path.resolve('./public/index.html'))
})

server.listen(9000, () => {
  console.log("Server is running on http://localhost:9000")
});

