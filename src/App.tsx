import React from 'react'
import { ChatArea } from './components/ChatArea'
import { JoinRoom } from './components/JoinRoom'
import { useStore } from './store/useStore'

function App() {
  const { currentRoom } = useStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto h-screen">
        {currentRoom ? <ChatArea /> : <JoinRoom />}
      </div>
    </div>
  )
}

export default App