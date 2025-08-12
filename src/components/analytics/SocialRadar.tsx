'use client';

import React, { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import {
  Zap,
  Users,
  TrendingUp,
  Star,
  Activity,
  Info,
  Target,
  Crown,
  AlertCircle
} from 'lucide-react';
import { SocialMetrics } from '@/lib/lunarcrush-enhanced';

interface SocialRadarProps {
  socialMetrics: SocialMetrics;
  symbol: string;
  className?: string;
}

interface RadarDataPoint {
  metric: string;
  value: number;
  fullMark: number;
  color: string;
  icon: any;
  description: string;
  strength: 'WEAK' | 'MODERATE' | 'STRONG';
}

export default function SocialRadar({ socialMetrics, symbol, className = '' }: SocialRadarProps) {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Normalize and prepare radar data
  const prepareRadarData = (): RadarDataPoint[] => {
    return [
      {
        metric: 'Galaxy Score',
        value: Math.min(socialMetrics.galaxy_score || 0, 100),
        fullMark: 100,
        color: '#8b5cf6',
        icon: Crown,
        description: 'LunarCrush proprietary score combining social engagement, price performance, and market activity. Higher scores indicate stronger overall crypto presence.',
        strength: (socialMetrics.galaxy_score || 0) >= 70 ? 'STRONG' : (socialMetrics.galaxy_score || 0) >= 40 ? 'MODERATE' : 'WEAK'
      },
      {
        metric: 'Sentiment',
        value: Math.min(Math.max((socialMetrics.sentiment || 0) * 100, 0), 100),
        fullMark: 100,
        color: '#10b981',
        icon: TrendingUp,
        description: 'Social sentiment analysis from millions of posts. Values above 50 indicate positive sentiment, below 50 negative.',
        strength: (socialMetrics.sentiment || 0) >= 0.7 ? 'STRONG' : (socialMetrics.sentiment || 0) >= 0.5 ? 'MODERATE' : 'WEAK'
      },
      {
        metric: 'Social Volume',
        value: Math.min((socialMetrics.social_volume_24h || 0) / 10000 * 100, 100),
        fullMark: 100,
        color: '#3b82f6',
        icon: Users,
        description: '24-hour social post volume across all tracked platforms. Higher volume indicates increased discussion and attention.',
        strength: (socialMetrics.social_volume_24h || 0) >= 5000 ? 'STRONG' : (socialMetrics.social_volume_24h || 0) >= 1000 ? 'MODERATE' : 'WEAK'
      },
      {
        metric: 'Interactions',
        value: Math.min((socialMetrics.interactions_24h || 0) / 50000 * 100, 100),
        fullMark: 100,
        color: '#f59e0b',
        icon: Activity,
        description: '24-hour social interactions including likes, shares, comments. Measures actual engagement quality beyond just mentions.',
        strength: (socialMetrics.interactions_24h || 0) >= 25000 ? 'STRONG' : (socialMetrics.interactions_24h || 0) >= 5000 ? 'MODERATE' : 'WEAK'
      },
      {
        metric: 'Dominance',
        value: Math.min((socialMetrics.social_dominance || 0) * 100, 100),
        fullMark: 100,
        color: '#ef4444',
        icon: Target,
        description: 'Social dominance percentage - how much of total crypto social discussion this asset represents. Higher = more market attention.',
        strength: (socialMetrics.social_dominance || 0) >= 0.05 ? 'STRONG' : (socialMetrics.social_dominance || 0) >= 0.01 ? 'MODERATE' : 'WEAK'
      },
      {
        metric: 'AltRank',
        value: socialMetrics.alt_rank ? Math.max(100 - (socialMetrics.alt_rank / 20), 0) : 0,
        fullMark: 100,
        color: '#06b6d4',
        icon: Star,
        description: 'LunarCrush AltRank - comprehensive ranking system. Lower rank numbers (higher chart values) indicate better overall crypto performance.',
        strength: (socialMetrics.alt_rank || 1000) <= 50 ? 'STRONG' : (socialMetrics.alt_rank || 1000) <= 200 ? 'MODERATE' : 'WEAK'
      }
    ];
  };

  const radarData = prepareRadarData();

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'STRONG': return 'text-green-400';
      case 'MODERATE': return 'text-yellow-400';
      case 'WEAK': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStrengthBg = (strength: string) => {
    switch (strength) {
      case 'STRONG': return 'bg-green-500/20 border-green-500/30';
      case 'MODERATE': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'WEAK': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-slate-500/20 border-slate-500/30';
    }
  };

  // Custom tooltip for radar chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-2 mb-2">
            <data.icon className="h-4 w-4" style={{ color: data.color }} />
            <span className="text-white font-semibold">{data.metric}</span>
          </div>
          <div className="text-sm space-y-1">
            <div className="text-slate-300">Score: <span className="text-white">{data.value.toFixed(1)}/100</span></div>
            <div className={`${getStrengthColor(data.strength)}`}>
              Strength: {data.strength}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-slate-900 rounded-xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-6 w-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Social Intelligence Radar</h2>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
            EXCLUSIVE LUNARCRUSH DATA
          </span>
        </div>
        <div className="text-sm text-slate-400">
          {symbol} • Real-time Social Analysis
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Social Strength Visualization</h3>
          <div className="bg-slate-800 rounded-lg p-4" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid gridType="polygon" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  className="text-slate-400"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  tickCount={6}
                />
                <Radar
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Detailed Metrics</h3>
          <div className="space-y-3">
            {radarData.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.metric}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMetric === metric.metric
                      ? getStrengthBg(metric.strength)
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setSelectedMetric(
                    selectedMetric === metric.metric ? null : metric.metric
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" style={{ color: metric.color }} />
                      <span className="text-white font-medium">{metric.metric}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-bold">{metric.value.toFixed(1)}</span>
                      <span className={`text-sm px-2 py-1 rounded ${getStrengthColor(metric.strength)}`}>
                        {metric.strength}
                      </span>
                    </div>
                  </div>

                  {selectedMetric === metric.metric && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-300">{metric.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Competitive Advantage Callout */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Crown className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">Exclusive LunarCrush Intelligence</h4>
            <p className="text-slate-300 text-sm mb-3">
              This social intelligence radar uses proprietary LunarCrush data unavailable on any other platform.
              Galaxy Score and AltRank provide unique insights into crypto social performance.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                Exclusive Data
              </span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                Real-time Updates
              </span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                Competitive Edge
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-3">Social Intelligence Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {radarData.find(m => m.metric === 'Galaxy Score')?.value.toFixed(0) || '0'}
            </div>
            <div className="text-sm text-slate-400">Galaxy Score</div>
            <div className="text-xs text-slate-500">LunarCrush Proprietary</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {radarData.filter(m => m.strength === 'STRONG').length}
            </div>
            <div className="text-sm text-slate-400">Strong Metrics</div>
            <div className="text-xs text-slate-500">Out of 6 total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {(radarData.reduce((sum, m) => sum + m.value, 0) / radarData.length).toFixed(0)}
            </div>
            <div className="text-sm text-slate-400">Overall Score</div>
            <div className="text-xs text-slate-500">Composite Average</div>
          </div>
        </div>
      </div>
    </div>
  );
}
