import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign } from 'lucide-react';

interface PositionData {
  entry_zone: string;
  stop_loss: string;
  target_1: string;
  target_2: string;
  position_size: string;
  timeframe: string;
}

interface PositionCalculatorProps {
  data: PositionData;
  recommendation: string;
  confidence: number;
}

export default function PositionCalculator({ data, recommendation, confidence }: PositionCalculatorProps) {
  const [portfolio, setPortfolio] = useState('10000');

  const calculatePosition = () => {
    const portfolioValue = parseFloat(portfolio) || 0;
    const positionPercent = parseFloat(data.position_size?.replace('%', '')) || 0;
    return (portfolioValue * positionPercent / 100).toLocaleString();
  };

  const riskLevel = confidence > 75 ? 'LOW' : confidence > 50 ? 'MEDIUM' : 'HIGH';
  const riskColor = confidence > 75 ? 'text-green-400' : confidence > 50 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-slate-200">
          <Calculator className="h-5 w-5 text-blue-300" />
          💼 Position Calculator
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Portfolio Value ($)
          </label>
          <Input
            type="number"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
            placeholder="Enter portfolio value"
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Recommendation:</span>
            <Badge
              variant="secondary"
              className={`${
                recommendation === 'BUY' ? 'bg-green-700 text-green-100' :
                recommendation === 'SELL' ? 'bg-red-700 text-red-100' :
                'bg-yellow-700 text-yellow-100'
              }`}
            >
              {recommendation}
            </Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Position Size:</span>
            <span className="text-sm text-white font-bold">
              ${calculatePosition()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Entry Zone:</span>
            <span className="text-sm text-white">{data.entry_zone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Stop Loss:</span>
            <span className="text-sm text-red-400">{data.stop_loss}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Target 1:</span>
            <span className="text-sm text-green-400">{data.target_1}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Risk Level:</span>
            <span className={`text-sm font-bold ${riskColor}`}>{riskLevel}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-700 rounded-md border border-slate-600">
          <p className="text-xs text-slate-300">
            {confidence > 75
              ? 'High confidence signal - consider larger position'
              : confidence > 50
              ? 'Moderate position recommended - high confidence signal'
              : 'Conservative position recommended - lower confidence'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
