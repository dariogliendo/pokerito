import { useEffect, useState } from "react"
import { joinRoom, leaveRoom, setUsername as newUsername, socket } from '../socket'
import { useParams } from "react-router-dom"
import styled from 'styled-components'
import Poker from "./Poker"

const RoomContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .header {
    display: flex;
    flex: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .mainContent {
    display: flex;
    flex: 1;
    flex-direction: row;

    .userList {
      flex: 0;
    }
  }
`

const Room = () => {
  const [usernameInput, setUsernameInput] = useState('')
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState({})
  const [userId, setUserId] = useState('')

  const { id } = useParams()
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user')
    if (savedUser) {
      const { id, username } = JSON.parse(savedUser)
      setUsername(username)
      setUserId(id)
    }
    joinRoom(id, username)
      .then(roomData => {
        setRoom(roomData)
        setUserId(roomData.user_id)
      })
      .catch(error => {
        console.error(error)
      })

    socket.on("user_joined", (roomData) => {
      setRoom(roomData)
    })
  }, [])

  const changeUsername = async (e) => {
    try {
      e.preventDefault()
      setUsername(usernameInput)
      setRoom({
        ...room,
        users: room.users.map(m => m.id === userId ? { ...m, username: usernameInput } : m)
      })
      sessionStorage.setItem('user', JSON.stringify({ id: userId, username: usernameInput }))
      await newUsername(usernameInput)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    username
      ? (
        <RoomContainer>
          <div className="header">
            <h3>Room: {room.name}</h3>
            <h3>Username: {username}</h3>
          </div>
          <div className="mainContent">
            <Poker room={room} setRoom={setRoom} user={{ id: userId, username }} />
            <div className="userList">
              <h4>Users</h4>
              {room.users?.map(user => (
                <div className="userItem" key={user.id}>
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
          </div>
        </RoomContainer>
      )
      : (
        <form onSubmit={changeUsername}>
          <input value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
          <button>Set username</button>
        </form>
      )
  )
}

export default Room