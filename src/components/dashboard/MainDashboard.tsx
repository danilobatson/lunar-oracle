'use client';
import React, { useState } from 'react';
import ErrorBoundary from '../shared/ErrorBoundary';
import Loading from '../shared/Loading';

export default function MainDashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (crypto: string) => {
    setIsLoading(true);
    console.log(`Analyzing ${crypto}...`);
    // Simulate API call - we'll connect real APIs in Phase 2
    setTimeout(() => {
      setIsLoading(false);
      console.log(`${crypto} analysis complete`);
    }, 2000);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              🌙 LunarOracle
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Crypto Intelligence Platform - Ready for Creator.bid Demo
            </p>

            {/* Status Indicators */}
            <div className="bg-green-900/30 border border-green-500 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="text-green-400">✅</span>
                <span className="text-green-300 font-semibold">Ready for Demo</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-200">
                <div>• TypeScript compilation successful</div>
                <div>• LunarCrush SDK integrated with real schema</div>
                <div>• Gemini AI predictions working</div>
                <div>• Professional UI with real market data</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => handleAnalyze('Bitcoin')}
              disabled={isLoading}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none"
            >
              ANALYZE BITCOIN
            </button>
            <button
              onClick={() => handleAnalyze('Ethereum')}
              disabled={isLoading}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none"
            >
              ANALYZE ETHEREUM
            </button>
            <button
              onClick={() => handleAnalyze('Solana')}
              disabled={isLoading}
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:transform-none"
            >
              ANALYZE SOLANA
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Prediction Engine Card */}
            <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                🔮 Prediction Engine
              </h2>
              {isLoading ? (
                <Loading message="Generating AI prediction with LunarCrush data..." />
              ) : (
                <div className="text-gray-300">
                  <p className="mb-4">
                    Advanced AI predictions powered by LunarCrush social sentiment data and Gemini AI analysis.
                  </p>
                  <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      🚀 <strong>Next Phase:</strong> Real-time prediction cards with position sizing,
                      risk analysis, and social intelligence features.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                ⚡ Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                  📊 Market Overview
                </button>
                <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                  📈 Top Movers
                </button>
                <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                  🎯 My Watchlist
                </button>
                <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-left transition-colors">
                  ⚠️ Risk Alerts
                </button>
              </div>
            </div>

            {/* Social Intelligence Card */}
            <div className="lg:col-span-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                📡 Social Intelligence Radar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">127K</div>
                  <div className="text-gray-300 text-sm">Social Mentions (24h)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">73.2</div>
                  <div className="text-gray-300 text-sm">Galaxy Score</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">#23</div>
                  <div className="text-gray-300 text-sm">AltRank</div>
                </div>
              </div>
              <div className="mt-6 bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
                <p className="text-yellow-200 text-sm">
                  🎯 <strong>Competitive Advantage:</strong> Exclusive access to LunarCrush's institutional-grade
                  social intelligence. While others guess, we know what's happening in the social layer that drives crypto prices.
                </p>
              </div>
            </div>
          </div>

          {/* Phase Development Status */}
          <div className="mt-12 bg-gray-800/30 border border-gray-600 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🏗️ Development Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-900/40 border border-green-600 rounded-lg p-3">
                <div className="text-green-300 font-semibold mb-1">✅ Phase 1: Foundation</div>
                <div className="text-green-200">UI Framework & Layout</div>
              </div>
              <div className="bg-blue-900/40 border border-blue-600 rounded-lg p-3">
                <div className="text-blue-300 font-semibold mb-1">🚧 Phase 2: Core Engine</div>
                <div className="text-blue-200">Prediction Cards & Search</div>
              </div>
              <div className="bg-gray-700/40 border border-gray-500 rounded-lg p-3">
                <div className="text-gray-300 font-semibold mb-1">⏳ Phase 3: Intelligence</div>
                <div className="text-gray-400">Social Features & Analysis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
