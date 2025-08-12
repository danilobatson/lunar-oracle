/**
 * Client-safe LunarCrush wrapper that handles CORS properly
 */

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  galaxy_score: number;
  alt_rank?: number;
  social_volume_24h?: number;
  interactions_24h?: number;
  sentiment?: number;
  social_dominance?: number;
  market_cap?: number;
  volume_24h?: number;
  percent_change_24h?: number;
}

class ClientSafeLunarCrush {
  private apiKey: string;
  private endpoint = 'https://lunarcrush.cryptoguard-api.workers.dev/graphql';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(query: string, variables?: any): Promise<any> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      return result.data;
    } catch (error) {
      console.error('LunarCrush API Error:', error);
      throw error;
    }
  }

  async getCoinsList(limit = 50): Promise<CoinData[]> {
    const query = `
      query GetCoinsList($limit: Int) {
        getCoinsList(limit: $limit) {
          symbol
          name
          price
          galaxy_score
          alt_rank
          social_volume_24h
          interactions_24h
          sentiment
          social_dominance
          market_cap
          volume_24h
          percent_change_24h
        }
      }
    `;

    const data = await this.makeRequest(query, { limit });
    return data.getCoinsList || [];
  }

  async getCoin(symbol: string): Promise<CoinData | null> {
    const coins = await this.getCoinsList(1000);
    return coins.find(coin => coin.symbol.toLowerCase() === symbol.toLowerCase()) || null;
  }

  // Convenience object for familiar API
  get coins() {
    return {
      list: () => this.getCoinsList(),
      get: (symbol: string) => this.getCoin(symbol),
    };
  }
}

export { ClientSafeLunarCrush };
export default ClientSafeLunarCrush;
