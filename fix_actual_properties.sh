#!/bin/bash

# Fix Actual Properties - Use what TypeScript tells us exists
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "🔧 Using ACTUAL properties that exist in the SDK..."

# Step 1: Use only properties that TypeScript confirms exist
cat > src/lib/lunarcrush.ts << 'EOLUNAR'
import LunarCrush from 'lunarcrush-sdk';

// Simple constructor
const lc = new LunarCrush(process.env.LUNARCRUSH_API_KEY || process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY || '');

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  percent_change_24h: number;
  galaxy_score: number;
  alt_rank: number;
  social_volume_24h: number; // Use the actual property name
  // Remove sentiment for now since it doesn't exist
}

export const getCoinData = async (symbol: string): Promise<CoinData | null> => {
  try {
    const data = await lc.coins.get(symbol.toUpperCase());
    
    if (!data) {
      return null;
    }
    
    // Use only properties that actually exist
    return {
      symbol: data.symbol || symbol.toUpperCase(),
      name: data.name || symbol.toUpperCase(),
      price: data.price || 0,
      percent_change_24h: data.percent_change_24h || 0,
      galaxy_score: data.galaxy_score || 0,
      alt_rank: data.alt_rank || 0,
      social_volume_24h: data.social_volume_24h || 0, // Use correct property name
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
    
    // Filter out null coins and map
    return data
      .filter(coin => coin !== null) // Remove null coins
      .slice(0, limit)
      .map(coin => ({
        symbol: coin.symbol || 'UNKNOWN',
        name: coin.name || 'Unknown',
        price: coin.price || 0,
        percent_change_24h: coin.percent_change_24h || 0,
        galaxy_score: coin.galaxy_score || 0,
        alt_rank: coin.alt_rank || 0,
        social_volume_24h: coin.social_volume_24h || 0, // Use correct property name
      }));
  } catch (error) {
    console.error('LunarCrush getTopCoins error:', error);
    return [];
  }
};

export default lc;
EOLUNAR

# Step 2: Update the page to use correct property names
cat > src/app/page.tsx << 'EOPAGE'
'use client';

import { useState } from 'react';
import { getCoinData } from '@/lib/lunarcrush';
import { generatePrediction } from '@/lib/gemini';

export default function HomePage() {
  const [coinData, setCoinData] = useState<any>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const analyzeCoin = async (symbol: string) => {
    setLoading(true);
    setError('');
    setCoinData(null);
    setPrediction('');
    
    try {
      console.log(`Analyzing ${symbol}...`);
      const data = await getCoinData(symbol);
      
      if (data) {
        setCoinData(data);
        console.log('Got coin data:', data);
        
        const pred = await generatePrediction(data);
        setPrediction(pred);
        console.log('Got prediction:', pred);
      } else {
        setError(`Failed to get data for ${symbol}. Check console for details.`);
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed: ' + (err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>🌙 LunarOracle</h1>
      <p>Using ACTUAL LunarCrush SDK Properties</p>
      
      <div className="status">
        <h3>✅ Fixed</h3>
        <p>• Using social_volume_24h (not social_volume)</p>
        <p>• Removed non-existent sentiment property</p>
        <p>• Proper null filtering for coin arrays</p>
        <p>• Only using properties TypeScript confirms exist</p>
      </div>
      
      <div className="controls">
        <button 
          onClick={() => analyzeCoin('btc')}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Analyzing...' : 'Analyze Bitcoin'}
        </button>
        
        <button 
          onClick={() => analyzeCoin('eth')}
          disabled={loading}
          className="btn btn-secondary"
        >
          {loading ? 'Analyzing...' : 'Analyze Ethereum'}
        </button>
        
        <button 
          onClick={() => analyzeCoin('sol')}
          disabled={loading}
          className="btn btn-tertiary"
        >
          {loading ? 'Analyzing...' : 'Analyze Solana'}
        </button>
      </div>

      {error && (
        <div className="error">
          <h3>⚠️ Error</h3>
          <p>{error}</p>
        </div>
      )}

      {coinData && (
        <div className="coin-data">
          <h2>{coinData.name} ({coinData.symbol})</h2>
          <div className="data-grid">
            <div className="data-item">
              <strong>Price:</strong> ${coinData.price || 'N/A'}
            </div>
            <div className="data-item">
              <strong>24h Change:</strong> {coinData.percent_change_24h || 'N/A'}%
            </div>
            <div className="data-item">
              <strong>Galaxy Score:</strong> {coinData.galaxy_score || 'N/A'}
            </div>
            <div className="data-item">
              <strong>Alt Rank:</strong> {coinData.alt_rank || 'N/A'}
            </div>
            <div className="data-item">
              <strong>Social Volume 24h:</strong> {coinData.social_volume_24h || 'N/A'}
            </div>
          </div>
          
          <details className="raw-data">
            <summary>View Raw Data</summary>
            <pre>{JSON.stringify(coinData, null, 2)}</pre>
          </details>
        </div>
      )}

      {prediction && (
        <div className="prediction">
          <h3>🤖 AI Prediction</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}
EOPAGE

# Step 3: Test TypeScript
echo "🔨 Testing TypeScript with actual properties..."
npx tsc --noEmit > actual_properties_test.log 2>&1
TS_STATUS=$?

# Step 4: Create status report
cat > actual_properties_status.json << EOSTATUS
{
  "timestamp": "$(date -Iseconds)",
  "actual_properties_used": true,
  "typescript_passing": $(test $TS_STATUS -eq 0 && echo "true" || echo "false"),
  "property_fixes": [
    "Changed social_volume to social_volume_24h (actual property name)",
    "Removed sentiment property (doesn't exist in SDK)",
    "Added null filtering for coin arrays",
    "Used only properties confirmed by TypeScript compiler"
  ],
  "approach": "listen_to_typescript_compiler",
  "ready_for_testing": $(test $TS_STATUS -eq 0 && echo "true" || echo "false"),
  "next_action": $(test $TS_STATUS -eq 0 && echo "\"SUCCESS: Finally test the real API\"" || echo "\"Still have TypeScript issues\"")
}
EOSTATUS

if [ $TS_STATUS -eq 0 ]; then
  echo "🎉 TYPESCRIPT FINALLY HAPPY!"
  echo "✅ Using actual property names from SDK"
  echo "✅ social_volume_24h instead of social_volume"
  echo "✅ Removed non-existent sentiment property"
  echo "✅ Proper null handling"
  echo ""
  echo "🚀 READY TO TEST REAL API:"
  echo "   npm run dev"
  
  # Commit the working solution
  git add .
  git commit -m "fix: use actual SDK property names from TypeScript compiler

- Use social_volume_24h instead of social_volume
- Remove non-existent sentiment property  
- Add proper null filtering for arrays
- Listen to TypeScript compiler instead of guessing
- All type errors resolved"

  echo "✅ Working TypeScript committed"
else
  echo "❌ Still have TypeScript issues:"
  cat actual_properties_test.log
fi

echo ""
echo "📁 Files:"
echo "   - actual_properties_status.json"
echo "   - actual_properties_test.log"
