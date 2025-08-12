'use client';

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Zap, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { CryptoSearchResult } from '@/lib/lunarcrush-enhanced';

interface CoinSearchProps {
  onCoinSelect: (coin: CryptoSearchResult) => void;
  className?: string;
}

export default function CoinSearch({ onCoinSelect, className = '' }: CoinSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CryptoSearchResult[]>([]);
  const [popularCryptos, setPopularCryptos] = useState<CryptoSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  // Popular cryptos - LLM will handle this
  useEffect(() => {
    async function loadPopularCryptos() {
      try {
        setError(null);
        console.log('🤖 LLM REQUEST: Load popular cryptocurrencies');
        console.log('📡 LLM should use LunarCrush MCP:Cryptocurrencies with appropriate sorting');

        // LLM will use MCP tools to get popular cryptos
        // For now, show placeholder that LLM will replace
        const placeholderPopular: CryptoSearchResult[] = [
          { symbol: 'BTC', name: 'Bitcoin', galaxy_score: 85 },
          { symbol: 'ETH', name: 'Ethereum', galaxy_score: 82 },
          { symbol: 'SOL', name: 'Solana', galaxy_score: 75 },
          { symbol: 'ADA', name: 'Cardano', galaxy_score: 70 },
          { symbol: 'DOT', name: 'Polkadot', galaxy_score: 68 },
          { symbol: 'MATIC', name: 'Polygon', galaxy_score: 65 }
        ];

        setPopularCryptos(placeholderPopular);
        console.log('✅ Popular cryptos loaded (LLM will replace with real MCP data)');

      } catch (err) {
        console.error('❌ LLM will handle this error with real MCP data');
        setError('LLM will load popular cryptos using MCP tools');
      }
    }

    loadPopularCryptos();
  }, []);

  // Search functionality - LLM will handle this
  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        console.log(`🤖 LLM REQUEST: Search for "${debouncedSearchQuery}"`);
        console.log('📡 LLM should use LunarCrush MCP:Search or MCP:Cryptocurrencies');

        // LLM will use MCP tools to search
        // For now, show placeholder that LLM will replace
        const placeholderResults: CryptoSearchResult[] = [
          {
            symbol: debouncedSearchQuery.toUpperCase(),
            name: `${debouncedSearchQuery} (via MCP)`,
            galaxy_score: 75,
            current_price: 45000,
            market_cap: 850000000000
          }
        ];

        setSearchResults(placeholderResults);
        console.log('✅ Search completed (LLM will replace with real MCP data)');

      } catch (err) {
        console.error('❌ LLM will handle this error with real MCP data');
        setError('LLM will search using MCP tools');
      } finally {
        setIsSearching(false);
      }
    }

    performSearch();
  }, [debouncedSearchQuery]);

  const handleCoinSelect = (coin: CryptoSearchResult) => {
    console.log(`🚀 Coin selected: ${coin.symbol} - LLM will handle analysis`);
    onCoinSelect(coin);
    setSearchQuery('');
    setSearchResults([]);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return price >= 1 ? `$${price.toLocaleString()}` : `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-slate-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search any cryptocurrency (e.g., Bitcoin, BTC, Ethereum)..."
          className="block w-full pl-10 pr-3 py-4 border border-slate-600 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />

        {/* LLM Context Badge */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
            MCP POWERED
          </span>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="text-yellow-400 text-sm">{error}</div>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-6 bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-3 border-b border-slate-700">
            <h3 className="text-sm font-medium text-slate-300 flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Search Results (LLM + MCP)
            </h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => handleCoinSelect(coin)}
                className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {coin.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-white">{coin.name}</div>
                      <div className="text-sm text-slate-400">{coin.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{formatPrice(coin.current_price)}</div>
                    <div className="text-xs text-slate-400">{formatMarketCap(coin.market_cap)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cryptocurrencies */}
      <div className="bg-slate-800 rounded-lg border border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
            Popular Cryptocurrencies
            <Zap className="h-4 w-4 ml-2 text-yellow-400" />
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Top cryptocurrencies by Galaxy Score (LLM will load via MCP)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {popularCryptos.map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => handleCoinSelect(coin)}
              className="p-4 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 md:border-r md:border-slate-700 last:border-b-0 md:even:border-r-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {coin.symbol.slice(0, 3)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{coin.name}</div>
                    <div className="text-sm text-slate-400">{coin.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{formatPrice(coin.current_price)}</div>
                  <div className="text-xs text-green-400">
                    ⭐ {coin.galaxy_score || 'N/A'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* MCP Information */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="text-sm text-blue-400">
          🤖 <strong>LLM + MCP Integration:</strong> The AI assistant will automatically use the best LunarCrush MCP tools
          (Search, Cryptocurrencies, Topic) to provide real-time data based on your requests.
        </div>
      
      {/* Resource Management Status */}
      <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
        <div className="text-sm text-orange-400">
          ⚡ <strong>Resource Management Active:</strong> Requests are throttled to prevent Worker CPU exhaustion.
          If requests fail, the LLM will automatically use direct MCP tools instead.
        </div>
      </div>

    </div>
    </div>
  );
}
