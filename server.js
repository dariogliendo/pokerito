require("dotenv").config()
const express = require("express");
const { createServer } = require("http")
const { Server } = require("socket.io");
const cors = require("cors")

const PORT = process.env.port || 8000

const app = express();
app.use(cors())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

const rooms = []

io.on("connection", (socket) => {
  console.log("User connected")

  socket.on("join_room", (data) => {
    const { id, name, username } = data
    socket.join(id)
    if (!rooms[id]) {
      // Create room
      rooms[id] = { name, users: [{ id: socket.id, username}], host: socket.id, voting: false, votes: [] }
      console.log(`User with ID: ${socket.id} created room: ${data.id}`)
    } else {
      // Join room
      if (!rooms[id].users.find((user) => user.id === socket.id)) {
        rooms[id].users.push({ id: socket.id, username })
      }
      console.log(`User with ID: ${socket.id} joined room: ${data.id}`)
    }
    for (const user in rooms[id].users.filter((user) => user.id !== socket.id)) {
      // Update room users
      socket.to(rooms[id].users[user].id).emit("user_joined", { ...rooms[id], joined: socket.id })
    }
    // Let user know they joined
    socket.emit("joined", { ...rooms[id], id: id, user_id: socket.id })
  })

  socket.on("set_username", ({ username }) => {
    for (const room in rooms) {
      if (rooms[room].users.find((user) => user.id === socket.id)) {
        rooms[room].users = rooms[room].users.map((user) => {
          if (user.id === socket.id) {
            return { ...user, username }
          }
          return user
        })
      }
      socket.to(room).emit("user_joined", { ...rooms[room], joined: socket.id })
      socket.emit("username_changed")
    }
  })

  socket.on("start_vote", ({roomId}) => {
    rooms[roomId].voting = true
    for (const user in rooms[roomId].users) {
      socket.to(roomId).emit("voting_started")
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
    for (const room in rooms) {
      if (rooms[room].users.find((user) => user.id === socket.id)) {
        console.log(`User with ID: ${socket.id} left ${room}`)
        rooms[room].users = rooms[room].users.filter((user) => user.id !== socket.id)
      }
    }
  })
})


httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})