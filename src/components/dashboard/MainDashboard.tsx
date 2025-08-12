'use client';

import React, { useState } from 'react';
import { Brain, Zap, TrendingUp, Loader2, AlertCircle, CheckCircle, Database, BarChart3, ArrowLeft } from 'lucide-react';
import CoinSearch from '@/components/crypto/CoinSearch';
import PredictionCard from '@/components/crypto/PredictionCard';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import { lunarCrushEnhanced, CryptoSearchResult, PredictionData } from '@/lib/lunarcrush-enhanced';

type ViewState = 'search' | 'analyzing' | 'prediction' | 'analytics';

export default function MainDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('search');
  const [selectedCoin, setSelectedCoin] = useState<CryptoSearchResult | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCoinSelect = async (coin: CryptoSearchResult) => {
    try {
      setSelectedCoin(coin);
      setCurrentView('analyzing');
      setError(null);

      console.log(`🔮 REAL ANALYSIS STARTING: ${coin.symbol}`);

      // Get REAL analysis - NO FALLBACKS
      const analysis = await lunarCrushEnhanced.getCryptoAnalysis(coin.symbol);
      console.log(`✅ REAL ANALYSIS COMPLETE:`, analysis.data_sources);

      setPredictionData(analysis);
      setCurrentView('prediction');
    } catch (err) {
      console.error('❌ REAL ANALYSIS FAILED:', err);
      const errorMessage = err instanceof Error ? err.message : 'Real analysis failed - no mock data available';
      setError(`REAL DATA ERROR: ${errorMessage}`);
      setCurrentView('search');
    }
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedCoin(null);
    setPredictionData(null);
    setError(null);
  };

  const handleViewAnalytics = () => {
    setCurrentView('analytics');
  };

  const handleBackToPrediction = () => {
    setCurrentView('prediction');
  };

  const handleQuickAnalyze = async (symbol: string) => {
    const quickCoin: CryptoSearchResult = { symbol, name: symbol };
    await handleCoinSelect(quickCoin);
  };

  // Search View
  if (currentView === 'search') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Brain className="h-10 w-10 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">LunarOracle</h1>
              <Zap className="h-8 w-8 text-yellow-400" />
            </div>
            <p className="text-slate-400 text-lg">AI-Powered Crypto Predictions with Social Intelligence</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">REAL DATA ONLY</span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">MULTI-TIMEFRAME</span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">INSTITUTIONAL GRADE</span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400 font-medium">Analysis Error</span>
              </div>
              <p className="text-red-300 mt-2">{error}</p>
            </div>
          )}

          {/* Search Component */}
          <CoinSearch onCoinSelect={handleCoinSelect} />

          {/* Quick Analysis Buttons */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Quick Analysis</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC'].map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleQuickAnalyze(symbol)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analyzing View
  if (currentView === 'analyzing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-700 border-t-blue-400 mx-auto"></div>
                <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                Analyzing {selectedCoin?.symbol || 'Cryptocurrency'}
              </h2>
              
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center justify-center space-x-2">
                  <Database className="h-5 w-5 text-blue-400" />
                  <span>Fetching LunarCrush social data...</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span>Running Gemini AI analysis...</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span>Generating predictions...</span>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="text-sm text-slate-500">
                  Using REAL data • No fallbacks • Premium Analysis
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Prediction View with Analytics Tab
  if (currentView === 'prediction' && predictionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToSearch}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>New Search</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">{predictionData.symbol} Analysis</h1>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>

            {/* Analytics Button - Premium Feature */}
            <button
              onClick={handleViewAnalytics}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Advanced Analytics</span>
              <span className="px-2 py-1 bg-white/20 text-xs rounded">PREMIUM</span>
            </button>
          </div>

          {/* Prediction Card */}
          <PredictionCard 
            prediction={predictionData}
            className="w-full"
          />

          {/* Feature Highlight */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Upgrade to Advanced Analytics</h3>
                <p className="text-slate-400 text-sm">
                  Get institutional-grade multi-timeframe predictions and exclusive LunarCrush social intelligence radar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Analytics View - Premium Feature
  if (currentView === 'analytics' && predictionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Analytics Dashboard */}
          <AnalyticsDashboard 
            basePrediction={predictionData}
            onBack={handleBackToPrediction}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return null;
}
