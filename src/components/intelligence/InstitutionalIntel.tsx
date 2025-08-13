import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, TrendingUp, AlertCircle } from 'lucide-react';

interface InstitutionalData {
  whale_moves: string;
  corporate_news: string;
  smart_money: string;
  etf_activity: string;
}

interface InstitutionalIntelProps {
  data: InstitutionalData;
}

export default function InstitutionalIntel({ data }: InstitutionalIntelProps) {
  return (
    <Card className="bg-purple-950 border-purple-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-200">
          <Building className="h-5 w-5 text-purple-300" />
          🏛️ Institutional Intelligence
          <Badge variant="secondary" className="bg-purple-700 text-purple-100 hover:bg-purple-600">
            PREMIUM
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-purple-300 mb-1">
              Whale Moves (24h):
            </p>
            <p className="text-sm text-white">
              {data.whale_moves || "Analyzing large institutional transactions..."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-purple-300 mb-1">
              Corporate Adoption:
            </p>
            <p className="text-sm text-white">
              {data.corporate_news || "Monitoring corporate treasury movements..."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-purple-300 mb-1">
              Smart Money Signals:
            </p>
            <p className="text-sm text-white">
              {data.smart_money || "Tracking institutional sentiment indicators..."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-purple-300 mb-1">
              ETF Activity:
            </p>
            <p className="text-sm text-white">
              {data.etf_activity || "Monitoring ETF flows and institutional adoption..."}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-900 rounded-md border border-purple-800">
          <p className="text-xs text-purple-200">
            💡 This institutional flow data costs $1000s elsewhere - exclusive to LunarOracle
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
