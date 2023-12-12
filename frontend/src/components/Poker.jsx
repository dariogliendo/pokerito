import React, { useEffect } from 'react'
import { socket, startVote } from '../socket'
import { useParams } from 'react-router-dom'

const Poker = ({ room, user, setRoom }) => {
  const { id: roomId } = useParams()
  useEffect(() => {
    socket.on("voting_started", () => {
      setRoom({
        ...room,
        voting: true
      })
    })
  }, [])
  return (
    <div className="poker">
      {
        room.voting
          ? (
            <div>Voting</div>
          )
          : (
            <div>
              {room.host === user.id ? (
                <div>
                  <button onClick={() => startVote(roomId)}>Start voting</button>
                </div>
              ) : (
                <span>Wait until host starts the poker to vote</span>
              )
              }
            </div>
          )
      }
    </div>
  )
}

export default Poker