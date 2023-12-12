import { useEffect, useState, StrictMode } from 'react'
import './App.css'
import { socket } from './socket'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import CreateRoom from './components/CreateRoom';
import Room from './components/Room'
import Root from './components/Root';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected)

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    });
    socket.on('disconnect', () => {
      setIsConnected(false)
    });
  }, [])


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
          path: '/',
          element: <CreateRoom />,
        },
        {
          path: '/room/:id',
          element: <Room />,
        }
      ]
    },
  ]);

  return (
    <StrictMode>
      {
        isConnected 
        ? (
          <RouterProvider router={router} />
        )
        : (
            <div>Failed to stablish connection to server</div>
        )
      }
    </StrictMode>
  )

}

export default App
