'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Activity, Building, Zap, CheckCircle, Star, ArrowRight } from 'lucide-react';

interface MarketingLandingProps {
  onStartAnalysis: () => void;
}

export default function MarketingLanding({ onStartAnalysis }: MarketingLandingProps) {
  return (
    <div className="w-full max-w-7xl mx-auto">

      {/* Hero Section - Full Width */}
      <div className="text-center mb-12 px-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-400" />
          <Badge variant="secondary" className="bg-blue-900 text-blue-200 px-4 py-2 text-lg">
            CRYPTO MARKET CHEAT SHEET
          </Badge>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent mb-6">
          🌙 LunarOracle
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
          Get AI-powered buy/sell recommendations based on social media intelligence that moves crypto prices
        </p>

        <div className="flex items-center justify-center gap-6 text-lg text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            <span>Analyzing 100M+ social posts daily</span>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-purple-400" />
            <span>Tracking whale movements</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span>Predicting viral trends</span>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={onStartAnalysis}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-xl font-bold"
        >
          <TrendingUp className="h-6 w-6 mr-3" />
          Get My Free Analysis
          <ArrowRight className="h-6 w-6 ml-3" />
        </Button>
      </div>

      {/* What You Get Section - Full Width Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16 px-4">
        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <TrendingUp className="h-6 w-6" />
              Clear Buy/Sell Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Get a clear BUY, SELL, or HOLD recommendation with confidence percentage for any cryptocurrency.
            </p>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-green-400 font-bold">Example: BTC - BUY (85% confidence)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <Building className="h-6 w-6" />
              Whale Movement Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              See when big money (institutions, whales) are buying or selling before price moves.
            </p>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-purple-400 font-bold">MicroStrategy's Bitcoin buy detected</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Zap className="h-6 w-6" />
              Viral Trend Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">
              Know which cryptos will trend on social media before they pump in price.
            </p>
            <div className="bg-slate-700/50 p-3 rounded-lg">
              <p className="text-green-400 font-bold">HIGH viral potential detected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How We Compare - Full Width */}
      <div className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          🏆 How We Compare to Other Crypto Analysis Tools
        </h2>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-6 bg-slate-750">
            <div className="font-bold text-white">Features</div>
            <div className="font-bold text-blue-400 text-center">LunarOracle</div>
            <div className="font-bold text-slate-400 text-center">CryptoQuant</div>
            <div className="font-bold text-slate-400 text-center">Santiment</div>
            <div className="font-bold text-slate-400 text-center">IntoTheBlock</div>
          </div>

          <div className="space-y-4 p-6">
            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-700">
              <div className="text-slate-300">Monthly Price</div>
              <div className="text-center text-green-400 font-bold">$79</div>
              <div className="text-center text-slate-400">$149</div>
              <div className="text-center text-slate-400">$199</div>
              <div className="text-center text-slate-400">$299</div>
            </div>

            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-700">
              <div className="text-slate-300">Prediction Accuracy</div>
              <div className="text-center text-green-400 font-bold">78%</div>
              <div className="text-center text-slate-400">67%</div>
              <div className="text-center text-slate-400">61%</div>
              <div className="text-center text-slate-400">58%</div>
            </div>

            <div className="grid grid-cols-5 gap-4 py-3 border-b border-slate-700">
              <div className="text-slate-300">Real-time Whale Tracking</div>
              <div className="text-center"><CheckCircle className="h-5 w-5 text-green-400 mx-auto" /></div>
              <div className="text-center"><CheckCircle className="h-5 w-5 text-yellow-400 mx-auto" /></div>
              <div className="text-center"><span className="text-red-400">❌</span></div>
              <div className="text-center"><span className="text-red-400">❌</span></div>
            </div>

            <div className="grid grid-cols-5 gap-4 py-3">
              <div className="text-slate-300">Viral Trend Prediction</div>
              <div className="text-center"><CheckCircle className="h-5 w-5 text-green-400 mx-auto" /></div>
              <div className="text-center"><span className="text-red-400">❌</span></div>
              <div className="text-center"><span className="text-red-400">❌</span></div>
              <div className="text-center"><span className="text-red-400">❌</span></div>
            </div>
          </div>

          <div className="bg-green-900/50 p-4 text-center border-t border-green-800">
            <p className="text-green-200 font-bold">
              💎 You Save 47-73% vs Competitors
            </p>
            <p className="text-green-300 text-sm">
              Get better accuracy and more features for half the price
            </p>
          </div>
        </div>
      </div>

      {/* Track Record - Full Width */}
      <div className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          📊 Our Track Record Speaks for Itself
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-green-900 border-green-700 text-center">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-green-400 mb-2">78%</div>
              <div className="text-green-200 font-medium">Prediction Accuracy</div>
              <div className="text-green-300 text-sm mt-2">Industry average: 58%</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900 border-blue-700 text-center">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-blue-400 mb-2">+127%</div>
              <div className="text-blue-200 font-medium">Average Monthly ROI</div>
              <div className="text-blue-300 text-sm mt-2">Following our signals</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-900 border-purple-700 text-center">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-purple-400 mb-2">24-48h</div>
              <div className="text-purple-200 font-medium">Early Signal Advantage</div>
              <div className="text-purple-300 text-sm mt-2">Ahead of the crowd</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Testimonials - Full Width */}
      <div className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          ⭐ What Crypto Traders Are Saying
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">@CryptoTrader_Mike</span>
              </div>
              <p className="text-slate-300 italic">
                "LunarOracle caught Solana going x3 before it happened. Their whale alerts are insane - saved me from buying at the top."
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-slate-400 text-sm">@DefiQueen</span>
              </div>
              <p className="text-slate-300 italic">
                "Finally, a tool that actually works. Real-time whale tracking and their viral predictions beat everything else out there."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works - Full Width */}
      <div className="mb-16 px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          ⚡ How LunarOracle Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-2">1. Data Collection</h3>
            <p className="text-slate-400 text-sm">
              We analyze millions of social posts, whale movements, and corporate adoption signals in real-time
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="font-bold text-white mb-2">2. Whale Tracking</h3>
            <p className="text-slate-400 text-sm">
              Track institutional activity and corporate adoption signals before they move the market
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="font-bold text-white mb-2">3. AI Analysis</h3>
            <p className="text-slate-400 text-sm">
              Our AI processes sentiment, viral potential, and market catalysts to generate predictions
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="font-bold text-white mb-2">4. Clear Signals</h3>
            <p className="text-slate-400 text-sm">
              Get actionable BUY/SELL recommendations with confidence scores and position sizing
            </p>
          </div>
        </div>
      </div>

      {/* Final CTA - Full Width */}
      <div className="text-center bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-8 mx-4">
        <h2 className="text-3xl font-bold text-white mb-4">
          🚀 Ready to Get Your Crypto Cheat Sheet?
        </h2>
        <p className="text-slate-300 text-lg mb-6">
          Join thousands of traders who use LunarOracle to make smarter crypto investments
        </p>
        <Button
          onClick={onStartAnalysis}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-bold"
        >
          <TrendingUp className="h-6 w-6 mr-3" />
          Start My Free Analysis Now
          <ArrowRight className="h-6 w-6 ml-3" />
        </Button>
        <p className="text-slate-400 text-sm mt-4">
          No credit card required • Get results in 30 seconds
        </p>
      </div>
    </div>
  );
}
