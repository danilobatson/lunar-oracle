import LunarCrush from 'lunarcrush-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for our enhanced service - based on actual SDK types
export interface SocialMetrics {
  galaxy_score: number;
  alt_rank: number;
  social_volume_24h: number;
  interactions_24h: number;
  sentiment: number;
  social_dominance: number;
  market_cap?: number;
  price?: number;
  volume_24h?: number;
  percent_change_24h?: number;
}

export interface PredictionData {
  symbol: string;
  current_price: number;
  social_metrics: SocialMetrics;
  ai_prediction: {
    price_target_24h: number;
    price_target_7d: number;
    confidence_score: number;
    risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
    reasoning: string;
    position_size_recommendation: number; // percentage of portfolio
  };
  timestamp: string;
}

export interface CryptoSearchResult {
  symbol: string;
  name: string;
  current_price?: number;
  market_cap?: number;
  galaxy_score?: number;
}

class LunarCrushEnhancedService {
  private lunarcrush: LunarCrush;
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Initialize LunarCrush SDK - correct way from documentation
    const apiKey = process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY;
    if (!apiKey) {
      throw new Error('LunarCrush API key not found. Please add NEXT_PUBLIC_LUNARCRUSH_API_KEY to your environment.');
    }
    this.lunarcrush = new LunarCrush(apiKey);

