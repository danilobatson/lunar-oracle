'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Search, TrendingUp, AlertCircle, Zap, Activity, Shield } from 'lucide-react';

// NEXUS Components
import QuantumOwlLogo from './nexus/QuantumOwlLogo';
import MysticalLoading from './nexus/MysticalLoading';
import QuantumAlert from './nexus/QuantumAlert';
import QuantumBadge from './nexus/QuantumBadge';

// Zustand Store
import useNexusStore from '@/stores/nexus-store';

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
  ai_summary: {
    bulls: string[];
    bears: string[];
    catalyst: string;
    outlook: string;
  };
}

export default function SimpleDashboard() {
  // Zustand state
  const {
    current_analysis,
    loading,
    error,
    setAnalysis,
    setLoading,
    setError,
    updateLastUpdate
  } = useNexusStore();

  // Local state
  const [symbol, setSymbol] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!symbol.trim()) {
      toast({
        title: '🦉 The Owl requires a symbol',
        description: 'Try BTC, ETH, SOL, or any crypto ticker',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symbol.toLowerCase() }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      setAnalysis({
        ...result,
        timestamp: Date.now()
      });
      updateLastUpdate();
      setShowResults(true);

      toast({
        title: '🎯 Quantum Oracle Activated!',
        description: `The Owl has revealed the secrets of ${symbol.toUpperCase()}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setError(errorMessage);
      toast({
        title: 'The quantum void resists...',
        description: 'Please try again or try a different symbol',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-void-black">
      <div className="w-full px-6 py-6">
        {!showResults ? (
          // Landing Page
          <div className="w-full max-w-4xl mx-auto text-center space-y-8">
            <div className="mystical-float">
              <QuantumOwlLogo size="xl" animate showText />
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold quantum-text">
                NEXUS
              </h1>
              <p className="text-xl md:text-2xl text-ghost-text max-w-2xl mx-auto">
                The Quantum Owl sees beyond the veil of traditional analysis
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-ghost-text flex-wrap">
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-emerald-profit" />
                  <span>Multi-platform intelligence</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-cosmic-blue" />
                  <span>Predictive social signals</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-amber-glow" />
                  <span>Institutional tracking</span>
                </div>
              </div>
            </div>

            <Card className="quantum-card max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="text-center text-silver-text">
                  🔮 Summon the Oracle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="text"
                    placeholder="Enter crypto symbol (BTC, ETH, SOL...)"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="bg-shadow-gray border-mist-gray text-silver-text placeholder:text-ghost-text"
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="quantum-button min-w-[120px]"
                  >
                    {loading ? (
                      <MysticalLoading message="" size="sm" />
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Reveal
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {['BTC', 'ETH', 'SOL', 'ADA'].map((ticker) => (
                    <Badge
                      key={ticker}
                      variant="outline"
                      className="cursor-pointer hover:bg-quantum-purple/20 border-quantum-purple/30 text-quantum-purple"
                      onClick={() => setSymbol(ticker.toLowerCase())}
                    >
                      Try {ticker}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Results Page
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <QuantumOwlLogo size="lg" showText />
              <Button
                variant="ghost"
                onClick={() => setShowResults(false)}
                className="text-ghost-text hover:text-silver-text"
              >
                ← Back to Oracle
              </Button>
            </div>

            {/* Error State */}
            {error && (
              <QuantumAlert
                type="error"
                title="Quantum Disruption Detected"
                description={error}
                onClose={() => setError(null)}
              />
            )}

            {/* Loading State */}
            {loading && !current_analysis && (
              <Card className="quantum-card">
                <CardContent>
                  <MysticalLoading message="The Owl peers through dimensions..." />
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            {current_analysis && (
              <div className="space-y-6">
                {/* Main Recommendation */}
                <Card className="quantum-card mystical-glow">
                  <CardHeader>
                    <div className="text-center space-y-4">
                      <CardTitle className="text-3xl quantum-text">
                        🦉 Oracle Vision: {current_analysis.symbol.toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center justify-center gap-4">
                        <p className="text-2xl font-bold text-silver-text">
                          ${current_analysis.current_price?.toLocaleString() || 'N/A'}
                        </p>
                        <QuantumBadge
                          variant="recommendation"
                          value={current_analysis.recommendation}
                          glow
                          size="lg"
                        />
                        <QuantumBadge
                          variant="confidence"
                          value=""
                          confidence={current_analysis.confidence}
                          size="md"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="quantum-card bg-shadow-gray/50 p-6 rounded-lg">
                      <h3 className="font-bold text-cosmic-blue mb-3 text-xl">
                        🔮 The Owl's Wisdom:
                      </h3>
                      <p className="text-silver-text leading-relaxed">
                        {current_analysis.reasoning}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card className="quantum-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-silver-text">
                      <TrendingUp className="h-5 w-5 text-cosmic-blue" />
                      🌟 Quantum Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(current_analysis.key_metrics || {}).map(([key, value]) => (
                        <div key={key} className="quantum-card bg-shadow-gray/30 p-4 rounded-lg text-center">
                          <p className="text-ghost-text text-sm capitalize mb-1">
                            {key.replace('_', ' ')}
                          </p>
                          <p className="font-bold text-silver-text">{value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Summary */}
                <Card className="quantum-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-silver-text">
                      <AlertCircle className="h-5 w-5 text-amber-glow" />
                      🧠 Quantum Intelligence Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {current_analysis.ai_summary?.bulls && (
                      <div>
                        <h4 className="font-semibold text-emerald-profit mb-3">
                          🐂 Bullish Signals:
                        </h4>
                        <div className="space-y-2">
                          {current_analysis.ai_summary.bulls.map((bull, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-emerald-950/30 rounded-lg border border-emerald-800/30">
                              <span className="text-emerald-profit">•</span>
                              <p className="text-silver-text text-sm">{bull}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {current_analysis.ai_summary?.bears && (
                      <div>
                        <h4 className="font-semibold text-ruby-danger mb-3">
                          🐻 Risk Factors:
                        </h4>
                        <div className="space-y-2">
                          {current_analysis.ai_summary.bears.map((bear, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-red-950/30 rounded-lg border border-red-800/30">
                              <span className="text-ruby-danger">•</span>
                              <p className="text-silver-text text-sm">{bear}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {current_analysis.ai_summary?.catalyst && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="quantum-card bg-cosmic-blue/10 p-4 rounded-lg border border-cosmic-blue/30">
                          <h4 className="font-semibold text-cosmic-blue mb-2">🎯 Key Catalyst:</h4>
                          <p className="text-silver-text text-sm">{current_analysis.ai_summary.catalyst}</p>
                        </div>
                        {current_analysis.ai_summary?.outlook && (
                          <div className="quantum-card bg-quantum-purple/10 p-4 rounded-lg border border-quantum-purple/30">
                            <h4 className="font-semibold text-quantum-purple mb-2">🔮 Outlook:</h4>
                            <p className="text-silver-text text-sm">{current_analysis.ai_summary.outlook}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
