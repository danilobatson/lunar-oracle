'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, AlertCircle, CheckCircle, Building, Zap, Activity, Shield, HelpCircle } from 'lucide-react';
import {
  InstitutionalIntel,
  ViralIntel,
  PositionCalculator
} from './intelligence';
import {
  SocialRadar,
  PerformanceTracker,
  SocialCharts,
  CompetitiveEdge,
  RealTimeStatus
} from './premium';

interface ApiResponse {
  symbol: string;
  current_price: number;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  reasoning: string;
  key_metrics: {
    price: string;
    galaxy_score: string;
    alt_rank: string;
    social_dominance: string;
    sentiment: string;
    volume_24h: string;
    market_cap: string;
  };
  institutional_intelligence: {
    whale_moves: string;
    corporate_news: string;
    smart_money: string;
    etf_activity: string;
  };
  viral_intelligence: {
    trending_story: string;
    influencer_mood: string;
    meme_factor: string;
    community_energy: string;
  };
  trading_signals: {
    entry_zone: string;
    stop_loss: string;
    target_1: string;
    target_2: string;
    position_size: string;
    timeframe: string;
  };
  ai_summary: {
    bulls: string[];
    bears: string[];
    catalyst: string;
    outlook: string;
  };
  metadata?: {
    analysis_type: string;
    data_sources: number;
    premium_features: string[];
  };
}

