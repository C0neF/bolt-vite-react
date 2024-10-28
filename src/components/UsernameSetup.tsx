import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { User } from 'lucide-react'

export const UsernameSetup = () => {
  const { setUsername } = useStore()
  const [name, setName] = useState('')

  const handleSubmit = () => {
    if (name.trim().length >= 3) {
      setUsername(name.trim())
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="w-96 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <User size={48} className="mx-auto text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Set Your Username</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              minLength={3}
              maxLength={15}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={name.trim().length < 3}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}