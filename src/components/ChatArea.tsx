import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Send, ArrowLeft, Wifi, WifiOff } from 'lucide-react'
import { communicationManager } from '../utils/communication'
import { getUserColor, getInitials } from '../utils/avatar'
import { CommunicationSelector } from './CommunicationSelector'

export const ChatArea = () => {
  const [message, setMessage] = useState('')
  const [isConnecting, setIsConnecting] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { 
    username, 
    currentRoom, 
    messages, 
    addMessage, 
    setCurrentRoom,
    communicationMethod,
    setCommunicationMethod 
  } = useStore()
  
  const connect = async (method = communicationMethod) => {
    if (!currentRoom) return
    
    setIsConnecting(true)
    try {
      await communicationManager.connectWithMethod(
        method,
        currentRoom,
        (message: any, peerId: string) => {
          addMessage(currentRoom, {
            id: Date.now().toString(),
            ...message,
            timestamp: Date.now()
          })
        },
        (type: string, username: string) => {
          addMessage(currentRoom, {
            id: Date.now().toString(),
            text: `${username} ${type === 'join' ? '加入了' : '离开了'}聊天室`,
            sender: 'system',
            timestamp: Date.now(),
            type: 'system'
          })
        }
      )
      setCommunicationMethod(method)
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }
  
  useEffect(() => {
    if (currentRoom) {
      connect()
      return () => {
        communicationManager.disconnect()
      }
    }
  }, [currentRoom])

  const handleMethodChange = async (method: CommunicationMethod) => {
    if (method !== communicationMethod) {
      connect(method)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages[currentRoom ?? '']])

  const handleSend = () => {
    if (!message.trim() || !currentRoom) return

    const newMessage = {
      text: message,
      sender: username,
      type: 'message' as const
    }

    try {
      communicationManager.sendMessage(newMessage)
      addMessage(currentRoom, {
        ...newMessage,
        id: Date.now().toString(),
        timestamp: Date.now()
      })
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const chatMessages = currentRoom ? (messages[currentRoom] || []) : []

  const renderAvatar = (sender: string) => (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
      style={{ backgroundColor: getUserColor(sender) }}
    >
      {getInitials(sender)}
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-gray-50 w-full">
      <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentRoom(null)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                房间号 #{currentRoom}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>当前用户: {username}</span>
                {isConnecting ? (
                  <WifiOff size={16} className="text-yellow-500" />
                ) : (
                  <Wifi size={16} className="text-green-500" />
                )}
              </div>
            </div>
          </div>
          
          <CommunicationSelector
            currentMethod={communicationMethod}
            onMethodChange={handleMethodChange}
            disabled={isConnecting}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {chatMessages.map((msg, index) => {
            const showTimestamp = index === 0 || 
              new Date(msg.timestamp).getTime() - new Date(chatMessages[index - 1].timestamp).getTime() > 300000

            return (
              <div key={msg.id}>
                {showTimestamp && (
                  <div className="text-center my-4">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                )}
                <div
                  className={`flex ${
                    msg.type === 'system'
                      ? 'justify-center'
                      : msg.sender === username
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  {msg.type === 'system' ? (
                    <div className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm animate-fade-in">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="group max-w-[80%] flex gap-2">
                      {msg.sender !== username && (
                        <div className="flex flex-col items-center mt-auto mb-1">
                          {renderAvatar(msg.sender)}
                          <span className="text-xs text-gray-500 mt-1">{msg.sender}</span>
                        </div>
                      )}
                      <div className={`flex flex-col ${msg.sender === username ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            msg.sender === username
                              ? 'bg-blue-500 text-white rounded-br-sm'
                              : `text-white rounded-bl-sm`
                          }`}
                          style={msg.sender !== username ? { backgroundColor: getUserColor(msg.sender) } : undefined}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {msg.sender === username && (
                        <div className="flex flex-col items-center mt-auto mb-1">
                          {renderAvatar(msg.sender)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="输入消息..."
            className="flex-1 p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim() || isConnecting}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}