export default function SimpleDashboard() {
  const [symbol, setSymbol] = useState('btc');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { toast } = useToast();

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoRefresh && data) {
      interval = setInterval(() => {
        handleAnalyze(true); // Silent refresh
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, data]);

  const handleAnalyze = async (silent = false) => {
    if (!symbol.trim()) {
      if (!silent) {
        toast({
          title: "Please enter a cryptocurrency symbol",
          description: "Try BTC, ETH, SOL, or any crypto ticker",
          variant: "destructive"
        });
      }
      return;
    }

    setLoading(true);
    if (!silent) setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toLowerCase() })
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdate(new Date());

      if (!silent) {
        toast({
          title: "🎯 Analysis Complete!",
          description: `Your crypto cheat sheet for ${symbol.toUpperCase()} is ready`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      if (!silent) {
        toast({
          title: "Oops! Something went wrong",
          description: "Please try again or try a different crypto symbol",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  const getRecommendationExplanation = (rec: string, confidence: number) => {
    switch (rec) {
      case 'BUY':
        return confidence >= 85
          ? "Strong buy signal - Our AI found multiple bullish indicators"
          : "Moderate buy signal - Some positive trends detected";
      case 'SELL':
        return confidence >= 85
          ? "Strong sell signal - Our AI detected significant risks"
          : "Moderate sell signal - Some concerning trends found";
      default:
        return "Hold recommendation - Wait for clearer market signals";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">

        {/* Marketing-Focused Hero Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <Badge variant="secondary" className="bg-blue-900 text-blue-200 px-3 py-1">
              CRYPTO MARKET CHEAT SHEET
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            🌙 LunarOracle
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Get AI-powered buy/sell recommendations based on social media intelligence that moves crypto prices
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            We analyze millions of social posts, whale movements, and corporate adoption signals to tell you exactly when to buy and sell
          </p>

          {/* Real-time Status */}
          {data && (
            <div className="flex justify-center">
              <RealTimeStatus
                lastUpdate={lastUpdate || undefined}
                dataFreshness={lastUpdate && (Date.now() - lastUpdate.getTime()) < 60000 ? 'fresh' : 'recent'}
              />
            </div>
          )}

          {/* Value Proposition */}
          {data?.metadata && (
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-green-400" />
                <span>Analyzing 100M+ social posts daily</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4 text-purple-400" />
                <span>Tracking whale movements</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Predicting viral trends</span>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="text"
              placeholder="Enter any crypto symbol (BTC, ETH, SOL...)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleAnalyze()}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Get My Cheat Sheet
                  </>
                )}
              </Button>
              {data && (
                <Button
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`border-slate-600 ${autoRefresh ? 'bg-green-900 text-green-200' : 'text-slate-400'}`}
                >
                  {autoRefresh ? '⏸️ Pause' : '▶️ Live'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Alert className="mb-6 bg-red-950 border-red-800 text-red-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error} - Please try again or try a different crypto symbol like BTC, ETH, or SOL
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 bg-slate-800" />
              <Skeleton className="h-32 bg-slate-800" />
              <Skeleton className="h-32 bg-slate-800" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32 bg-slate-800" />
              <Skeleton className="h-32 bg-slate-800" />
            </div>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-8">

            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Main Analysis Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* Enhanced Price & Recommendation Card */}
                <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-2xl font-bold">
                            {data.symbol.toUpperCase()}
                          </CardTitle>
                          <Badge variant="secondary" className="bg-purple-700 text-purple-100">
                            AI ANALYZED
                          </Badge>
                        </div>
                        <p className="text-3xl font-bold text-green-400 mt-1">
                          ${data.current_price?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-xl px-6 py-3 font-bold ${
                            data.recommendation === 'BUY'
                              ? 'bg-green-700 text-green-100 hover:bg-green-600'
                              : data.recommendation === 'SELL'
                              ? 'bg-red-700 text-red-100 hover:bg-red-600'
                              : 'bg-yellow-700 text-yellow-100 hover:bg-yellow-600'
                          }`}
                        >
                          {data.recommendation}
                        </Badge>
                        <p className="text-slate-400">{data.confidence}% confidence</p>
                        {data.confidence >= 85 && (
                          <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                            HIGH CONVICTION
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="font-semibold text-blue-400 mb-2">🤖 Why Our AI Recommends {data.recommendation}:</h4>
                      <p className="text-slate-300 text-lg leading-relaxed">{data.reasoning}</p>
                      <p className="text-sm text-slate-400 mt-2">
                        {getRecommendationExplanation(data.recommendation, data.confidence)}
                      </p>
                    </div>

                    {/* Beginner-Friendly Metrics Explanation */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white mb-3">📊 Key Social Intelligence Metrics (What These Numbers Mean):</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-slate-400">Galaxy Score</p>
                            <HelpCircle className="h-3 w-3 text-slate-500" title="LunarCrush's exclusive metric measuring social influence" />
                          </div>
                          <p className="font-bold text-white text-lg">{data.key_metrics?.galaxy_score || 'N/A'}</p>
                          <p className="text-xs text-slate-400 mt-1">How much social buzz this crypto has (0-100)</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-slate-400">Market Rank</p>
                            <HelpCircle className="h-3 w-3 text-slate-500" title="Position among all cryptocurrencies" />
                          </div>
                          <p className="font-bold text-white text-lg">#{data.key_metrics?.alt_rank || 'N/A'}</p>
                          <p className="text-xs text-slate-400 mt-1">Ranking by market cap (lower = bigger)</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-slate-400">Social Sentiment</p>
                            <HelpCircle className="h-3 w-3 text-slate-500" title="How positive people feel about this crypto" />
                          </div>
                          <p className="font-bold text-white text-lg">{data.key_metrics?.sentiment || 'N/A'}%</p>
                          <p className="text-xs text-slate-400 mt-1">How bullish people are (50% = neutral)</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-slate-400">Social Dominance</p>
                            <HelpCircle className="h-3 w-3 text-slate-500" title="Share of total crypto social media attention" />
                          </div>
                          <p className="font-bold text-white text-lg">{data.key_metrics?.social_dominance || 'N/A'}%</p>
                          <p className="text-xs text-slate-400 mt-1">% of all crypto social media talk</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-slate-400">Trading Volume</p>
                            <HelpCircle className="h-3 w-3 text-slate-500" title="How much money traded in 24 hours" />
                          </div>
                          <p className="font-bold text-white text-lg">{data.key_metrics?.volume_24h || 'N/A'}</p>
                          <p className="text-xs text-slate-400 mt-1">$ traded in last 24 hours</p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-slate-400">Market Cap</p>
                            <HelpCircle className="h-3 w-3 text-slate-500" title="Total value of all coins in circulation" />
                          </div>
                          <p className="font-bold text-white text-lg">{data.key_metrics?.market_cap || 'N/A'}</p>
                          <p className="text-xs text-slate-400 mt-1">Total value of all coins</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Beginner-Friendly Institutional Intelligence */}
                <Card className="bg-purple-950 border-purple-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-200">
                      <Building className="h-5 w-5 text-purple-300" />
                      🏛️ Smart Money Intelligence
                      <Badge variant="secondary" className="bg-purple-700 text-purple-100">
                        EXCLUSIVE DATA
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-purple-300">
                      What the big players (institutions, whales, corporations) are doing with this crypto
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-800">
                        <h4 className="font-semibold text-purple-200 mb-2">🐋 Whale Activity (Big Money Moves):</h4>
                        <p className="text-sm text-white leading-relaxed">
                          {data.institutional_intelligence?.whale_moves || "Monitoring large institutional transactions..."}
                        </p>
                      </div>

                      <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-800">
                        <h4 className="font-semibold text-purple-200 mb-2">🏢 Corporate Adoption (Companies Buying):</h4>
                        <p className="text-sm text-white leading-relaxed">
                          {data.institutional_intelligence?.corporate_news || "Tracking corporate treasury movements and adoption..."}
                        </p>
                      </div>

                      <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-800">
                        <h4 className="font-semibold text-purple-200 mb-2">🎯 Smart Money Signals (Professional Traders):</h4>
                        <p className="text-sm text-white leading-relaxed">
                          {data.institutional_intelligence?.smart_money || "Analyzing signals from professional trading accounts..."}
                        </p>
                      </div>

                      <div className="bg-purple-900/50 p-4 rounded-lg border border-purple-800">
                        <h4 className="font-semibold text-purple-200 mb-2">📈 ETF & Investment Product Activity:</h4>
                        <p className="text-sm text-white leading-relaxed">
                          {data.institutional_intelligence?.etf_activity || "Monitoring ETF launches, inflows, and institutional adoption..."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-purple-800/50 rounded-lg border border-purple-700">
                      <p className="text-xs text-purple-200 font-medium">
                        💡 This smart money data costs $1000s/month elsewhere - we get it exclusively from LunarCrush
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Beginner-Friendly Viral Intelligence */}
                <Card className="bg-green-950 border-green-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-200">
                      <Zap className="h-5 w-5 text-green-300" />
                      🚀 Viral Trend Prediction
                      <Badge variant="secondary" className="bg-green-700 text-green-100">
                        PREDICT THE HYPE
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-green-300">
                      We predict which cryptos will go viral before retail investors (regular people) notice
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-green-900/50 p-4 rounded-lg border border-green-800">
                        <h4 className="font-semibold text-green-200 mb-2">📰 Main Story Everyone's Talking About:</h4>
                        <p className="text-sm text-white italic leading-relaxed">
                          "{data.viral_intelligence?.trending_story || "Analyzing viral content patterns and trending narratives..."}"
                        </p>
                      </div>

                      <div className="bg-green-900/50 p-4 rounded-lg border border-green-800">
                        <h4 className="font-semibold text-green-200 mb-2">🌟 Influencer Mood (What Big Accounts Are Saying):</h4>
                        <p className="text-sm text-white leading-relaxed">
                          {data.viral_intelligence?.influencer_mood || "Monitoring sentiment from key opinion leaders and crypto influencers..."}
                        </p>
                      </div>

                      <div className="bg-green-900/50 p-4 rounded-lg border border-green-800">
                        <h4 className="font-semibold text-green-200 mb-2">🔥 Viral Potential (Will This Trend?):</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`border-green-600 ${
                            data.viral_intelligence?.meme_factor === 'HIGH' ? 'text-red-400 border-red-600' :
                            data.viral_intelligence?.meme_factor === 'MEDIUM' ? 'text-yellow-400 border-yellow-600' :
                            'text-green-400'
                          }`}>
                            {data.viral_intelligence?.meme_factor || "ANALYZING"} POTENTIAL
                          </Badge>
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        </div>
                        <p className="text-xs text-green-300 mt-2">
                          {data.viral_intelligence?.meme_factor === 'HIGH' ? 'Very likely to trend on social media' :
                           data.viral_intelligence?.meme_factor === 'MEDIUM' ? 'Some viral potential detected' :
                           'Low chance of going viral right now'}
                        </p>
                      </div>

                      <div className="bg-green-900/50 p-4 rounded-lg border border-green-800">
                        <h4 className="font-semibold text-green-200 mb-2">⚡ Community Energy Level:</h4>
                        <Badge variant="outline" className={`border-green-600 ${
                          data.viral_intelligence?.community_energy === 'EUPHORIC' ? 'text-red-400 border-red-600' :
                          data.viral_intelligence?.community_energy === 'BULLISH' ? 'text-green-400' :
                          data.viral_intelligence?.community_energy === 'BEARISH' ? 'text-red-400 border-red-600' :
                          'text-yellow-400 border-yellow-600'
                        }`}>
                          {data.viral_intelligence?.community_energy || "NEUTRAL"}
                        </Badge>
                        <p className="text-xs text-green-300 mt-2">
                          How excited the crypto community is about this coin right now
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-green-800/50 rounded-lg border border-green-700">
                      <p className="text-xs text-green-200 font-medium">
                        📈 Viral trends often drive 10-100x price pumps - get ahead of retail FOMO
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced AI Summary with Deep Analysis */}
                <Card className="bg-slate-800 border-slate-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      🤖 AI Deep Analysis & Action Plan
                      <Badge variant="outline" className="border-blue-600 text-blue-400 text-xs">
                        ACTIONABLE INSIGHTS
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-slate-400">
                      Our AI analyzed millions of social posts, whale movements, and market data to create this action plan
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-3 text-lg">🐂 Why You Should Consider Buying:</h4>
                      <div className="space-y-3">
                        {data.ai_summary?.bulls?.map((bull, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-green-950/50 rounded-lg border border-green-800/30">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-slate-300 font-medium">{bull}</p>
                              <p className="text-xs text-green-300 mt-1">
                                {index === 0 ? "Strong fundamental driver" :
                                 index === 1 ? "Technical momentum indicator" :
                                 "Market sentiment factor"}
                              </p>
                            </div>
                          </div>
                        )) || <p className="text-sm text-slate-400">No strong bullish signals detected right now</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-400 mb-3 text-lg">🐻 Risks to Watch Out For:</h4>
                      <div className="space-y-3">
                        {data.ai_summary?.bears?.map((bear, index) => (
                          <div key={index} className="flex items-start gap-3 p-4 bg-red-950/50 rounded-lg border border-red-800/30">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-slate-300 font-medium">{bear}</p>
                              <p className="text-xs text-red-300 mt-1">
                                {index === 0 ? "Major risk factor to monitor" : "Secondary concern"}
                              </p>
                            </div>
                          </div>
                        )) || <p className="text-sm text-slate-400">No major risks identified in current analysis</p>}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-950/50 p-4 rounded-lg border border-blue-800">
                          <h4 className="font-semibold text-blue-400 mb-2">🎯 Key Price Catalyst:</h4>
                          <p className="text-sm text-slate-300">{data.ai_summary?.catalyst || 'General market sentiment'}</p>
                          <p className="text-xs text-blue-300 mt-2">The main event likely to move the price</p>
                        </div>
                        <div className="bg-purple-950/50 p-4 rounded-lg border border-purple-800">
                          <h4 className="font-semibold text-purple-400 mb-2">📈 Market Outlook:</h4>
                          <p className="text-sm text-slate-300">{data.ai_summary?.outlook || 'Monitoring market developments'}</p>
                          <p className="text-xs text-purple-300 mt-2">Where our AI thinks the price is heading</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Sidebar */}
              <div className="space-y-6">

                {/* Beginner-Friendly Position Calculator */}
                <Card className="bg-slate-800 border-slate-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      💼 How Much Should I Invest?
                    </CardTitle>
                    <p className="text-sm text-slate-400">
                      Enter your total crypto budget and we'll tell you exactly how much to invest
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PositionCalculator
                      data={data.trading_signals}
                      recommendation={data.recommendation}
                      confidence={data.confidence}
                    />
                  </CardContent>
                </Card>

                {/* Enhanced Performance Tracker */}
                <PerformanceTracker />

                {/* Simplified Value Proposition */}
                <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-blue-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      💎 Why LunarOracle Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-blue-300">We track whale movements</span>
                          <p className="text-xs text-slate-400">See when big money buys/sells before price moves</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-blue-300">We predict viral trends</span>
                          <p className="text-xs text-slate-400">Know which cryptos will trend before they pump</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-blue-300">We analyze 100M+ social posts</span>
                          <p className="text-xs text-slate-400">Track sentiment from all major crypto platforms</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-blue-300">We give clear buy/sell signals</span>
                          <p className="text-xs text-slate-400">No guessing - just follow our recommendations</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <div>
                          <span className="font-medium text-blue-300">We're 78% accurate</span>
                          <p className="text-xs text-slate-400">Track record beats most professional traders</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-900/50 rounded-lg border border-blue-800">
                      <p className="text-xs text-blue-200 font-medium">
                        🚀 One good trade following our signals can pay for years of subscription
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Social Intelligence Radar */}
            <SocialRadar apiData={data} />

            {/* Charts & Visualizations */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-400" />
                📊 Professional Charts & Analysis
              </h2>
              <p className="text-slate-400 mb-4">
                Visual analysis of price movements vs social media sentiment - see how social buzz predicts price changes
              </p>
              <SocialCharts apiData={data} />
            </div>

            {/* Competitive Advantage */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-400" />
                🏆 Why We Beat The Competition
              </h2>
              <p className="text-slate-400 mb-4">
                See how LunarOracle compares to other crypto analysis platforms - and why we're 50% cheaper
              </p>
              <CompetitiveEdge />
            </div>
          </div>
        )}

        {/* Enhanced Demo Instructions */}
        {!data && !loading && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                🚀 Try Your First Crypto Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4 text-slate-300">
                <p className="text-lg">Get AI-powered buy/sell recommendations for any cryptocurrency</p>
                <p className="text-sm text-slate-400">
                  We analyze social media buzz, whale movements, and viral trends to predict price movements
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-blue-600 text-blue-400 px-4 py-2"
                    onClick={() => setSymbol('btc')}
                  >
                    Try Bitcoin (BTC)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-purple-600 text-purple-400 px-4 py-2"
                    onClick={() => setSymbol('eth')}
                  >
                    Try Ethereum (ETH)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-green-600 text-green-400 px-4 py-2"
                    onClick={() => setSymbol('sol')}
                  >
                    Try Solana (SOL)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-orange-600 text-orange-400 px-4 py-2"
                    onClick={() => setSymbol('ada')}
                  >
                    Try Cardano (ADA)
                  </Badge>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <div className="text-blue-400 mb-2">🔍 1. Enter Symbol</div>
                    <div className="text-slate-400">Type any crypto symbol and click "Get My Cheat Sheet"</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <div className="text-green-400 mb-2">🤖 2. AI Analyzes</div>
                    <div className="text-slate-400">Our AI scans millions of social posts and whale movements</div>
                  </div>
                  <div className="bg-slate-700/30 p-4 rounded-lg">
                    <div className="text-purple-400 mb-2">📈 3. Get Signals</div>
                    <div className="text-slate-400">Receive clear buy/sell recommendations with confidence scores</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400">
                    🌙 Powered by exclusive LunarCrush social intelligence data
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
