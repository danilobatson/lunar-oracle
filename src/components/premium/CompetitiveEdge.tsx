'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Shield, Zap, Target } from 'lucide-react';

interface Competitor {
  name: string;
  accuracy: number;
  sources: number;
  coverage: string;
  price: string;
  features: string[];
}

const competitors: Competitor[] = [
  {
    name: 'LunarOracle',
    accuracy: 78,
    sources: 5,
    coverage: 'Real-time social + institutional',
    price: '$79/mo',
    features: ['whale-tracking', 'viral-prediction', 'institutional-intel', 'social-arbitrage', 'mcp-integration']
  },
  {
    name: 'CryptoQuant',
    accuracy: 67,
    sources: 3,
    coverage: 'On-chain data only',
    price: '$149/mo',
    features: ['whale-tracking', 'institutional-intel']
  },
  {
    name: 'Santiment',
    accuracy: 61,
    sources: 2,
    coverage: 'Basic social sentiment',
    price: '$199/mo',
    features: ['whale-tracking']
  },
  {
    name: 'IntoTheBlock',
    accuracy: 58,
    sources: 2,
    coverage: 'Technical + basic social',
    price: '$299/mo',
    features: ['whale-tracking']
  }
];

const advantages = [
  { feature: 'Real-time Whale Tracking', us: true, others: false },
  { feature: 'Viral Narrative Prediction', us: true, others: false },
  { feature: 'Institutional Intelligence', us: true, others: true },
  { feature: 'Social Arbitrage Detection', us: true, others: false },
  { feature: 'LunarCrush Galaxy Scores', us: true, others: false },
  { feature: 'MCP AI Integration', us: true, others: false },
  { feature: 'Corporate Adoption Tracking', us: true, others: false },
  { feature: 'ETF Flow Analysis', us: true, others: false },
  { feature: 'Smart Money Signals', us: true, others: false },
  { feature: 'Position Sizing Calculator', us: true, others: false }
];

export default function CompetitiveEdge() {
  return (
    <div className="space-y-6">

      {/* Competitor Comparison */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            🏆 Market Position Analysis
            <Badge variant="secondary" className="bg-blue-700 text-blue-100">
              COMPETITIVE INTEL
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitors.map((comp, index) => (
              <div key={comp.name} className={`p-4 rounded-lg border ${
                comp.name === 'LunarOracle'
                  ? 'bg-gradient-to-r from-blue-950 to-purple-950 border-blue-600'
                  : 'bg-slate-700/50 border-slate-600'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      {comp.name}
                      {comp.name === 'LunarOracle' && (
                        <Badge variant="secondary" className="bg-green-700 text-green-100">
                          LEADER
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-slate-400">{comp.coverage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{comp.price}</p>
                    <p className="text-xs text-slate-400">{comp.sources} data sources</p>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-400">Prediction Accuracy</span>
                    <span className="text-sm font-bold">{comp.accuracy}%</span>
                  </div>
                  <Progress
                    value={comp.accuracy}
                    className="h-2"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {advantages.slice(0, 3).map((adv) => (
                    <div key={adv.feature} className="flex items-center gap-1">
                      {comp.features.includes(adv.feature.toLowerCase().replace(/\s+/g, '-')) ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-400" />
                      )}
                      <span className="text-xs text-slate-400">{adv.feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card className="bg-slate-800 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            🎯 Exclusive Features Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 text-slate-300">Feature</th>
                  <th className="text-center py-3 text-blue-400 font-bold">LunarOracle</th>
                  <th className="text-center py-3 text-slate-400">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {advantages.map((adv, index) => (
                  <tr key={index} className="border-b border-slate-700/50">
                    <td className="py-3 text-slate-300">{adv.feature}</td>
                    <td className="text-center py-3">
                      {adv.us ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                    <td className="text-center py-3">
                      {adv.others ? (
                        <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-950 to-purple-950 rounded-lg border border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <h4 className="font-bold text-blue-200">🚀 The LunarOracle Advantage</h4>
            </div>
            <p className="text-sm text-blue-300 mb-3">
              We're the only platform with exclusive access to LunarCrush's institutional-grade social intelligence API.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">5 exclusive data sources</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">78% prediction accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">50% cheaper than competitors</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
