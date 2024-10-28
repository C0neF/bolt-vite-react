import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { MessageSquare, Plus, User } from 'lucide-react'

export const JoinRoom = () => {
  const [roomInput, setRoomInput] = useState('')
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const { setCurrentRoom, generateRoomId, username, setUsername } = useStore()

  const handleJoinRoom = () => {
    if (roomInput.length === 5 && /^\d+$/.test(roomInput) && username) {
      setCurrentRoom(roomInput)
    }
  }

  const handleCreateRoom = () => {
    if (username) {
      const newRoomId = generateRoomId()
      setCurrentRoom(newRoomId)
    }
  }

  const handleUpdateUsername = () => {
    if (newUsername.trim().length >= 3) {
      setUsername(newUsername.trim())
      setIsEditingUsername(false)
      setNewUsername('')
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 min-h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
            <MessageSquare size={48} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">在线聊天室</h1>
          
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">
              {username ? `当前用户名: ${username}` : '请设置用户名以继续'}
            </span>
            <button
              onClick={() => setIsEditingUsername(true)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User size={16} className="text-gray-500" />
            </button>
          </div>
        </div>

        {isEditingUsername ? (
          <div className="mb-6 space-y-4 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="请输入用户名 (3-15个字符)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                minLength={3}
                maxLength={15}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditingUsername(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleUpdateUsername}
                disabled={newUsername.trim().length < 3}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房间号
              </label>
              <input
                type="text"
                maxLength={5}
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value.replace(/\D/g, ''))}
                placeholder="请输入5位房间号"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!username}
              />
            </div>

            <button
              onClick={handleJoinRoom}
              disabled={roomInput.length !== 5 || !username}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              加入房间
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              disabled={!username}
              className="w-full flex items-center justify-center gap-2 bg-white text-blue-500 py-3 rounded-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={20} />
              创建新房间
            </button>
          </div>
        )}
      </div>
    </div>
  )
}