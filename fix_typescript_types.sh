#!/bin/bash

# Fix TypeScript Types - Handle actual SDK return types
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "🔧 Fixing TypeScript types for LunarCrush SDK..."

# Step 1: Fix the LunarCrush helper with proper type handling
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
    
    // Handle null/undefined and map to our interface
    if (!data) {
      return null;
    }
    
    // Map the actual SDK response to our simple interface
    return {
      symbol: data.symbol || symbol.toUpperCase(),
      name: data.name || symbol.toUpperCase(),
      price: data.price || 0,
      percent_change_24h: data.percent_change_24h || 0,
      galaxy_score: data.galaxy_score || 0,
      alt_rank: data.alt_rank || 0,
      social_volume: data.social_volume || 0,
      sentiment: data.sentiment || 0,
    };
  } catch (error) {
    console.error('LunarCrush getCoinData error:', error);
    return null;
  }
};

export const getTopCoins = async (limit: number = 10): Promise<CoinData[]> => {
  try {
    // Get coins list - from docs: lc.coins.list()
    const data = await lc.coins.list();
    
    // Handle null/undefined
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Map and limit results
    return data.slice(0, limit).map(coin => ({
      symbol: coin.symbol || 'UNKNOWN',
      name: coin.name || 'Unknown',
      price: coin.price || 0,
      percent_change_24h: coin.percent_change_24h || 0,
      galaxy_score: coin.galaxy_score || 0,
      alt_rank: coin.alt_rank || 0,
      social_volume: coin.social_volume || 0,
      sentiment: coin.sentiment || 0,
    }));
  } catch (error) {
    console.error('LunarCrush getTopCoins error:', error);
    return [];
  }
};

// Export the client for direct use
export default lc;
EOLUNAR

# Step 2: Add a simple test function to see what data we actually get
cat > src/app/test/page.tsx << 'EOTEST'
'use client';

import { useState } from 'react';
import lc from '@/lib/lunarcrush';

export default function TestPage() {
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRawAPI = async () => {
    setLoading(true);
    try {
      console.log('Testing raw LunarCrush API...');
      
      // Test the raw SDK response
      const data = await lc.coins.get('BTC');
      console.log('Raw Bitcoin data:', data);
      setRawData(data);
      
    } catch (error) {
      console.error('Raw API test error:', error);
      setRawData({ error: error.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🧪 LunarCrush API Test</h1>
      <p>Test the raw SDK to see actual data structure</p>
      
      <button 
        onClick={testRawAPI}
        disabled={loading}
        style={{ 
          padding: '1rem 2rem', 
          fontSize: '1rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          margin: '1rem 0'
        }}
      >
        {loading ? 'Testing...' : 'Test Raw Bitcoin API'}
      </button>
      
      {rawData && (
        <div style={{ 
          background: '#f3f4f6', 
          color: '#000',
          padding: '1rem', 
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <h3>Raw API Response:</h3>
          <pre style={{ 
            overflow: 'auto', 
            fontSize: '0.8rem',
            background: '#e5e7eb',
            padding: '1rem',
            borderRadius: '4px'
          }}>
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ color: '#3b82f6' }}>← Back to main page</a>
      </div>
    </div>
  );
}
EOTEST

# Create test directory
mkdir -p src/app/test

# Step 3: Test TypeScript
echo "🔨 Testing TypeScript with fixed types..."
npx tsc --noEmit > typescript_fix_test.log 2>&1
TS_STATUS=$?

# Step 4: Test dev server if TypeScript passes
if [ $TS_STATUS -eq 0 ]; then
  echo "🚀 Testing dev server..."
  npm run dev > dev_fix_test.log 2>&1 &
  DEV_PID=$!

  sleep 5
  if ps -p $DEV_PID > /dev/null 2>&1; then
    DEV_SUCCESS=true
    kill $DEV_PID 2>/dev/null
    wait $DEV_PID 2>/dev/null || true
  else
    DEV_SUCCESS=false
  fi
else
  DEV_SUCCESS=false
fi

# Step 5: Create status report
cat > typescript_fix_status.json << EOSTATUS
{
  "timestamp": "$(date -Iseconds)",
  "typescript_fixes_applied": true,
  "typescript_passing": $(test $TS_STATUS -eq 0 && echo "true" || echo "false"),
  "dev_server_working": $DEV_SUCCESS,
  "fixes_made": [
    "Added proper null/undefined checks for SDK responses",
    "Map SDK response to our CoinData interface",
    "Handle array type checking for coins.list()",
    "Add fallback values for missing properties",
    "Created test page to inspect raw API responses"
  ],
  "test_page_available": "/test",
  "ready_for_api_testing": $(test $TS_STATUS -eq 0 && test $DEV_SUCCESS = true && echo "true" || echo "false"),
  "next_action": $(test $TS_STATUS -eq 0 && test $DEV_SUCCESS = true && echo "\"SUCCESS: Test with real API\"" || echo "\"Check logs for issues\"")
}
EOSTATUS

if [ $TS_STATUS -eq 0 ] && [ $DEV_SUCCESS = true ]; then
  echo "🎉 TYPESCRIPT FIXES SUCCESSFUL!"
  echo "✅ All type errors resolved"
  echo "✅ Dev server working"
  echo "✅ Proper null/undefined handling"
  echo "🧪 Test page available at /test"
  echo ""
  echo "🔍 NEXT STEPS:"
  echo "   1. npm run dev"
  echo "   2. Visit http://localhost:3000/test"
  echo "   3. Click 'Test Raw Bitcoin API'"
  echo "   4. Check what data structure we actually get"
  echo "   5. Then test main page at http://localhost:3000"
  
  # Commit the fixes
  git add .
  git commit -m "fix: resolve TypeScript type errors for LunarCrush SDK

- Add proper null/undefined handling for SDK responses
- Map SDK response to our CoinData interface  
- Add array type checking and fallback values
- Create test page to inspect raw API structure
- All TypeScript errors resolved"

  echo "✅ TypeScript fixes committed"
  
elif [ $TS_STATUS -eq 0 ]; then
  echo "✅ TypeScript fixed but dev server issues"
  echo "📋 Check dev_fix_test.log"
else
  echo "❌ TypeScript still has issues"
  echo "📋 Check typescript_fix_test.log"
fi

echo ""
echo "📁 Files:"
echo "   - typescript_fix_status.json"
echo "   - typescript_fix_test.log"
echo "   - src/app/test/page.tsx (raw API test)"