    // Initialize Gemini AI
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error('Gemini API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment.');
    }
    this.genAI = new GoogleGenerativeAI(geminiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  /**
   * Search for cryptocurrencies by symbol or name using coins.list()
   */
  async searchCryptocurrencies(query: string): Promise<CryptoSearchResult[]> {
    try {
      console.log(`🔍 Searching for cryptocurrencies: ${query}`);

      // Get cryptocurrency list from LunarCrush using correct SDK method
      const coinsList = await this.lunarcrush.coins.list();

      if (!coinsList || !Array.isArray(coinsList)) {
        return [];
      }

      // Filter results based on query
      const filtered = coinsList.filter((crypto: any) =>
        crypto.symbol?.toLowerCase().includes(query.toLowerCase()) ||
        crypto.name?.toLowerCase().includes(query.toLowerCase())
      );

      return filtered.slice(0, 10).map((crypto: any) => ({
        symbol: crypto.symbol || '',
        name: crypto.name || '',
        current_price: crypto.price || undefined,
        market_cap: crypto.market_cap || undefined,
        galaxy_score: crypto.galaxy_score || undefined
      }));
    } catch (error) {
      console.error('Error searching cryptocurrencies:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to search cryptocurrencies: ${errorMessage}`);
    }
  }

  /**
   * Get comprehensive analysis for a specific cryptocurrency
   * Uses coins.list() to get social data instead of coins.get()
   */
  async getCryptoAnalysis(symbol: string): Promise<PredictionData> {
    try {
      console.log(`📊 Getting analysis for ${symbol}`);

      // Get coin data from LunarCrush using coins.list() to get social data
      const coinsList = await this.lunarcrush.coins.list();

      if (!coinsList || !Array.isArray(coinsList)) {
        throw new Error(`Failed to fetch coins list`);
      }

      // Find the specific coin in the list
      const coinData = coinsList.find((coin: any) =>
        coin.symbol?.toLowerCase() === symbol.toLowerCase()
      );

      if (!coinData) {
        throw new Error(`No data found for ${symbol}`);
      }

      // Extract social metrics with proper null/undefined handling
      const socialMetrics: SocialMetrics = {
        galaxy_score: coinData.galaxy_score ?? 0,
        alt_rank: coinData.alt_rank ?? 999,
        social_volume_24h: coinData.social_volume_24h ?? 0,
        interactions_24h: coinData.interactions_24h ?? 0,
        sentiment: coinData.sentiment ?? 0,
        social_dominance: coinData.social_dominance ?? 0,
        market_cap: coinData.market_cap ?? undefined,
        price: coinData.price ?? undefined,
        volume_24h: coinData.volume_24h ?? undefined,
        percent_change_24h: coinData.percent_change_24h ?? undefined
      };

      // Generate AI prediction
      const aiPrediction = await this.generateAIPrediction(symbol, socialMetrics);

      return {
        symbol: symbol.toUpperCase(),
        current_price: coinData.price ?? 0,
        social_metrics: socialMetrics,
        ai_prediction: aiPrediction,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error getting analysis for ${symbol}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to analyze ${symbol}: ${errorMessage}`);
    }
  }

  /**
   * Generate AI prediction using Gemini
   */
  private async generateAIPrediction(symbol: string, metrics: SocialMetrics): Promise<any> {
    try {
      const currentPrice = metrics.price ?? 0;

      const prompt = `
As a crypto analyst, analyze ${symbol} with these metrics:
- Galaxy Score: ${metrics.galaxy_score}/100 (social intelligence score)
- AltRank: ${metrics.alt_rank} (lower is better)
- Social Volume 24h: ${metrics.social_volume_24h}
- Interactions 24h: ${metrics.interactions_24h}
- Sentiment: ${metrics.sentiment}/5
- Social Dominance: ${metrics.social_dominance}%
- Current Price: $${currentPrice}
- 24h Change: ${metrics.percent_change_24h}%
- Market Cap: $${metrics.market_cap}

Provide a JSON response with:
{
  "price_target_24h": <number>,
  "price_target_7d": <number>,
  "confidence_score": <0-100>,
  "risk_level": "<LOW|MEDIUM|HIGH>",
  "reasoning": "<concise analysis>",
  "position_size_recommendation": <1-10 percentage>
}

Base predictions on social sentiment trends and technical indicators.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse JSON from AI response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('AI response not in expected format');
      }

      const prediction = JSON.parse(jsonMatch[0]);

      // Validate and sanitize prediction with safe price handling
      const fallbackPrice24h = currentPrice > 0 ? currentPrice * 1.02 : 0;
      const fallbackPrice7d = currentPrice > 0 ? currentPrice * 1.05 : 0;

      return {
        price_target_24h: Number(prediction.price_target_24h) || fallbackPrice24h,
        price_target_7d: Number(prediction.price_target_7d) || fallbackPrice7d,
        confidence_score: Math.min(100, Math.max(0, Number(prediction.confidence_score) || 65)),
        risk_level: ['LOW', 'MEDIUM', 'HIGH'].includes(prediction.risk_level) ? prediction.risk_level : 'MEDIUM',
        reasoning: prediction.reasoning || 'Analysis based on social sentiment and market data',
        position_size_recommendation: Math.min(10, Math.max(1, Number(prediction.position_size_recommendation) || 5))
      };
    } catch (error) {
      console.error('Error generating AI prediction:', error);

      // Fallback prediction based on metrics with safe price handling
      const currentPrice = metrics.price ?? 0;
      const confidence = Math.min(90, metrics.galaxy_score || 50);
      const risk = metrics.galaxy_score > 70 ? 'LOW' : metrics.galaxy_score > 40 ? 'MEDIUM' : 'HIGH';

      const fallbackPrice24h = currentPrice > 0 ? currentPrice * (1 + (confidence - 50) / 1000) : 0;
      const fallbackPrice7d = currentPrice > 0 ? currentPrice * (1 + (confidence - 50) / 500) : 0;

      return {
        price_target_24h: fallbackPrice24h,
        price_target_7d: fallbackPrice7d,
        confidence_score: confidence,
        risk_level: risk,
        reasoning: `Analysis based on Galaxy Score of ${metrics.galaxy_score} and social sentiment data`,
        position_size_recommendation: risk === 'LOW' ? 7 : risk === 'MEDIUM' ? 5 : 3
      };
    }
  }

  /**
   * Get popular cryptocurrencies for quick access
   */
  async getPopularCryptos(): Promise<CryptoSearchResult[]> {
    try {
      // Get top cryptocurrencies using correct SDK method
      const coinsList = await this.lunarcrush.coins.list();

      if (!coinsList || !Array.isArray(coinsList)) {
        return this.getFallbackCryptos();
      }

      return coinsList.slice(0, 12).map((crypto: any) => ({
        symbol: crypto.symbol || '',
        name: crypto.name || '',
        current_price: crypto.price ?? undefined,
        market_cap: crypto.market_cap ?? undefined,
        galaxy_score: crypto.galaxy_score ?? undefined
      }));
    } catch (error) {
      console.error('Error getting popular cryptos:', error);
      return this.getFallbackCryptos();
    }
  }

  /**
   * Fallback popular cryptocurrencies
   */
  private getFallbackCryptos(): CryptoSearchResult[] {
    return [
      { symbol: 'BTC', name: 'Bitcoin' },
      { symbol: 'ETH', name: 'Ethereum' },
      { symbol: 'SOL', name: 'Solana' },
      { symbol: 'ADA', name: 'Cardano' },
      { symbol: 'DOT', name: 'Polkadot' },
      { symbol: 'MATIC', name: 'Polygon' }
    ];
  }
}

// Export singleton instance
export const lunarCrushEnhanced = new LunarCrushEnhancedService();

// Export service class for testing
export { LunarCrushEnhancedService };
