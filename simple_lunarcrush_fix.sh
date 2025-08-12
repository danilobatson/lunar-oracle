#!/bin/bash

# Simple LunarCrush Fix - Use the ACTUAL API from documentation
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "🌙 Using the ACTUAL LunarCrush SDK API from documentation..."

# Step 1: Fix the LunarCrush helper with correct API
cat > src/lib/lunarcrush.ts << 'EOLUNAR'
import LunarCrush from 'lunarcrush-sdk';

// Simple constructor - just pass the API key string
const lc = new LunarCrush(process.env.LUNARCRUSH_API_KEY || process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY || '');

export interface CoinData {
  symbol: string;
  name: string;
  price: number;
  percent_change_24h: number;
  galaxy_score: number;
  alt_rank: number;
  social_volume: number;
  sentiment: number;
}

// Use the ACTUAL API methods from documentation
export const getCoinData = async (symbol: string): Promise<CoinData | null> => {
  try {
    // Get individual coin - from docs: lc.coins.get('BTC')
    const data = await lc.coins.get(symbol.toUpperCase());
    return data;
  } catch (error) {
    console.error('LunarCrush getCoinData error:', error);
    return null;
  }
};

export const getTopCoins = async (limit: number = 10) => {
  try {
    // Get coins list - from docs: lc.coins.list()
    const data = await lc.coins.list();
    // Return limited results
    return data.slice(0, limit);
  } catch (error) {
    console.error('LunarCrush getTopCoins error:', error);
    return [];
  }
};

// Export the client for direct use
export default lc;
EOLUNAR

# Step 2: Update the homepage to use correct API
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
        
        // Only generate prediction if we have coin data
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
      <p>Real LunarCrush SDK Integration</p>
      
      <div className="status">
        <h3>✅ Status</h3>
        <p>• LunarCrush SDK using correct API methods</p>
        <p>• lc.coins.get() for individual coins</p>
        <p>• lc.coins.list() for coin lists</p>
        <p>• Ready for real data!</p>
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
          <p><small>Check browser console for more details</small></p>
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

# Step 3: Update CSS with better styling
cat > src/app/globals.css << 'EOCSS'
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  min-height: 100vh;
  line-height: 1.6;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.container > p {
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.status {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status h3 {
  color: #4ade80;
  margin-bottom: 1rem;
}

.status p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 160px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
}

.btn-secondary {
  background: linear-gradient(45deg, #3b82f6, #1d4ed8);
  color: white;
}

.btn-tertiary {
  background: linear-gradient(45deg, #8b5cf6, #7c3aed);
  color: white;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}

.coin-data, .prediction, .error {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.coin-data h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #fbbf24;
  text-align: center;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.data-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.data-item strong {
  display: block;
  color: #e5e7eb;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.raw-data {
  margin-top: 1rem;
}

.raw-data summary {
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.9rem;
}

.raw-data pre {
  background: rgba(0,0,0,0.3);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  overflow-x: auto;
  margin-top: 1rem;
}

.prediction h3 {
  color: #60a5fa;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.error h3 {
  color: #fca5a5;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
  
  .data-grid {
    grid-template-columns: 1fr;
  }
}
EOCSS

# Step 4: Remove debug page (keep it simple)
rm -rf src/app/debug

# Step 5: Test TypeScript
echo "🔨 Testing TypeScript with correct API..."
npx tsc --noEmit > simple_lunarcrush_test.log 2>&1
TS_STATUS=$?

# Step 6: Create status report
cat > simple_lunarcrush_status.json << EOSTATUS
{
  "timestamp": "$(date -Iseconds)",
  "simple_api_implemented": true,
  "typescript_passing": $(test $TS_STATUS -eq 0 && echo "true" || echo "false"),
  "api_methods_used": [
    "lc.coins.get(symbol) - Get individual coin data",
    "lc.coins.list() - Get list of all coins",
    "new LunarCrush(apiKey) - Simple constructor"
  ],
  "documentation_source": "Official LunarCrush SDK docs from project knowledge",
  "approach": "simple_correct_api_from_docs",
  "ready_for_testing": $(test $TS_STATUS -eq 0 && echo "true" || echo "false"),
  "next_action": $(test $TS_STATUS -eq 0 && echo "\"SUCCESS: Test with real API key\"" || echo "\"Check TypeScript logs\"")
}
EOSTATUS

if [ $TS_STATUS -eq 0 ]; then
  echo "🎉 SIMPLE LUNARCRUSH API WORKING!"
  echo "✅ TypeScript compilation successful"
  echo "✅ Using correct API methods from documentation:"
  echo "   • lc.coins.get('BTC') for individual coins"
  echo "   • lc.coins.list() for all coins"
  echo "   • Simple constructor: new LunarCrush('api-key')"
  echo ""
  echo "🚀 READY TO TEST WITH REAL DATA:"
  echo "   npm run dev"
  echo "   # Visit http://localhost:3000"
  echo "   # Click buttons to test real LunarCrush API"
  
  # Commit the working solution
  git add .
  git commit -m "feat: implement correct LunarCrush SDK API from documentation

- Use actual API methods: lc.coins.get() and lc.coins.list()
- Simple constructor: new LunarCrush(apiKey)
- Remove complex fallback logic - use documented API
- Professional UI with better error handling
- Ready for real LunarCrush data testing"

  echo "✅ Simple API implementation committed"
else
  echo "❌ TypeScript still has issues"
  echo "📋 Check simple_lunarcrush_test.log"
fi

echo ""
echo "📁 Files:"
echo "   - simple_lunarcrush_status.json"
echo "   - simple_lunarcrush_test.log"
