'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  TrendingUp,
  Target,
  Activity,
  AlertTriangle,
  Zap,
  BarChart3,
  Timer,
  Calendar,
  Brain,
  Loader2
} from 'lucide-react';
import {
  PredictionData,
  MultitimeframePredictionData,
  lunarCrushMultiTimeframe
} from '@/lib/lunarcrush-enhanced';

interface MultitimeframeAnalysisProps {
  basePrediction: PredictionData;
  className?: string;
}

export default function MultitimeframeAnalysis({
  basePrediction,
  className = ''
}: MultitimeframeAnalysisProps) {
  const [multiData, setMultiData] = useState<MultitimeframePredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('24h');

  useEffect(() => {
    async function loadMultitimeframeData() {
      try {
        setLoading(true);
        setError(null);

        console.log('🤖 Loading MCP multi-timeframe analysis...');

        const analysis = await lunarCrushMultiTimeframe.getMultitimeframeAnalysis(
          basePrediction.symbol,
          basePrediction
        );
        setMultiData(analysis);
        console.log('✅ MCP multi-timeframe analysis loaded');

      } catch (err) {
        console.error('❌ MCP multi-timeframe analysis failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
        setError(`MCP ERROR: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }

    loadMultitimeframeData();
  }, [basePrediction]);

  const formatPrice = (price: number) => {
    return price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const getTimeframeIcon = (timeframe: string) => {
    const icons = {
      '1h': Timer,
      '4h': Clock,
      '24h': Activity,
      '7d': BarChart3,
      '30d': Calendar
    };
    return icons[timeframe as keyof typeof icons] || Clock;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'BULLISH' ? 'text-green-400' :
           trend === 'BEARISH' ? 'text-red-400' : 'text-yellow-400';
  };

  const getRiskColor = (risk: string) => {
    return risk === 'LOW' ? 'text-green-400' :
           risk === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400';
  };

  const calculatePercentageChange = (target: number, current: number) => {
    if (current === 0) return '+0.00%';
    const change = ((target - current) / current) * 100;
    return change >= 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-700 border-t-blue-400"></div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-400" />
            </div>
            <div className="text-center space-y-2">
              <div className="text-xl font-semibold text-white">MCP Multi-Timeframe Analysis</div>
              <div className="text-slate-300">Processing {basePrediction.symbol} across 5 timeframes...</div>
              <div className="text-sm text-slate-500">
                ⚡ Using LunarCrush MCP tools for real data
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-6" />
            <div className="text-xl font-semibold text-red-400 mb-3">
              MCP Analysis Failed
            </div>
            <div className="text-slate-300 mb-4 bg-slate-800 rounded-lg p-4">
              {error}
            </div>
            <div className="text-sm text-slate-500 space-y-2">
              <div>🔧 MCP tools will handle this automatically</div>
              <div>💎 Premium features via LunarCrush MCP</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!multiData || !multiData.multi_timeframe) return null;

  const selectedPrediction = multiData.multi_timeframe.predictions.find(
    p => p.timeframe === selectedTimeframe
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* MCP Badge */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-full">
          <Brain className="h-4 w-4 text-green-400" />
          <span className="text-green-400 font-semibold text-sm">MCP ANALYSIS READY</span>
          <Zap className="h-4 w-4 text-yellow-400" />
        </div>
      </div>

      {/* Overall Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <span className="text-sm text-slate-400">Overall Trend</span>
          </div>
          <div className={`text-lg font-bold ${getTrendColor(multiData.multi_timeframe.overall_trend)}`}>
            {multiData.multi_timeframe.overall_trend}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-slate-400">Confidence Trend</span>
          </div>
          <div className="text-lg font-bold text-blue-400">
            {multiData.multi_timeframe.confidence_trend}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-slate-400">Best Entry</span>
          </div>
          <div className="text-sm font-medium text-purple-400">
            {multiData.multi_timeframe.best_entry_timeframe}
          </div>
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>MCP Timeframe Predictions</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {multiData.multi_timeframe.predictions.map((prediction) => {
            const Icon = getTimeframeIcon(prediction.timeframe);
            const isSelected = selectedTimeframe === prediction.timeframe;
            const changePercent = calculatePercentageChange(prediction.price_target, basePrediction.current_price);

            return (
              <button
                key={prediction.timeframe}
                onClick={() => setSelectedTimeframe(prediction.timeframe)}
                className={`flex flex-col items-center space-y-1 px-4 py-3 rounded-lg transition-all border-2 ${
                  isSelected
                    ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                    : 'bg-slate-700 text-slate-300 border-slate-600 hover:border-blue-400 hover:text-blue-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span className="font-semibold">{prediction.timeframe.toUpperCase()}</span>
                </div>
                <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {changePercent}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Timeframe Details */}
      {selectedPrediction && (
        <div className="bg-slate-800 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-400" />
              <span>{selectedPrediction.timeframe.toUpperCase()} MCP Analysis</span>
            </h4>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskColor(selectedPrediction.risk_level)} bg-slate-700`}>
              {selectedPrediction.risk_level} RISK
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <span className="text-sm text-slate-400">MCP Price Target</span>
                <div className="text-3xl font-bold text-white mb-1">
                  {formatPrice(selectedPrediction.price_target)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Current: {formatPrice(basePrediction.current_price)}</span>
                  <span className={`font-semibold ${
                    selectedPrediction.price_target > basePrediction.current_price
                      ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculatePercentageChange(selectedPrediction.price_target, basePrediction.current_price)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <span className="text-sm text-slate-400">Confidence Score</span>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-blue-400">
                    {selectedPrediction.confidence_score}%
                  </div>
                  <div className="flex-1 bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-400 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${selectedPrediction.confidence_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <span className="text-sm text-slate-400">Expected Volume</span>
                <div className="text-2xl font-bold text-green-400">
                  {(selectedPrediction.volume_expectation / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-slate-500">24h trading volume estimate</div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <span className="text-sm text-slate-400 mb-3 block">MCP Analysis</span>
                <div className="text-sm text-slate-200 leading-relaxed">
                  {selectedPrediction.reasoning}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>MCP Risk Assessment Timeline</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm text-slate-400">Short-term (1h-24h)</span>
            </div>
            <div className={`text-lg font-bold ${getRiskColor(multiData.multi_timeframe.risk_timeline.short_term)}`}>
              {multiData.multi_timeframe.risk_timeline.short_term}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-blue-400" />
              <span className="text-sm text-slate-400">Medium-term (1d-7d)</span>
            </div>
            <div className={`text-lg font-bold ${getRiskColor(multiData.multi_timeframe.risk_timeline.medium_term)}`}>
              {multiData.multi_timeframe.risk_timeline.medium_term}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-400" />
              <span className="text-sm text-slate-400">Long-term (7d-30d)</span>
            </div>
            <div className={`text-lg font-bold ${getRiskColor(multiData.multi_timeframe.risk_timeline.long_term)}`}>
              {multiData.multi_timeframe.risk_timeline.long_term}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
