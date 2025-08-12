'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  AlertTriangle,
  Zap,
  BarChart3,
  Timer,
  Calendar
} from 'lucide-react';
import {
  PredictionData,
  MultitimeframePredictionData,
  TimeframePrediction,
  lunarCrushMultiTimeframe
} from '@/lib/lunarcrush-enhanced';

interface MultitimeframeAnalysisProps {
  basePrediction: PredictionData;
  onBack?: () => void;
  className?: string;
}

export default function MultitimeframeAnalysis({
  basePrediction,
  onBack,
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

        console.log('🔮 Loading multi-timeframe analysis...');
        const analysis = await lunarCrushMultiTimeframe.getMultitimeframeAnalysis(
          basePrediction.symbol,
          basePrediction
        );

        setMultiData(analysis);
        console.log('✅ Multi-timeframe analysis loaded');
      } catch (err) {
        console.error('❌ Multi-timeframe analysis failed:', err);
        setError(err instanceof Error ? err.message : 'Analysis failed');
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

  if (loading) {
    return (
      <div className={`bg-slate-900 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            <div className="text-slate-300">Analyzing multiple timeframes...</div>
            <div className="text-sm text-slate-500">Institutional-grade analysis in progress</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-slate-900 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <div className="text-red-400 mb-2">Multi-timeframe Analysis Failed</div>
            <div className="text-sm text-slate-500 mb-4">{error}</div>
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
              >
                Back to Prediction
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!multiData) return null;

  const selectedPrediction = multiData.multi_timeframe.predictions.find(
    p => p.timeframe === selectedTimeframe
  );

  return (
    <div className={`bg-slate-900 rounded-xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Multi-Timeframe Analysis</h2>
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
            INSTITUTIONAL GRADE
          </span>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
          >
            Back
          </button>
        )}
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
          <div className="text-lg font-bold text-purple-400">
            {multiData.multi_timeframe.best_entry_timeframe}
          </div>
        </div>
      </div>

      {/* Timeframe Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Timeframe Predictions</h3>
        <div className="flex flex-wrap gap-2">
          {multiData.multi_timeframe.predictions.map((prediction) => {
            const Icon = getTimeframeIcon(prediction.timeframe);
            return (
              <button
                key={prediction.timeframe}
                onClick={() => setSelectedTimeframe(prediction.timeframe)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedTimeframe === prediction.timeframe
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{prediction.timeframe.toUpperCase()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Timeframe Details */}
      {selectedPrediction && (
        <div className="bg-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">
              {selectedPrediction.timeframe.toUpperCase()} Analysis
            </h4>
            <div className={`px-3 py-1 rounded-full text-sm ${getRiskColor(selectedPrediction.risk_level)}`}>
              {selectedPrediction.risk_level} RISK
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-400">Price Target</span>
                <div className="text-2xl font-bold text-white">
                  {formatPrice(selectedPrediction.price_target)}
                </div>
                <div className="text-sm text-slate-400">
                  Current: {formatPrice(basePrediction.current_price)}
                </div>
              </div>

              <div>
                <span className="text-sm text-slate-400">Confidence Score</span>
                <div className="text-xl font-bold text-blue-400">
                  {selectedPrediction.confidence_score}%
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-sm text-slate-400">Expected Volume</span>
                <div className="text-xl font-bold text-green-400">
                  {(selectedPrediction.volume_expectation / 1000000).toFixed(1)}M
                </div>
              </div>

              <div>
                <span className="text-sm text-slate-400">Analysis</span>
                <div className="text-sm text-slate-300 bg-slate-700 rounded p-3">
                  {selectedPrediction.reasoning}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Risk Timeline</h3>
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
