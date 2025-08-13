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
import MarketingLanding from './MarketingLanding';
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
  // FIXED: Clear state management
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false); // CRITICAL: This controls what's shown
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

  // FIXED: Clear function to switch to analysis view (NO AUTO-TRIGGER)
  const handleStartAnalysis = () => {
    console.log('🚀 Starting analysis view - showing search interface');
    setShowAnalysis(true);
    // Do NOT auto-trigger analysis - let user choose what to analyze
  };

  // FIXED: Enhanced analyze function with better error handling
  const handleAnalyze = async (silent = false) => {
    console.log('🔍 Analyzing:', symbol);

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
      setShowAnalysis(true); // Ensure we're in analysis view

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

  // FIXED: Clear conditional rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full px-6 py-6">

        {/* FIXED: Clear conditional - show marketing landing OR analysis interface */}
        {!showAnalysis ? (
          /* MARKETING LANDING PAGE */
          <div className="w-full max-w-none">
            <MarketingLanding onStartAnalysis={handleStartAnalysis} />
          </div>
        ) : (
          /* ANALYSIS INTERFACE */
          <>
            {/* Analysis Interface Header */}
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
                  placeholder="Enter crypto symbol (BTC, ETH, SOL, ADA...)"
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

              {/* Back to Marketing Button */}
              <div className="mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowAnalysis(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ← Back to Homepage
                </Button>
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

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-slate-400">Galaxy Score</p>
                              <span title="LunarCrush's exclusive metric measuring social influence"><HelpCircle className="h-3 w-3 text-slate-500" /></span>
                            </div>
                            <p className="font-bold text-white text-lg">{data.key_metrics?.galaxy_score || 'N/A'}</p>
                            <p className="text-xs text-slate-400 mt-1">How much social buzz this crypto has (0-100)</p>
                          </div>
                          <div className="bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-slate-400">Market Rank</p>
                              <span title="Position among all cryptocurrencies"><HelpCircle className="h-3 w-3 text-slate-500" /></span>
                            </div>
                            <p className="font-bold text-white text-lg">#{data.key_metrics?.alt_rank || 'N/A'}</p>
                            <p className="text-xs text-slate-400 mt-1">Ranking by market cap (lower = bigger)</p>
                          </div>
                          <div className="bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-slate-400">Social Sentiment</p>
                              <span title="How positive people feel about this crypto"><HelpCircle className="h-3 w-3 text-slate-500" /></span>
                            </div>
                            <p className="font-bold text-white text-lg">{data.key_metrics?.sentiment || 'N/A'}</p>
                            <p className="text-xs text-slate-400 mt-1">How bullish people are (50% = neutral)</p>
                          </div>
                          <div className="bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="text-slate-400">Social Dominance</p>
                              <span title="Share of total crypto social media attention"><HelpCircle className="h-3 w-3 text-slate-500" /></span>
                            </div>
                            <p className="font-bold text-white text-lg">{data.key_metrics?.social_dominance || 'N/A'}</p>
                            <p className="text-xs text-slate-400 mt-1">% of all crypto social media talk</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Intelligence Components */}
                    <InstitutionalIntel data={data.institutional_intelligence} />
                    <ViralIntel data={data.viral_intelligence} />

                    {/* AI Summary */}
                    <Card className="bg-slate-800 border-slate-700 text-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-blue-400" />
                          🤖 AI Analysis Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-green-400 mb-2">🐂 Bullish Factors:</h4>
                          <ul className="text-sm text-slate-300 space-y-1">
                            {data.ai_summary?.bulls?.map((bull, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                                {bull}
                              </li>
                            )) || <li>No bullish factors identified</li>}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-red-400 mb-2">🐻 Risk Factors:</h4>
                          <ul className="text-sm text-slate-300 space-y-1">
                            {data.ai_summary?.bears?.map((bear, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                                {bear}
                              </li>
                            )) || <li>No significant risks identified</li>}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-700">
                          <p className="text-sm">
                            <span className="font-semibold text-blue-400">Key Catalyst:</span> {data.ai_summary?.catalyst || 'Market sentiment'}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-semibold text-blue-400">Outlook:</span> {data.ai_summary?.outlook || 'Monitoring developments'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <PositionCalculator
                      data={data.trading_signals}
                      recommendation={data.recommendation}
                      confidence={data.confidence}
                    />
                    <PerformanceTracker />
                  </div>
                </div>

                {/* Premium Features */}
                <SocialRadar apiData={data} />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">📊 Professional Charts & Analysis</h2>
                  <SocialCharts apiData={data} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">🏆 Why We Beat The Competition</h2>
                  <CompetitiveEdge />
                </div>
              </div>
            )}

            {/* Demo Instructions for Analysis Mode */}
            {!data && !loading && showAnalysis && (
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
