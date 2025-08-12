'use client';

import React, { useState } from 'react';
import { Brain, Zap, TrendingUp, Loader2, AlertCircle, CheckCircle, Database } from 'lucide-react';
import CoinSearch from '@/components/crypto/CoinSearch';
import PredictionCard from '@/components/crypto/PredictionCard';
import { lunarCrushEnhanced, CryptoSearchResult, PredictionData } from '@/lib/lunarcrush-enhanced';

type ViewState = 'search' | 'analyzing' | 'prediction';

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

  const handleQuickAnalyze = async (symbol: string) => {
    const quickCoin: CryptoSearchResult = { symbol, name: symbol };
    await handleCoinSelect(quickCoin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">

        {/* Header with Real Data Indicators */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              LunarOracle
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            AI-powered cryptocurrency predictions using real-time social sentiment analysis
          </p>

          {/* REAL DATA INDICATORS */}
          <div className="flex items-center justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-green-300">REAL LunarCrush API</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-blue-300">REAL Gemini AI</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
              <Database className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-300">NO MOCK DATA</span>
            </div>
          </div>
        </div>

        {/* Error Display - Real Data Failures */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="font-medium text-red-300">REAL API ERROR</span>
              </div>
              <p className="text-red-200 text-sm mb-2">{error}</p>
              <p className="text-red-200 text-xs">
                This application only uses real data. If APIs fail, we show errors instead of fake data.
              </p>
              <button
                onClick={handleBackToSearch}
                className="mt-2 text-sm text-red-300 hover:text-red-200 underline"
              >
                Try another search
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto">

          {/* Search View */}
          {currentView === 'search' && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Search Any Cryptocurrency
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  🔥 Uses REAL LunarCrush data - No mock/fallback data
                </p>
                <CoinSearch onCoinSelect={handleCoinSelect} />
              </div>

              {/* Quick Analysis Buttons */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-300 mb-4">
                  Quick Real Analysis
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'MATIC'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleQuickAnalyze(symbol)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600
                                 text-white font-medium rounded-lg shadow-lg
                                 hover:from-blue-700 hover:to-purple-700
                                 transform hover:scale-105 transition-all duration-200
                                 border border-blue-500/30"
                    >
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4" />
                        <span>Analyze {symbol}</span>
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ✅ All analysis uses real LunarCrush + Gemini AI data
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="p-3 bg-blue-500/20 rounded-lg w-fit mx-auto mb-4">
                    <Brain className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real AI Predictions</h3>
                  <p className="text-gray-400 text-sm">
                    Actual Gemini AI analysis - no mock responses
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="p-3 bg-yellow-500/20 rounded-lg w-fit mx-auto mb-4">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-time Data</h3>
                  <p className="text-gray-400 text-sm">
                    Live LunarCrush social metrics - no fallback data
                  </p>
                </div>

                <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700">
                  <div className="p-3 bg-green-500/20 rounded-lg w-fit mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Mock Data</h3>
                  <p className="text-gray-400 text-sm">
                    100% real API responses or clear error messages
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Analyzing View */}
          {currentView === 'analyzing' && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-blue-500/20 rounded-full">
                      <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-2">
                    Analyzing {selectedCoin?.symbol} with REAL APIs
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Fetching live data and generating real AI predictions...
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">🔥 Fetching REAL LunarCrush data</span>
                      <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">🤖 Generating REAL AI prediction</span>
                      <Loader2 className="h-4 w-4 text-green-400 animate-spin" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">❌ NO fallback/mock data</span>
                      <CheckCircle className="h-4 w-4 text-red-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prediction View */}
          {currentView === 'prediction' && predictionData && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={handleBackToSearch}
                  className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300
                           transition-colors duration-200 mb-4"
                >
                  <span>← Back to Search</span>
                </button>

                {/* Data Source Verification */}
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    predictionData.data_sources.lunarcrush_api === 'REAL'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <CheckCircle className="h-3 w-3" />
                    <span>LunarCrush: {predictionData.data_sources.lunarcrush_api}</span>
                  </div>
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    predictionData.data_sources.gemini_ai === 'REAL'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <Brain className="h-3 w-3" />
                    <span>Gemini AI: {predictionData.data_sources.gemini_ai}</span>
                  </div>
                </div>
              </div>

              <PredictionCard
                prediction={predictionData}
                className="animate-in slide-in-from-bottom-4 duration-500"
              />

              <div className="text-center">
                <button
                  onClick={handleBackToSearch}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600
                           text-white font-medium rounded-lg shadow-lg
                           hover:from-blue-700 hover:to-purple-700
                           transform hover:scale-105 transition-all duration-200"
                >
                  Analyze Another Coin (Real Data)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>🔥 Powered by REAL LunarCrush API and Gemini AI - No mock data</p>
        </div>
      </div>
    </div>
  );
}
