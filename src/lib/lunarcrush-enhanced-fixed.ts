import ClientSafeLunarCrush from './lunarcrush-client-safe';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ... (keep all the existing interfaces)
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
  private lunarcrush: ClientSafeLunarCrush | null = null;
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;

  private async initializeServices() {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      const lunarcrushKey = 'vcbhz3zf90hd7rtk97d3k436x8me7eb0tb77fjk2d';
      const geminiKey = 'AIzaSyCBKmjYBpNOm-ZA4UKrqjlyoWXkWZRdKNc';

      this.lunarcrush = new ClientSafeLunarCrush(lunarcrushKey);

      if (geminiKey) {
        this.genAI = new GoogleGenerativeAI(geminiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
      }
      
      this.isInitialized = true;
      console.log('✅ Client-safe LunarCrush services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize services:', error);
    }
  }

  async searchCryptocurrencies(query: string): Promise<CryptoSearchResult[]> {
    try {
      await this.initializeServices();
      
      if (!this.lunarcrush) {
        return this.getFallbackCryptos().filter(coin => 
          coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
          coin.name.toLowerCase().includes(query.toLowerCase())
        );
      }

      console.log(`🔍 Searching cryptocurrencies: ${query}`);
      
      const coinsList = await this.lunarcrush.coins.list();

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
      return this.getFallbackCryptos().filter(coin => 
        coin.symbol.toLowerCase().includes(query.toLowerCase()) ||
        coin.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  // ... (keep all other methods the same, just replace this.lunarcrush usage)

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
