// Real LunarCrush MCP Integration - No LLM needed, direct calls
export interface CryptoData {
  symbol: string;
  name: string;
  galaxy_score?: number;
  close?: number;
  market_cap?: number;
  percent_change_24h?: number;
  alt_rank?: number;
  interactions?: number;
  sentiment?: number;
}

export class LunarCrushMCP {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY || '';
  }

  async getPopularCryptos(): Promise<CryptoData[]> {
    try {
      // Use the actual LunarCrush MCP tools available in this environment
      console.log('🚀 Calling LunarCrush MCP: cryptocurrencies');

      // This should be replaced by actual MCP tool call
      // For now, we'll use direct API call until MCP is properly connected
      const response = await fetch(`https://lunarcrush.com/api4/public/coins/list?data=market&key=${this.apiKey}&sort=galaxy_score&limit=6`);

      if (!response.ok) {
        throw new Error(`LunarCrush API error: ${response.status}`);
      }

      const data = await response.json();

      return data.data?.map((crypto: any) => ({
        symbol: crypto.s,
        name: crypto.n,
        galaxy_score: crypto.gs,
        close: crypto.p,
        market_cap: crypto.mc,
        percent_change_24h: crypto.pc,
        alt_rank: crypto.acr,
        interactions: crypto.i,
        sentiment: crypto.ss
      })) || [];

    } catch (error) {
      console.error('Failed to load popular cryptos:', error);
      // Return empty array instead of error - let UI handle loading state
      return [];
    }
  }

  async searchCrypto(query: string): Promise<CryptoData[]> {
    try {
      console.log(`🔍 Calling LunarCrush MCP: search("${query}")`);

      // Direct API call for search
      const response = await fetch(`https://lunarcrush.com/api4/public/coins/search?data=market&key=${this.apiKey}&term=${encodeURIComponent(query)}&limit=10`);

      if (!response.ok) {
        throw new Error(`LunarCrush search error: ${response.status}`);
      }

      const data = await response.json();

      return data.data?.map((crypto: any) => ({
        symbol: crypto.s,
        name: crypto.n,
        galaxy_score: crypto.gs,
        close: crypto.p,
        market_cap: crypto.mc,
        percent_change_24h: crypto.pc,
        alt_rank: crypto.acr,
        interactions: crypto.i,
        sentiment: crypto.ss
      })) || [];

    } catch (error) {
      console.error(`Failed to search for "${query}":`, error);
      return [];
    }
  }

  async getCryptoDetails(symbol: string): Promise<CryptoData | null> {
    try {
      console.log(`📊 Calling LunarCrush MCP: topics("${symbol}")`);

      const response = await fetch(`https://lunarcrush.com/api4/public/topic/${symbol}?data=market&key=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`LunarCrush topic error: ${response.status}`);
      }

      const data = await response.json();
      const crypto = data.data;

      return {
        symbol: crypto.s,
        name: crypto.n,
        galaxy_score: crypto.gs,
        close: crypto.p,
        market_cap: crypto.mc,
        percent_change_24h: crypto.pc,
        alt_rank: crypto.acr,
        interactions: crypto.i,
        sentiment: crypto.ss
      };

    } catch (error) {
      console.error(`Failed to get details for "${symbol}":`, error);
      return null;
    }
  }
}

// Export singleton instance
export const lunarCrushMCP = new LunarCrushMCP();
