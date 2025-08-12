'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, TrendingUp, Star } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { lunarCrushEnhanced, CryptoSearchResult } from '@/lib/lunarcrush-enhanced';

interface CoinSearchProps {
  onCoinSelect: (coin: CryptoSearchResult) => void;
  placeholder?: string;
  showPopular?: boolean;
}

export default function CoinSearch({
  onCoinSelect,
  placeholder = "Search cryptocurrencies...",
  showPopular = true
}: CoinSearchProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [searchResults, setSearchResults] = useState<CryptoSearchResult[]>([]);
  const [popularCryptos, setPopularCryptos] = useState<CryptoSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingPopular, setIsLoadingPopular] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Load popular cryptocurrencies on mount
  useEffect(() => {
    if (showPopular) {
      loadPopularCryptos();
    }
  }, [showPopular]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery]);

  const loadPopularCryptos = async () => {
    try {
      setIsLoadingPopular(true);
      setError(null);
      const popular = await lunarCrushEnhanced.getPopularCryptos();
      setPopularCryptos(popular);
    } catch (err) {
      console.error('Error loading popular cryptos:', err);
      setError('Failed to load popular cryptocurrencies');
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const performSearch = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      setError(null);
      const results = await lunarCrushEnhanced.searchCryptocurrencies(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error('Error searching cryptocurrencies:', err);
      setError('Failed to search cryptocurrencies');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCoinClick = (coin: CryptoSearchResult) => {
    setQuery('');
    setShowResults(false);
    onCoinSelect(coin);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return price >= 1 ? `$${price.toFixed(2)}` : `$${price.toFixed(6)}`;
  };

  const formatMarketCap = (marketCap?: number) => {
    if (!marketCap) return 'N/A';
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  const getGalaxyScoreColor = (score?: number) => {
    if (!score) return 'text-gray-400';
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    if (score >= 25) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg
                     bg-white/10 backdrop-blur-sm text-white placeholder-gray-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200"
          onFocus={() => {
            if (searchResults.length > 0) setShowResults(true);
          }}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-500/20 border border-red-500/30
                        rounded-lg backdrop-blur-sm">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm
                        border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs text-gray-400 mb-2 px-2">Search Results</div>
            {searchResults.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => handleCoinClick(coin)}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-800/50
                           transition-colors duration-150 border border-transparent hover:border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-white">{coin.symbol}</span>
                      <span className="text-sm text-gray-400">{coin.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-300">
                        {formatPrice(coin.current_price)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatMarketCap(coin.market_cap)}
                      </span>
                    </div>
                  </div>
                  {coin.galaxy_score && (
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Galaxy Score</div>
                      <div className={`text-sm font-medium ${getGalaxyScoreColor(coin.galaxy_score)}`}>
                        {coin.galaxy_score.toFixed(0)}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Cryptocurrencies */}
      {showPopular && query.length === 0 && (
        <div className="mt-6">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Popular Cryptocurrencies</span>
          </div>

          {isLoadingPopular ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
              <span className="ml-2 text-gray-400">Loading popular cryptos...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {popularCryptos.slice(0, 6).map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => handleCoinClick(coin)}
                  className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg
                             hover:bg-gray-700/50 hover:border-gray-600
                             transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-white group-hover:text-blue-300
                                      transition-colors duration-200">
                        {coin.symbol}
                      </div>
                      <div className="text-xs text-gray-400">{coin.name}</div>
                    </div>
                    {coin.galaxy_score && (
                      <div className="text-right">
                        <Star className="h-3 w-3 text-yellow-400 mx-auto" />
                        <div className={`text-xs ${getGalaxyScoreColor(coin.galaxy_score)}`}>
                          {coin.galaxy_score.toFixed(0)}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-300">
                    {formatPrice(coin.current_price)}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
