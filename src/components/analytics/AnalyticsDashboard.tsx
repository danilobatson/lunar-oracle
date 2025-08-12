'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Zap,
  ArrowLeft,
  Target,
  Activity,
  Crown,
  TrendingUp
} from 'lucide-react';
import MultitimeframeAnalysis from './MultitimeframeAnalysis';
import SocialRadar from './SocialRadar';
import { PredictionData } from '@/lib/lunarcrush-enhanced';

interface AnalyticsDashboardProps {
  basePrediction: PredictionData;
  onBack?: () => void;
  className?: string;
}

type AnalyticsTab = 'timeframes' | 'social' | 'comparison';

export default function AnalyticsDashboard({
  basePrediction,
  onBack,
  className = ''
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('timeframes');

  const tabs = [
    {
      id: 'timeframes' as const,
      label: 'Multi-Timeframe',
      icon: BarChart3,
      description: 'Institutional-grade predictions across 5 timeframes',
      badge: 'AI POWERED',
      color: 'blue'
    },
    {
      id: 'social' as const,
      label: 'Social Radar',
      icon: Zap,
      description: 'Exclusive LunarCrush social intelligence visualization',
      badge: 'EXCLUSIVE',
      color: 'yellow'
    }
  ];

  const getTabColors = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive
        ? 'bg-blue-500 text-white border-blue-500'
        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-blue-500/50 hover:text-blue-400',
      yellow: isActive
        ? 'bg-yellow-500 text-black border-yellow-500'
        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-yellow-500/50 hover:text-yellow-400'
    };
    return colors[color as keyof typeof colors];
  };

  const getBadgeColors = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400',
      yellow: 'bg-yellow-500/20 text-yellow-400'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className={`bg-slate-900 rounded-xl p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}

          <div className="flex items-center space-x-3">
            <Activity className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">{basePrediction.symbol} Advanced Analytics</h1>
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white text-sm rounded-full">
              PREMIUM SUITE
            </span>
          </div>
        </div>

        <div className="text-sm text-slate-400">
          Real-time • Institutional Grade
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all ${getTabColors(tab.color, isActive)}`}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{tab.label}</span>
                    <span className={`px-2 py-1 text-xs rounded ${getBadgeColors(tab.color)}`}>
                      {tab.badge}
                    </span>
                  </div>
                  <div className={`text-sm ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Premium Features Highlight */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Crown className="h-5 w-5 text-purple-400" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-white font-semibold">Premium Analytics Suite</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">$50-100/month value</span>
              </div>
              <p className="text-slate-300 text-sm">
                {activeTab === 'timeframes'
                  ? 'Multi-timeframe AI predictions across 1h to 30d horizons - institutional-grade analysis unavailable elsewhere.'
                  : 'Exclusive LunarCrush social intelligence radar - the only platform with Galaxy Score visualization.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'timeframes' && (
          <MultitimeframeAnalysis
            basePrediction={basePrediction}
            className="border-0 bg-transparent p-0"
          />
        )}

        {activeTab === 'social' && (
          <SocialRadar
            socialMetrics={basePrediction.social_metrics}
            symbol={basePrediction.symbol}
            className="border-0 bg-transparent p-0"
          />
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-white font-semibold">Professional Analytics Complete</div>
              <div className="text-slate-400 text-sm">
                {activeTab === 'timeframes'
                  ? 'Switch to Social Radar for exclusive LunarCrush intelligence'
                  : 'View Multi-Timeframe Analysis for institutional predictions'
                }
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab(activeTab === 'timeframes' ? 'social' : 'timeframes')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {activeTab === 'timeframes' ? 'View Social Radar' : 'View Timeframes'}
          </button>
        </div>
      </div>
    </div>
  );
}
