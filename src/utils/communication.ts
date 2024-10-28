import { joinRoom } from 'trystero'
import { Peer } from 'peerjs'
import io from 'socket.io-client'

const FALLBACK_SERVER = 'wss://chat-server.stackblitz.dev'

export type CommunicationMethod = 'webrtc' | 'peerjs' | 'websocket'

interface CommunicationActions {
  sendMessage: (message: any) => void
  sendPresence: (type: string, username: string) => void
}

class CommunicationManager {
  private currentMethod: CommunicationMethod = 'webrtc'
  private room: any = null
  private peer: Peer | null = null
  private socket: any = null
  private connections: Map<string, any> = new Map()
  private actions: CommunicationActions | null = null
  
  async connect(roomId: string, onMessage: MessageCallback, onPresence: PresenceCallback) {
    try {
      this.actions = await this.tryWebRTC(roomId, onMessage, onPresence)
      this.currentMethod = 'webrtc'
    } catch (error) {
      try {
        this.actions = await this.tryPeerJS(roomId, onMessage, onPresence)
        this.currentMethod = 'peerjs'
      } catch (error) {
        this.actions = await this.tryWebSocket(roomId, onMessage, onPresence)
        this.currentMethod = 'websocket'
      }
    }
    return this.actions
  }

  async connectWithMethod(method: CommunicationMethod, roomId: string, onMessage: MessageCallback, onPresence: PresenceCallback) {
    this.disconnect()
    
    switch (method) {
      case 'webrtc':
        this.actions = await this.tryWebRTC(roomId, onMessage, onPresence)
        break
      case 'peerjs':
        this.actions = await this.tryPeerJS(roomId, onMessage, onPresence)
        break
      case 'websocket':
        this.actions = await this.tryWebSocket(roomId, onMessage, onPresence)
        break
    }
    
    this.currentMethod = method
    return this.actions
  }

  private async tryWebRTC(roomId: string, onMessage: MessageCallback, onPresence: PresenceCallback) {
    const config = { appId: 'wechat-clone' }
    this.room = joinRoom(config, roomId)
    const [sendMessage, getMessage] = this.room.makeAction('message')
    const [sendPresence, getPresence] = this.room.makeAction('presence')

    getMessage(onMessage)
    getPresence(onPresence)

    return { sendMessage, sendPresence }
  }

  private async tryPeerJS(roomId: string, onMessage: MessageCallback, onPresence: PresenceCallback) {
    this.peer = new Peer()
    
    return new Promise<CommunicationActions>((resolve, reject) => {
      this.peer!.on('open', (id) => {
        resolve({
          sendMessage: (message: any) => {
            this.connections.forEach(conn => conn.send(message))
          },
          sendPresence: (type: string, username: string) => {
            this.connections.forEach(conn => 
              conn.send({ type: 'presence', presenceType: type, username })
            )
          }
        })
      })

      this.peer!.on('error', reject)
    })
  }

  private async tryWebSocket(roomId: string, onMessage: MessageCallback, onPresence: PresenceCallback) {
    this.socket = io(FALLBACK_SERVER)
    
    return new Promise<CommunicationActions>((resolve) => {
      this.socket.on('connect', () => {
        this.socket.emit('join', roomId)
        
        resolve({
          sendMessage: (message: any) => this.socket.emit('message', message),
          sendPresence: (type: string, username: string) => 
            this.socket.emit('presence', { type, username })
        })
      })
    })
  }

  sendMessage(message: any) {
    if (!this.actions) {
      throw new Error('Not connected to any communication channel')
    }
    this.actions.sendMessage(message)
  }

  sendPresence(type: string, username: string) {
    if (!this.actions) {
      throw new Error('Not connected to any communication channel')
    }
    this.actions.sendPresence(type, username)
  }

  disconnect() {
    switch (this.currentMethod) {
      case 'webrtc':
        this.room?.leave()
        break
      case 'peerjs':
        this.peer?.destroy()
        break
      case 'websocket':
        this.socket?.disconnect()
        break
    }
    this.actions = null
  }

  getCurrentMethod(): CommunicationMethod {
    return this.currentMethod
  }
}

export const communicationManager = new CommunicationManager()