import { io } from 'socket.io-client';

const URL = "http://localhost:8000";

const socket = io(URL)

const joinRoom = (roomId, username) => {
  return new Promise((resolve, reject) => {
    const tryTimeout = setTimeout(() => {
      reject("timeout")
    }, 5000)
    socket.emit("join_room", { id: roomId, username })
    socket.on("joined", (data) => {
      clearTimeout(tryTimeout)
      resolve(data)
    })
  })
}

const leaveRoom = (roomid) => {
  return new Promise((resolve, reject) => {
    const tryTimeout = setTimeout(() => {
      reject("timeout")
    }, 5000)
    socket.emit("leave_room", { id: roomid })
    socket.on("left", () => {
      clearTimeout(tryTimeout)
      resolve()
    })
  })
}

const setUsername = (username) => {
  return new Promise((resolve, reject) => {
    const tryTimeout = setTimeout(() => {
      reject("timeout")
    }, 5000)
    socket.emit("set_username", { username })
    socket.on("username_changed", () => {
      clearTimeout(tryTimeout)
      resolve()
    })
  })
}

const startVote = (roomId) => {
  return new Promise((resolve, reject) => {
    const tryTimeout = setTimeout(() => {
      reject("timeout")
    }, 5000)
    socket.emit("start_vote", { roomId })
    socket.on("voting_started", (data) => {
      clearTimeout(tryTimeout)
      resolve(data)
    })
  })
}

export {
  socket,
  joinRoom,
  leaveRoom,
  setUsername,
  startVote
}