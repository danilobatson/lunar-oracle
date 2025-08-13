'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, AlertCircle, CheckCircle, Building, Zap, Activity, Shield } from 'lucide-react';
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
          title: "Error",
          description: "Please enter a crypto symbol",
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
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdate(new Date());

      if (!silent) {
        toast({
          title: "🏛️ Institutional Analysis Complete!",
          description: `Professional intelligence generated for ${symbol.toUpperCase()}`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      if (!silent) {
        toast({
          title: "Error",
          description: errorMessage,
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">

        {/* Enhanced Hero Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <Badge variant="secondary" className="bg-blue-900 text-blue-200 px-3 py-1">
              INSTITUTIONAL GRADE
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            🌙 LunarOracle
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Professional crypto intelligence with institutional-grade social data analysis
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

          {/* Premium Features Badge */}
          {data?.metadata && (
            <div className="flex items-center justify-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-green-400" />
                <span>{data.metadata.data_sources} Data Sources</span>
              </div>
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4 text-purple-400" />
                <span>Institutional Grade</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Smart Money Tracking</span>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Enter crypto symbol (btc, eth, sol...)"
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
                    🔮 Analyze
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
            <AlertDescription>{error}</AlertDescription>
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
                          {data.metadata?.analysis_type === "institutional_grade" && (
                            <Badge variant="secondary" className="bg-purple-700 text-purple-100">
                              INSTITUTIONAL
                            </Badge>
                          )}
                        </div>
                        <p className="text-3xl font-bold text-green-400 mt-1">
                          ${data.current_price?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <Badge
                          variant="secondary"
                          className={`text-lg px-4 py-2 ${
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
                    <p className="text-slate-300 mb-4 text-lg leading-relaxed">{data.reasoning}</p>

                    {/* Enhanced Key Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-400">Galaxy Score</p>
                        <p className="font-bold text-white text-lg">{data.key_metrics?.galaxy_score || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-400">Alt Rank</p>
                        <p className="font-bold text-white text-lg">#{data.key_metrics?.alt_rank || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-400">Sentiment</p>
                        <p className="font-bold text-white text-lg">{data.key_metrics?.sentiment || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-400">Social Dom</p>
                        <p className="font-bold text-white text-lg">{data.key_metrics?.social_dominance || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-400">Volume 24h</p>
                        <p className="font-bold text-white text-lg">{data.key_metrics?.volume_24h || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-slate-400">Market Cap</p>
                        <p className="font-bold text-white text-lg">{data.key_metrics?.market_cap || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Institutional Intelligence */}
                <InstitutionalIntel data={data.institutional_intelligence} />

                {/* Viral Intelligence */}
                <ViralIntel data={data.viral_intelligence} />

                {/* Enhanced AI Summary */}
                <Card className="bg-slate-800 border-slate-700 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-400" />
                      🤖 Professional Analysis Summary
                      <Badge variant="outline" className="border-blue-600 text-blue-400 text-xs">
                        AI POWERED
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-3 text-lg">🐂 Bullish Catalysts:</h4>
                      <div className="space-y-2">
                        {data.ai_summary?.bulls?.map((bull, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-green-950/50 rounded-lg border border-green-800/30">
                            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300">{bull}</p>
                          </div>
                        )) || <p className="text-sm text-slate-400">No bullish factors identified</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-red-400 mb-3 text-lg">🐻 Risk Factors:</h4>
                      <div className="space-y-2">
                        {data.ai_summary?.bears?.map((bear, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-red-950/50 rounded-lg border border-red-800/30">
                            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-300">{bear}</p>
                          </div>
                        )) || <p className="text-sm text-slate-400">No significant risks identified</p>}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700 bg-slate-700/30 p-4 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold text-blue-400">🎯 Key Catalyst:</span>
                          </p>
                          <p className="text-sm text-slate-300 mt-1">{data.ai_summary?.catalyst || 'Market sentiment'}</p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-semibold text-blue-400">📈 Outlook:</span>
                          </p>
                          <p className="text-sm text-slate-300 mt-1">{data.ai_summary?.outlook || 'Monitoring developments'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Sidebar */}
              <div className="space-y-6">

                {/* Position Calculator */}
                <PositionCalculator
                  data={data.trading_signals}
                  recommendation={data.recommendation}
                  confidence={data.confidence}
                />

                {/* Performance Tracker */}
                <PerformanceTracker />

                {/* Enhanced Value Proposition */}
                <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-blue-700 text-white">
                  <CardHeader>
                    <CardTitle className="text-blue-200 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      💎 Institutional Intelligence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-blue-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Whale movement tracking</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Corporate adoption signals</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Smart money sentiment analysis</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Viral narrative prediction</span>
                      </div>
                      <div className="flex items-center gap-2 text-blue-300">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">Social arbitrage opportunities</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-900/50 rounded-lg border border-blue-800">
                      <p className="text-xs text-blue-200 font-medium">
                        🏛️ Professional analysis that beats Bloomberg Terminal
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
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-400" />
                📊 Professional Analytics Suite
              </h2>
              <SocialCharts apiData={data} />
            </div>

            {/* Competitive Advantage */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-400" />
                🏆 Market Leadership Analysis
              </h2>
              <CompetitiveEdge />
            </div>
          </div>
        )}

        {/* Enhanced Demo Instructions */}
        {!data && !loading && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                🚀 Try Institutional Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4 text-slate-300">
                <p className="text-lg">Experience professional-grade cryptocurrency analysis</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-blue-600 text-blue-400"
                    onClick={() => setSymbol('btc')}
                  >
                    Bitcoin (btc)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-purple-600 text-purple-400"
                    onClick={() => setSymbol('eth')}
                  >
                    Ethereum (eth)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-green-600 text-green-400"
                    onClick={() => setSymbol('sol')}
                  >
                    Solana (sol)
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700 border-orange-600 text-orange-400"
                    onClick={() => setSymbol('ada')}
                  >
                    Cardano (ada)
                  </Badge>
                </div>
                <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-xs text-slate-400">
                    🏛️ Powered by LunarCrush institutional data & AI analysis
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
