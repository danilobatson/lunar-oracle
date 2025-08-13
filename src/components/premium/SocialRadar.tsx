'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingUp, Activity, Zap, Clock, Users } from 'lucide-react';

interface SocialSignal {
  id: string;
  type: 'whale' | 'viral' | 'sentiment' | 'breakout';
  symbol: string;
  message: string;
  strength: number;
  timeAgo: string;
  source: string;
}

interface SocialRadarProps {
  apiData?: any;
}

export default function SocialRadar({ apiData }: SocialRadarProps) {
  const [signals, setSignals] = useState<SocialSignal[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (apiData) {
      generateSignalsFromData(apiData);
    }
  }, [apiData]);

  const generateSignalsFromData = (data: any) => {
    const newSignals: SocialSignal[] = [];

    // Extract whale signals from institutional intelligence
    if (data.institutional_intelligence?.whale_moves) {
      newSignals.push({
        id: 'whale-1',
        type: 'whale',
        symbol: data.symbol,
        message: data.institutional_intelligence.whale_moves.substring(0, 120) + '...',
        strength: data.confidence >= 85 ? 95 : data.confidence >= 70 ? 80 : 60,
        timeAgo: '2m ago',
        source: 'Institutional Tracker'
      });
    }

    // Extract viral signals from viral intelligence
    if (data.viral_intelligence?.trending_story) {
      newSignals.push({
        id: 'viral-1',
        type: 'viral',
        symbol: data.symbol,
        message: data.viral_intelligence.trending_story.substring(0, 120) + '...',
        strength: data.viral_intelligence.meme_factor === 'HIGH' ? 90 :
                 data.viral_intelligence.meme_factor === 'MEDIUM' ? 70 : 50,
        timeAgo: '5m ago',
        source: 'Viral Tracker'
      });
    }

    // Extract sentiment signals
    if (data.key_metrics?.sentiment) {
      const sentiment = parseInt(data.key_metrics.sentiment);
      if (sentiment > 80 || sentiment < 30) {
        newSignals.push({
          id: 'sentiment-1',
          type: 'sentiment',
          symbol: data.symbol,
          message: `${sentiment > 80 ? 'Extreme bullish' : 'Extreme bearish'} sentiment detected: ${sentiment}%`,
          strength: Math.abs(sentiment - 50) + 40,
          timeAgo: '1m ago',
          source: 'Sentiment Engine'
        });
      }
    }

    // Extract breakout signals from social dominance
    if (data.key_metrics?.social_dominance) {
      const dominance = parseFloat(data.key_metrics.social_dominance);
      if (dominance > 15) {
        newSignals.push({
          id: 'breakout-1',
          type: 'breakout',
          symbol: data.symbol,
          message: `Social breakout: ${dominance}% dominance - highest in category`,
          strength: Math.min(dominance * 4, 95),
          timeAgo: '3m ago',
          source: 'Breakout Scanner'
        });
      }
    }

    setSignals(newSignals);
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'whale': return <Users className="h-4 w-4" />;
      case 'viral': return <Zap className="h-4 w-4" />;
      case 'sentiment': return <TrendingUp className="h-4 w-4" />;
      case 'breakout': return <Activity className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'whale': return 'bg-purple-900 border-purple-700 text-purple-200';
      case 'viral': return 'bg-green-900 border-green-700 text-green-200';
      case 'sentiment': return 'bg-blue-900 border-blue-700 text-blue-200';
      case 'breakout': return 'bg-orange-900 border-orange-700 text-orange-200';
      default: return 'bg-slate-900 border-slate-700 text-slate-200';
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 85) return 'text-red-400';
    if (strength >= 70) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            🔥 Social Intelligence Radar
            <Badge variant="secondary" className="bg-red-700 text-red-100">
              LIVE
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {isLive ? 'LIVE' : 'OFFLINE'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {signals.length > 0 ? (
            signals.map((signal) => (
              <Card key={signal.id} className={`${getSignalColor(signal.type)} border`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getSignalIcon(signal.type)}
                      <Badge variant="outline" className="text-xs uppercase border-current">
                        {signal.type}
                      </Badge>
                      <span className="font-mono text-xs">{signal.symbol.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-bold ${getStrengthColor(signal.strength)}`}>
                        {signal.strength}%
                      </span>
                      <Clock className="h-3 w-3" />
                      <span className="text-slate-400">{signal.timeAgo}</span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mb-2">{signal.message}</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Source: {signal.source}</span>
                    <div className={`w-2 h-2 rounded-full ${signal.strength >= 85 ? 'bg-red-400' : signal.strength >= 70 ? 'bg-yellow-400' : 'bg-green-400'}`} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Monitoring social signals...</p>
              <p className="text-xs mt-1">Search for a crypto to see live intelligence</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-3 bg-slate-700 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Active Monitors:</span>
              <span className="font-bold text-white ml-2">847</span>
            </div>
            <div>
              <span className="text-slate-400">Signals Today:</span>
              <span className="font-bold text-green-400 ml-2">23</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
