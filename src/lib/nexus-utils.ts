// NEXUS: Quantum Owl Utility Functions
// Lightweight helpers for rapid development

import { nanoid } from 'nanoid'

// ID Generation
export const generateId = () => nanoid()
export const generateAlertId = () => `alert_${nanoid(8)}`
export const generateUserId = () => `user_${nanoid(12)}`

// Price Formatting
export const formatPrice = (price: number): string => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`
  }
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)}K`
  }
  return `$${price.toFixed(2)}`
}

// Percentage Formatting
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

// Confidence Level to Color
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return 'text-green-400'
  if (confidence >= 80) return 'text-blue-400'
  if (confidence >= 70) return 'text-yellow-400'
  if (confidence >= 60) return 'text-orange-400'
  return 'text-red-400'
}

// Subscription Tier Colors
export const getTierColor = (tier: string): string => {
  const colors = {
    free: 'text-gray-400',
    owl: 'text-blue-400',
    quantum: 'text-purple-400',
    oracle: 'text-green-400',
    mystic: 'text-yellow-400',
    sovereign: 'text-red-400',
    custom: 'text-amber-400'
  }
  return colors[tier as keyof typeof colors] || 'text-gray-400'
}

// Time Formatting
export const timeAgo = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

// Recommendation Badge Color
export const getRecommendationColor = (recommendation: string): string => {
  switch (recommendation) {
    case 'BUY': return 'bg-green-600 text-green-100'
    case 'SELL': return 'bg-red-600 text-red-100'
    case 'HOLD': return 'bg-yellow-600 text-yellow-100'
    default: return 'bg-gray-600 text-gray-100'
  }
}

// API Error Handler
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return 'An unexpected error occurred'
}

// Subscription Tier Check
export const hasFeatureAccess = (userTier: string, requiredTier: string): boolean => {
  const tierHierarchy = ['free', 'owl', 'quantum', 'oracle', 'mystic', 'sovereign', 'custom']
  const userIndex = tierHierarchy.indexOf(userTier)
  const requiredIndex = tierHierarchy.indexOf(requiredTier)
  return userIndex >= requiredIndex
}
