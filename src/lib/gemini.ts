// Gemini service with inline types (no import issues)

export interface CryptoData {
  symbol: string;
  name: string;
  galaxy_score: number;
  close: number;
  market_cap: number;
  percent_change_24h: number;
  alt_rank: number;
  interactions?: number;
  sentiment?: number;
}

export interface GeminiAnalysisResult {
  viralProbability: number;
  confidenceScore: number;
  viralCategory: string;
  expectedEngagement: number | null;
  psychologyScore: {
    emotional_appeal: number;
    shareability: number;
    practicalValue: number;
    story: number;
  };
  recommendations: string[];
  optimizedHashtags: string[];
  optimalTiming: {
    best_day: string;
    best_hour: string;
    timezone: string;
  };
}

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeContent(content: string, cryptoData?: CryptoData): Promise<GeminiAnalysisResult> {
    try {
      console.log('🤖 Gemini: Analyzing content...');

      // Mock analysis for now
      const analysis: GeminiAnalysisResult = {
        viralProbability: 75,
        confidenceScore: 85,
        viralCategory: 'High',
        expectedEngagement: cryptoData ? Math.floor(cryptoData.interactions || 1000) : null,
        psychologyScore: {
          emotional_appeal: 80,
          shareability: 75,
          practicalValue: 70,
          story: 65
        },
        recommendations: [
          'Add more emotional appeal',
          'Include trending hashtags',
          'Post during peak hours'
        ],
        optimizedHashtags: ['#crypto', '#bitcoin', '#viral'],
        optimalTiming: {
          best_day: 'Tuesday',
          best_hour: '14',
          timezone: 'UTC'
        }
      };

      console.log('✅ Gemini: Analysis complete');
      return analysis;

    } catch (error) {
      console.error('❌ Gemini analysis failed:', error);
      throw new Error('Gemini analysis failed');
    }
  }
}

export const geminiService = new GeminiService(process.env.GOOGLE_GEMINI_API_KEY || '');
