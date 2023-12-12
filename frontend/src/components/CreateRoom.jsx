import { useState } from 'react'
import { socket } from '../socket'
import { customAlphabet } from 'nanoid/non-secure'
import { useNavigate } from 'react-router-dom'

const CreateRoom = () => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')

  const createRoom = (e) => {
    e.preventDefault()
    const id = nanoid()
    socket.emit('join_room', { id: id, name: roomName })
    navigate('/room/' + id)
  }

  return (
    <div>
      <h3>Create Room</h3>
      <form onSubmit={createRoom}>
        <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
        <button>Create</button>
      </form>
    </div>
  )
}

export default CreateRoom