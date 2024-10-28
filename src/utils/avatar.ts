import { createCanvas } from 'canvas'

const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#F59E0B', // amber-500
  '#6366F1', // indigo-500
  '#EF4444', // red-500
  '#14B8A6', // teal-500
]

export const getInitials = (username: string): string => {
  return username
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const generateAvatar = (username: string): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  
  // Get background color based on username
  const colorIndex = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const backgroundColor = COLORS[colorIndex % COLORS.length]
  
  // Draw background
  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Draw initials
  const initials = getInitials(username)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 48px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(initials, canvas.width / 2, canvas.height / 2)
  
  return canvas.toDataURL('image/png')
}

export const getUserColor = (username: string): string => {
  const index = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return COLORS[index % COLORS.length]
}