'use client';

import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  AlertTriangle,
  Star,
  Users,
  Activity,
  DollarSign,
  Calendar,
  Zap
} from 'lucide-react';
import { PredictionData } from '@/lib/lunarcrush-enhanced';

interface PredictionCardProps {
  prediction: PredictionData;
  onClose?: () => void;
  className?: string;
}

export default function PredictionCard({ prediction, onClose, className = '' }: PredictionCardProps) {
  const { symbol, current_price, social_metrics, ai_prediction, timestamp } = prediction;

  // Helper functions for formatting and styling
  const formatPrice = (price: number) => {
    return price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatLargeNumber = (num?: number) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toFixed(0);
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-gray-400';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'HIGH': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getGalaxyScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 3.5) return 'text-green-400';
    if (sentiment >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const calculatePriceChange24h = () => {
    return ((ai_prediction.price_target_24h - current_price) / current_price) * 100;
  };

  const calculatePriceChange7d = () => {
    return ((ai_prediction.price_target_7d - current_price) / current_price) * 100;
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  return (
    <div className={`bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-xl p-6
                     shadow-2xl max-w-2xl mx-auto ${className}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Brain className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{symbol} Analysis</h2>
            <p className="text-sm text-gray-400">AI-Powered Prediction</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            ×
          </button>
        )}
      </div>

      {/* Current Price & Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Current Price</span>
          </div>
          <p className="text-xl font-bold text-white">{formatPrice(current_price)}</p>
          {social_metrics.percent_change_24h !== undefined && (
            <p className={`text-sm ${getChangeColor(social_metrics.percent_change_24h)}`}>
              {formatPercentage(social_metrics.percent_change_24h)} 24h
            </p>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Galaxy Score</span>
          </div>
          <p className={`text-xl font-bold ${getGalaxyScoreColor(social_metrics.galaxy_score)}`}>
            {social_metrics.galaxy_score.toFixed(0)}/100
          </p>
          <p className="text-sm text-gray-400">AltRank #{social_metrics.alt_rank}</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">Risk Level</span>
          </div>
          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(ai_prediction.risk_level)}`}>
            {ai_prediction.risk_level}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Confidence: {ai_prediction.confidence_score}%
          </p>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 text-blue-400 mr-2" />
          AI Price Predictions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-400">24h Target</span>
            </div>
            <p className="text-xl font-bold text-white">{formatPrice(ai_prediction.price_target_24h)}</p>
            <p className={`text-sm ${getChangeColor(calculatePriceChange24h())}`}>
              {calculatePriceChange24h() > 0 ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
              {formatPercentage(calculatePriceChange24h())}
            </p>
          </div>

          <div className="text-center p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-gray-400">7d Target</span>
            </div>
            <p className="text-xl font-bold text-white">{formatPrice(ai_prediction.price_target_7d)}</p>
            <p className={`text-sm ${getChangeColor(calculatePriceChange7d())}`}>
              {calculatePriceChange7d() > 0 ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
              {formatPercentage(calculatePriceChange7d())}
            </p>
          </div>
        </div>
      </div>

      {/* Social Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-400">Social Volume</span>
          </div>
          <p className="text-sm font-medium text-white">
            {formatLargeNumber(social_metrics.social_volume_24h)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Activity className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-400">Interactions</span>
          </div>
          <p className="text-sm font-medium text-white">
            {formatLargeNumber(social_metrics.interactions_24h)}
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Sentiment</span>
          </div>
          <p className={`text-sm font-medium ${getSentimentColor(social_metrics.sentiment)}`}>
            {social_metrics.sentiment.toFixed(1)}/5
          </p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-400">Dominance</span>
          </div>
          <p className="text-sm font-medium text-white">
            {social_metrics.social_dominance.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Position Recommendation */}
      <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Position Recommendation</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-green-400">
              {ai_prediction.position_size_recommendation}%
            </p>
            <p className="text-sm text-gray-400">of portfolio</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-300">
              Based on risk level and confidence
            </p>
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center">
          <Brain className="h-4 w-4 text-blue-400 mr-2" />
          AI Analysis
        </h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          {ai_prediction.reasoning}
        </p>
      </div>

      {/* Timestamp */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Generated: {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
}
