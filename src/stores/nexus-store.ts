import { create } from 'zustand'
import { subscriptToCO2, persist } from 'zustand/middleware'

// NEXUS: Quantum Owl State Management
// Lightweight, out-of-box state solution as per masterplan

interface User {
  id: string
  email: string
  subscription_tier: 'free' | 'owl' | 'quantum' | 'oracle' | 'mystic' | 'sovereign' | 'custom'
  api_calls_remaining: number
  credits: number
}

interface CryptoAnalysis {
  symbol: string
  current_price: number
  recommendation: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  reasoning: string
  timestamp: number
}

interface Alert {
  id: string
  symbol: string
  type: 'price' | 'sentiment' | 'whale' | 'viral'
  condition: string
  threshold: number
  active: boolean
  created_at: number
}

interface NexusState {
  // User state
  user: User | null
  isAuthenticated: boolean

  // Analysis state
  current_analysis: CryptoAnalysis | null
  analysis_history: CryptoAnalysis[]
  loading: boolean
  error: string | null

  // Alert state
  alerts: Alert[]
  alert_history: Alert[]

  // UI state
  sidebar_open: boolean
  theme: 'dark' | 'light'
  active_tab: 'dashboard' | 'alerts' | 'history' | 'settings'

  // Background monitoring
  monitoring_active: boolean
  last_update: number | null

  // Actions
  setUser: (user: User | null) => void
  setAnalysis: (analysis: CryptoAnalysis) => void
  addAlert: (alert: Alert) => void
  toggleAlert: (alertId: string) => void
  removeAlert: (alertId: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleSidebar: () => void
  setActiveTab: (tab: NexusState['active_tab']) => void
  toggleMonitoring: () => void
  updateLastUpdate: () => void
  reset: () => void
}

// Create persisted store (survives page refresh)
const useNexusStore = create<NexusState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      current_analysis: null,
      analysis_history: [],
      loading: false,
      error: null,
      alerts: [],
      alert_history: [],
      sidebar_open: false,
      theme: 'dark',
      active_tab: 'dashboard',
      monitoring_active: false,
      last_update: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAnalysis: (analysis) => set((state) => ({
        current_analysis: analysis,
        analysis_history: [analysis, ...state.analysis_history.slice(0, 49)], // Keep last 50
        loading: false,
        error: null
      })),

      addAlert: (alert) => set((state) => ({
        alerts: [...state.alerts, alert]
      })),

      toggleAlert: (alertId) => set((state) => ({
        alerts: state.alerts.map(alert =>
          alert.id === alertId ? { ...alert, active: !alert.active } : alert
        )
      })),

      removeAlert: (alertId) => set((state) => ({
        alerts: state.alerts.filter(alert => alert.id !== alertId)
      })),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error, loading: false }),
      toggleSidebar: () => set((state) => ({ sidebar_open: !state.sidebar_open })),
      setActiveTab: (active_tab) => set({ active_tab }),
      toggleMonitoring: () => set((state) => ({ monitoring_active: !state.monitoring_active })),
      updateLastUpdate: () => set({ last_update: Date.now() }),

      reset: () => set({
        current_analysis: null,
        analysis_history: [],
        loading: false,
        error: null,
        alerts: [],
        alert_history: [],
        monitoring_active: false,
        last_update: null
      })
    }),
    {
      name: 'nexus-store', // localStorage key
      partialize: (state) => ({
        user: state.user,
        alerts: state.alerts,
        alert_history: state.alert_history,
        analysis_history: state.analysis_history,
        theme: state.theme,
        active_tab: state.active_tab
      })
    }
  )
)

export default useNexusStore
