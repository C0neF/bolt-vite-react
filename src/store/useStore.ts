import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateAvatar } from '../utils/avatar'
import { CommunicationMethod } from '../utils/communication'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: number
  type: 'message' | 'system'
  avatar?: string
}

interface ChatState {
  username: string
  messages: Record<string, Message[]>
  currentRoom: string | null
  communicationMethod: CommunicationMethod
  userAvatars: Record<string, string>
  setUsername: (username: string) => void
  addMessage: (roomId: string, message: Message) => void
  setCurrentRoom: (roomId: string | null) => void
  setCommunicationMethod: (method: CommunicationMethod) => void
  addUserAvatar: (username: string) => void
  generateRoomId: () => string
}

const generateRandomRoomId = () => {
  return Math.floor(10000 + Math.random() * 90000).toString()
}

export const useStore = create<ChatState>()(
  persist(
    (set, get) => ({
      username: '',
      messages: {},
      currentRoom: null,
      communicationMethod: 'webrtc',
      userAvatars: {},
      setUsername: (username) => {
        set({ 
          username,
          userAvatars: {
            ...get().userAvatars,
            [username]: generateAvatar(username)
          }
        })
      },
      addMessage: (roomId, message) => {
        const { userAvatars } = get()
        if (!userAvatars[message.sender] && message.type === 'message') {
          set({
            userAvatars: {
              ...userAvatars,
              [message.sender]: generateAvatar(message.sender)
            }
          })
        }
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), {
              ...message,
              avatar: message.type === 'message' ? get().userAvatars[message.sender] : undefined
            }]
          }
        }))
      },
      setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
      setCommunicationMethod: (method) => set({ communicationMethod: method }),
      addUserAvatar: (username) => {
        const { userAvatars } = get()
        if (!userAvatars[username]) {
          set({
            userAvatars: {
              ...userAvatars,
              [username]: generateAvatar(username)
            }
          })
        }
      },
      generateRoomId: () => generateRandomRoomId()
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        username: state.username,
        userAvatars: state.userAvatars
      })
    }
  )
)