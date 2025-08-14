import { create } from 'zustand'

// NEXUS: 7-Tier Subscription System
// Lightweight subscription management

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Daily Owl insights', 'Basic crypto data', 'Limited alerts'],
    api_calls: 10,
    alerts: 3,
    color: 'gray'
  },
  owl: {
    name: 'Owl',
    price: 29,
    features: ['Real-time alerts', 'Basic predictions', 'Telegram bot'],
    api_calls: 1000,
    alerts: 10,
    color: 'blue'
  },
  quantum: {
    name: 'Quantum',
    price: 97,
    features: ['Multi-asset analysis', 'Custom triggers', 'Priority support'],
    api_calls: 5000,
    alerts: 50,
    color: 'purple'
  },
  oracle: {
    name: 'Oracle',
    price: 297,
    features: ['Portfolio integration', 'Priority alerts', 'Advanced analytics'],
    api_calls: 15000,
    alerts: 200,
    color: 'green'
  },
  mystic: {
    name: 'Mystic',
    price: 497,
    features: ['API access', 'Institutional features', 'Custom integrations'],
    api_calls: 50000,
    alerts: 1000,
    color: 'yellow'
  },
  sovereign: {
    name: 'Sovereign',
    price: 997,
    features: ['White-label solutions', 'Advanced analytics', 'Dedicated support'],
    api_calls: 200000,
    alerts: 5000,
    color: 'red'
  },
  custom: {
    name: 'Custom',
    price: 'Contact Us',
    features: ['Bespoke solutions', 'Unlimited everything', 'Personal account manager'],
    api_calls: -1, // Unlimited
    alerts: -1,    // Unlimited
    color: 'gold'
  }
} as const

type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS

interface SubscriptionState {
  current_tier: SubscriptionTier
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  billing_cycle_end: number | null
  usage: {
    api_calls_used: number
    alerts_created: number
  }

  // Actions
  setTier: (tier: SubscriptionTier) => void
  setStripeData: (customerId: string, subscriptionId: string) => void
  updateUsage: (apiCalls?: number, alerts?: number) => void
  canMakeApiCall: () => boolean
  canCreateAlert: () => boolean
  getRemainingCalls: () => number
  getRemainingAlerts: () => number
}

const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  current_tier: 'free',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  billing_cycle_end: null,
  usage: {
    api_calls_used: 0,
    alerts_created: 0
  },

  setTier: (tier) => set({ current_tier: tier }),

  setStripeData: (customerId, subscriptionId) => set({
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId
  }),

  updateUsage: (apiCalls = 0, alerts = 0) => set((state) => ({
    usage: {
      api_calls_used: state.usage.api_calls_used + apiCalls,
      alerts_created: state.usage.alerts_created + alerts
    }
  })),

  canMakeApiCall: () => {
    const state = get()
    const tier = SUBSCRIPTION_TIERS[state.current_tier]
    return tier.api_calls === -1 || state.usage.api_calls_used < tier.api_calls
  },

  canCreateAlert: () => {
    const state = get()
    const tier = SUBSCRIPTION_TIERS[state.current_tier]
    return tier.alerts === -1 || state.usage.alerts_created < tier.alerts
  },

  getRemainingCalls: () => {
    const state = get()
    const tier = SUBSCRIPTION_TIERS[state.current_tier]
    return tier.api_calls === -1 ? -1 : tier.api_calls - state.usage.api_calls_used
  },

  getRemainingAlerts: () => {
    const state = get()
    const tier = SUBSCRIPTION_TIERS[state.current_tier]
    return tier.alerts === -1 ? -1 : tier.alerts - state.usage.alerts_created
  }
}))

export default useSubscriptionStore
