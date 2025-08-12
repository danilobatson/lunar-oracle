import LunarCrush from 'lunarcrush-sdk';

const lc = new LunarCrush(process.env.LUNARCRUSH_API_KEY || process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY || '');

// Interface matching ACTUAL CoinDetails schema
export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  percent_change_24h: number;
  percent_change_7d: number;
  galaxy_score: number;
  alt_rank: number;
  market_cap: number;
  volume_24h: number;
  volatility: number;
}

export const getCoinData = async (symbol: string): Promise<CoinData | null> => {
  try {
    const data = await lc.coins.get(symbol.toUpperCase());
    
    if (!data) {
      return null;
    }
    
    // Use ONLY properties that exist in CoinDetails schema
    return {
      symbol: data.symbol || symbol.toUpperCase(),
      name: data.name || symbol.toUpperCase(),
      price: data.price || 0,
      percent_change_24h: data.percent_change_24h || 0,
      percent_change_7d: data.percent_change_7d || 0,
      galaxy_score: data.galaxy_score || 0,
      alt_rank: data.alt_rank || 0,
      market_cap: data.market_cap || 0,
      volume_24h: data.volume_24h || 0,
      volatility: data.volatility || 0,
    };
  } catch (error) {
    console.error('LunarCrush getCoinData error:', error);
    return null;
  }
};

export const getTopCoins = async (limit: number = 10): Promise<CoinData[]> => {
  try {
    const data = await lc.coins.list();
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data
      .filter(coin => coin !== null)
      .slice(0, limit)
      .map(coin => ({
        symbol: coin.symbol || 'UNKNOWN',
        name: coin.name || 'Unknown',
        price: coin.price || 0,
        percent_change_24h: coin.percent_change_24h || 0,
        percent_change_7d: coin.percent_change_7d || 0,
        galaxy_score: coin.galaxy_score || 0,
        alt_rank: coin.alt_rank || 0,
        market_cap: coin.market_cap || 0,
        volume_24h: coin.volume_24h || 0,
        volatility: coin.volatility || 0,
      }));
  } catch (error) {
    console.error('LunarCrush getTopCoins error:', error);
    return [];
  }
};

export default lc;
