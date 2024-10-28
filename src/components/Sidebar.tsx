import React from 'react'
import { useStore } from '../store/useStore'
import { MessageSquare, Settings, Users } from 'lucide-react'

export const Sidebar = () => {
  const { contacts, activeChat, setActiveChat } = useStore()

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Users size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full">
              <Settings size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => setActiveChat(contact.id)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
              activeChat === contact.id ? 'bg-gray-100' : ''
            }`}
          >
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{contact.name}</h3>
                {contact.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {contact.unreadCount}
                  </span>
                )}
              </div>
              {contact.lastMessage && (
                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}