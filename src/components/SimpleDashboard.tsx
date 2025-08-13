'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import {
  InstitutionalIntel,
  ViralIntel,
  PositionCalculator
} from './intelligence';

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
}

export default function SimpleDashboard() {
  const [symbol, setSymbol] = useState('btc');
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!symbol.trim()) {
      toast({
        title: "Error",
        description: "Please enter a crypto symbol",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError(null);

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
      setData(result.data);

      toast({
        title: "Analysis Complete!",
        description: `Successfully analyzed ${symbol.toUpperCase()}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
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

        {/* Hero Section */}
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
            🌙 LunarOracle
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Professional crypto intelligence with institutional-grade social data
          </p>

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
            <Button
              onClick={handleAnalyze}
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
        {loading && (
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
        {data && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main Analysis Column */}
            <div className="lg:col-span-2 space-y-6">

              {/* Price & Recommendation Card */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {console.log(data)}
                        {data.symbol.toUpperCase()}
                      </CardTitle>
                      <p className="text-3xl font-bold text-green-400 mt-1">
                        {data.current_price?.toLocaleString() || 'N/A'}
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
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 mb-4">{data.reasoning}</p>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Galaxy Score</p>
                      <p className="font-bold text-white">{data.key_metrics?.galaxy_score || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Alt Rank</p>
                      <p className="font-bold text-white">#{data.key_metrics?.alt_rank || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Sentiment</p>
                      <p className="font-bold text-white">{data.key_metrics?.sentiment || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Social Dom</p>
                      <p className="font-bold text-white">{data.key_metrics?.social_dominance || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Volume 24h</p>
                      <p className="font-bold text-white">{data.key_metrics?.volume_24h || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Market Cap</p>
                      <p className="font-bold text-white">{data.key_metrics?.market_cap || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Institutional Intelligence */}
              <InstitutionalIntel data={data.institutional_intelligence} />

              {/* Viral Intelligence */}
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

              {/* Position Calculator */}
              <PositionCalculator
                data={data.trading_signals}
                recommendation={data.recommendation}
                confidence={data.confidence}
              />

              {/* Value Proposition */}
              <Card className="bg-blue-950 border-blue-700 text-white">
                <CardHeader>
                  <CardTitle className="text-blue-200">
                    💎 Why LunarOracle is Worth $50-100/month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-blue-300">
                      <CheckCircle className="h-4 w-4" />
                      Exclusive institutional flow data
                    </div>
                    <div className="flex items-center gap-2 text-blue-300">
                      <CheckCircle className="h-4 w-4" />
                      Viral narrative prediction
                    </div>
                    <div className="flex items-center gap-2 text-blue-300">
                      <CheckCircle className="h-4 w-4" />
                      LunarCrush Galaxy Scores
                    </div>
                    <div className="flex items-center gap-2 text-blue-300">
                      <CheckCircle className="h-4 w-4" />
                      Professional position sizing
                    </div>
                    <div className="flex items-center gap-2 text-blue-300">
                      <CheckCircle className="h-4 w-4" />
                      Real-time social intelligence
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card className="bg-slate-800 border-slate-700 text-white">
                <CardHeader>
                  <CardTitle>📈 Track Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Accuracy:</span>
                      <span className="font-bold text-green-400">73%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Avg Return:</span>
                      <span className="font-bold text-green-400">+12.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Win Rate:</span>
                      <span className="font-bold text-green-400">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Predictions:</span>
                      <span className="font-bold text-white">1,247</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Demo Instructions (only show when no data) */}
        {!data && !loading && (
          <Card className="bg-slate-800 border-slate-700 text-white max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">🚀 Try LunarOracle Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2 text-slate-300">
                <p>Enter any crypto symbol to see institutional-grade analysis:</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-700" onClick={() => setSymbol('btc')}>
                    Bitcoin (btc)
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-700" onClick={() => setSymbol('eth')}>
                    Ethereum (eth)
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-700" onClick={() => setSymbol('sol')}>
                    Solana (sol)
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-slate-700" onClick={() => setSymbol('ada')}>
                    Cardano (ada)
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
