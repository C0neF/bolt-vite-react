import React from 'react'
import { Wifi, Users, Globe } from 'lucide-react'
import { CommunicationMethod } from '../utils/communication'

interface Props {
  currentMethod: CommunicationMethod
  onMethodChange: (method: CommunicationMethod) => void
  disabled?: boolean
}

const methods = [
  { id: 'webrtc' as const, name: 'WebRTC', icon: Users, description: 'P2P 直连' },
  { id: 'peerjs' as const, name: 'PeerJS', icon: Wifi, description: '中继服务器' },
  { id: 'websocket' as const, name: 'WebSocket', icon: Globe, description: '服务器转发' }
]

export const CommunicationSelector = ({ currentMethod, onMethodChange, disabled }: Props) => {
  return (
    <div className="flex gap-2">
      {methods.map(({ id, name, icon: Icon, description }) => (
        <button
          key={id}
          onClick={() => onMethodChange(id)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-sm
            transition-colors duration-200
            ${currentMethod === id
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100 text-gray-600'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{name}</span>
          <span className="hidden lg:inline text-xs text-gray-500">({description})</span>
        </button>
      ))}
    </div>
  )
}