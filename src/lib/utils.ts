import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function getMoodEmoji(mood: string): string {
  switch (mood.toLowerCase()) {
    case 'happy':
      return '😊'
    case 'meh':
      return '😐'
    case 'sad':
      return '😢'
    default:
      return '🤔'
  }
}
