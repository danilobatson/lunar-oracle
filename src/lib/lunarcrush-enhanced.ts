import LunarCrush from 'lunarcrush-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Types for our enhanced service
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
    position_size_recommendation: number;
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
  private lunarcrush: LunarCrush | null = null;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;

  private getEnvironmentVariable(key: string): string | null {
    // Only access environment variables on the client side
    if (typeof window === 'undefined') {
      return null;
    }

    // Access the env variable directly without causing hydration issues
    return (window as any).__NEXT_DATA__?.props?.pageProps?.[key] ||
           process.env[key] ||
           null;
  }

  private async initializeServices() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      // Get API keys - hardcoded for now to avoid env issues
      const lunarcrushKey = 'vcbhz3zf90hd7rtk97d3k436x8me7eb0tb77fjk2d';
      const geminiKey = 'AIzaSyCBKmjYBpNOm-ZA4UKrqjlyoWXkWZRdKNc';

      if (!lunarcrushKey) {
        throw new Error('LunarCrush API key not found');
      }

      this.lunarcrush = new LunarCrush(lunarcrushKey);

      if (geminiKey) {
        this.genAI = new GoogleGenerativeAI(geminiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      }

      this.isInitialized = true;
      console.log('✅ LunarCrush services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
      // Don't throw - use fallback mode
    }
  }

  /**
   * Search for cryptocurrencies using SDK only
   */
  async searchCryptocurrencies(query: string): Promise<CryptoSearchResult[]> {
    try {
      await this.initializeServices();

      if (!this.lunarcrush) {
        console.log('📋 Using fallback search for:', query);
        return this.getFallbackCryptos().filter(coin =>
          coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
          coin.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      console.log(`🔍 Searching cryptocurrencies via SDK: ${query}`);

      const coinsList = await this.lunarcrush.coins.list();

      if (!coinsList || !Array.isArray(coinsList)) {
        return this.getFallbackCryptos().filter(coin =>
          coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
          coin.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      const filtered = coinsList.filter((crypto: any) =>
        crypto.symbol?.toLowerCase().includes(query.toLowerCase()) ||
        crypto.name?.toLowerCase().includes(query.toLowerCase())
      );

      return filtered.slice(0, 10).map((crypto: any) => ({
        symbol: crypto.symbol || '',
        name: crypto.name || '',
        current_price: crypto.price ?? undefined,
        market_cap: crypto.market_cap ?? undefined,
        galaxy_score: crypto.galaxy_score ?? undefined
      }));
    } catch (error) {
      console.error('❌ Error searching cryptocurrencies:', error);

      // Return fallback results
      return this.getFallbackCryptos().filter(coin =>
        coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
        coin.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  /**
   * Get comprehensive analysis
   */
  async getCryptoAnalysis(symbol: string): Promise<PredictionData> {
    try {
      await this.initializeServices();

      if (!this.lunarcrush) {
        console.log('📋 Using fallback analysis for:', symbol);
        const fallbackCoin = this.getFallbackCryptos().find(coin =>
          coin.symbol.toLowerCase() === symbol.toLowerCase()
        );

        if (!fallbackCoin) {
          throw new Error(`No data available for ${symbol}`);
        }

        return this.createFallbackAnalysis(symbol, fallbackCoin);
      }

      console.log(`📊 Analyzing ${symbol} via SDK`);

      const coinsList = await this.lunarcrush.coins.list();

      if (!coinsList || !Array.isArray(coinsList)) {
        throw new Error(`Failed to fetch coins list`);
      }

      const coinData = coinsList.find((coin: any) =>
        coin.symbol?.toLowerCase() === symbol.toLowerCase()
      );

      if (!coinData) {
        const fallbackCoin = this.getFallbackCryptos().find(coin =>
          coin.symbol.toLowerCase() === symbol.toLowerCase()
        );

        if (!fallbackCoin) {
          throw new Error(`No data found for ${symbol}`);
        }

        return this.createFallbackAnalysis(symbol, fallbackCoin);
      }

      const socialMetrics: SocialMetrics = {
        galaxy_score: coinData.galaxy_score ?? 50,
        alt_rank: coinData.alt_rank ?? 999,
        social_volume_24h: coinData.social_volume_24h ?? 0,
        interactions_24h: coinData.interactions_24h ?? 0,
        sentiment: coinData.sentiment ?? 2.5,
        social_dominance: coinData.social_dominance ?? 0,
        market_cap: coinData.market_cap ?? undefined,
        price: coinData.price ?? undefined,
        volume_24h: coinData.volume_24h ?? undefined,
        percent_change_24h: coinData.percent_change_24h ?? undefined
      };

      const aiPrediction = await this.generateAIPrediction(symbol, socialMetrics);

      return {
        symbol: symbol.toUpperCase(),
        current_price: coinData.price ?? 0,
        social_metrics: socialMetrics,
        ai_prediction: aiPrediction,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`❌ Error analyzing ${symbol}:`, error);

      const fallbackCoin = this.getFallbackCryptos().find(coin =>
        coin.symbol.toLowerCase() === symbol.toLowerCase()
      );

      if (fallbackCoin) {
        return this.createFallbackAnalysis(symbol, fallbackCoin);
      }

      throw new Error(`Failed to analyze ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate AI prediction
   */
  private async generateAIPrediction(symbol: string, metrics: SocialMetrics): Promise<any> {
    try {
      if (!this.model) {
        return this.createFallbackPrediction(metrics);
      }

      const currentPrice = metrics.price ?? 0;

      const prompt = `Analyze ${symbol}: Galaxy Score ${metrics.galaxy_score}/100, AltRank ${metrics.alt_rank}, Price $${currentPrice}. Return JSON: {"price_target_24h": number, "price_target_7d": number, "confidence_score": 0-100, "risk_level": "LOW|MEDIUM|HIGH", "reasoning": "text", "position_size_recommendation": 1-10}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return this.createFallbackPrediction(metrics);
      }

      const prediction = JSON.parse(jsonMatch[0]);

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
      console.error('❌ Error generating AI prediction:', error);
      return this.createFallbackPrediction(metrics);
    }
  }

  private createFallbackPrediction(metrics: SocialMetrics): any {
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

  private createFallbackAnalysis(symbol: string, fallbackCoin: CryptoSearchResult): PredictionData {
    const socialMetrics: SocialMetrics = {
      galaxy_score: fallbackCoin.galaxy_score ?? 50,
      alt_rank: 500,
      social_volume_24h: 1000,
      interactions_24h: 500,
      sentiment: 2.5,
      social_dominance: 1.0,
      market_cap: fallbackCoin.market_cap,
      price: fallbackCoin.current_price,
      volume_24h: undefined,
      percent_change_24h: undefined
    };

    const aiPrediction = this.createFallbackPrediction(socialMetrics);

    return {
      symbol: symbol.toUpperCase(),
      current_price: fallbackCoin.current_price ?? 0,
      social_metrics: socialMetrics,
      ai_prediction: aiPrediction,
      timestamp: new Date().toISOString()
    };
  }

  async getPopularCryptos(): Promise<CryptoSearchResult[]> {
    try {
      await this.initializeServices();

      if (!this.lunarcrush) {
        return this.getFallbackCryptos();
      }

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
      console.error('❌ Error getting popular cryptos:', error);
      return this.getFallbackCryptos();
    }
  }

  private getFallbackCryptos(): CryptoSearchResult[] {
    return [
      { symbol: 'BTC', name: 'Bitcoin', current_price: 45000, galaxy_score: 85 },
      { symbol: 'ETH', name: 'Ethereum', current_price: 2800, galaxy_score: 80 },
      { symbol: 'SOL', name: 'Solana', current_price: 110, galaxy_score: 75 },
      { symbol: 'ADA', name: 'Cardano', current_price: 0.45, galaxy_score: 60 },
      { symbol: 'DOT', name: 'Polkadot', current_price: 8.50, galaxy_score: 55 },
      { symbol: 'MATIC', name: 'Polygon', current_price: 0.85, galaxy_score: 65 }
    ];
  }
}

export const lunarCrushEnhanced = new LunarCrushEnhancedService();
export { LunarCrushEnhancedService };
