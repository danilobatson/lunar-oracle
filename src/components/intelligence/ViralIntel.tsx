import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, TrendingUp, Users } from 'lucide-react';

interface ViralData {
  trending_story: string;
  influencer_mood: string;
  meme_factor: string;
  community_energy: string;
}

interface ViralIntelProps {
  data: ViralData;
}

export default function ViralIntel({ data }: ViralIntelProps) {
  return (
    <Card className="bg-green-950 border-green-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-200">
          <Zap className="h-5 w-5 text-green-300" />
          🚀 Viral Intelligence
          <Badge variant="secondary" className="bg-green-700 text-green-100 hover:bg-green-600">
            EXCLUSIVE
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-green-300 mb-1">
              Trending Narrative:
            </p>
            <p className="text-sm text-white italic">
              "{data.trending_story || "Analyzing viral content patterns..."}"
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-green-300 mb-1">
              Influencer Consensus:
            </p>
            <p className="text-sm text-white">
              {data.influencer_mood || "Monitoring key opinion leader sentiment..."}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-green-300 mb-1">
              Viral Potential:
            </p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-white">
                {data.meme_factor || "Calculating viral momentum..."}
              </p>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-green-300 mb-1">
              Community Energy:
            </p>
            <p className="text-sm text-white">
              {data.community_energy || "Measuring social engagement levels..."}
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-900 rounded-md border border-green-800">
          <p className="text-xs text-green-200">
            📈 Viral narratives predict retail FOMO - get ahead of the crowd
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
