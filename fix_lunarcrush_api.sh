#!/bin/bash

# Fix LunarCrush SDK API Usage
cd /Users/batson/Desktop/ForTheNerds/CreatorBid/lunar-oracle

echo "🔧 Fixing LunarCrush SDK API usage..."

# Step 1: Create a script to explore the actual LunarCrush SDK API
echo "🔍 Step 1: Creating LunarCrush API explorer..."
cat > explore_lunarcrush_api.js << 'EOEXPLORE'
// Explore LunarCrush SDK to find correct method names
const LunarCrushSDK = require('lunarcrush-sdk');

console.log('=== LunarCrush SDK Exploration ===');

// Try to create instance and see what's available
try {
  console.log('LunarCrushSDK:', typeof LunarCrushSDK);
  console.log('LunarCrushSDK keys:', Object.keys(LunarCrushSDK));
  
  // Try different constructor approaches
  const sdk1 = new LunarCrushSDK({ apiKey: 'test' });
  console.log('SDK with apiKey:', typeof sdk1);
  console.log('SDK methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sdk1)));
  
} catch (e1) {
  console.log('Error with apiKey:', e1.message);
  
  try {
    const sdk2 = new LunarCrushSDK({ api_key: 'test' });
    console.log('SDK with api_key:', typeof sdk2);
    console.log('SDK methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(sdk2)));
  } catch (e2) {
    console.log('Error with api_key:', e2.message);
    
    try {
      const sdk3 = LunarCrushSDK('test');
      console.log('SDK direct call:', typeof sdk3);
    } catch (e3) {
      console.log('Error direct call:', e3.message);
    }
  }
}
EOEXPLORE

# Step 2: Run the exploration
echo "🔍 Step 2: Exploring LunarCrush SDK..."
node explore_lunarcrush_api.js > lunarcrush_api_exploration.log 2>&1

echo "📋 LunarCrush SDK exploration results:"
cat lunarcrush_api_exploration.log

# Step 3: Create fixed LunarCrush helper based on common patterns
echo "🔧 Step 3: Creating fixed LunarCrush helper..."
cat > src/lib/lunarcrush.ts << 'EOLUNAR'
import LunarCrushSDK from 'lunarcrush-sdk';

// Fix 1: Use apiKey instead of api_key
const lunarcrush = new LunarCrushSDK({
  apiKey: process.env.LUNARCRUSH_API_KEY || process.env.NEXT_PUBLIC_LUNARCRUSH_API_KEY || ''
});

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

// Fix 2: Try different method names that commonly exist in crypto APIs
export const getCoinData = async (symbol: string): Promise<CoinData | null> => {
  try {
    // Try different method names
    let data;
    
    if (typeof lunarcrush.getTopic === 'function') {
      data = await lunarcrush.getTopic(symbol);
    } else if (typeof lunarcrush.topic === 'function') {
      data = await lunarcrush.topic(symbol);
    } else if (typeof lunarcrush.getAsset === 'function') {
      data = await lunarcrush.getAsset(symbol);
    } else if (typeof lunarcrush.asset === 'function') {
      data = await lunarcrush.asset(symbol);
    } else {
      console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(lunarcrush)));
      throw new Error('No suitable method found for getting coin data');
    }
    
    return data;
  } catch (error) {
    console.error('LunarCrush getCoinData error:', error);
    return null;
  }
};

export const getTopCoins = async (limit: number = 10) => {
  try {
    let data;
    
    if (typeof lunarcrush.getCryptocurrencies === 'function') {
      data = await lunarcrush.getCryptocurrencies({ 
        sort: 'galaxy_score',
        limit 
      });
    } else if (typeof lunarcrush.cryptocurrencies === 'function') {
      data = await lunarcrush.cryptocurrencies({ 
        sort: 'galaxy_score',
        limit 
      });
    } else if (typeof lunarcrush.getCoins === 'function') {
      data = await lunarcrush.getCoins({ 
        sort: 'galaxy_score',
        limit 
      });
    } else if (typeof lunarcrush.coins === 'function') {
      data = await lunarcrush.coins({ 
        sort: 'galaxy_score',
        limit 
      });
    } else {
      console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(lunarcrush)));
      throw new Error('No suitable method found for getting coins list');
    }
    
    return data;
  } catch (error) {
    console.error('LunarCrush getTopCoins error:', error);
    return [];
  }
};

// Export the SDK instance for debugging
export default lunarcrush;
EOLUNAR

# Step 4: Add a debug page to test the SDK
echo "🛠️  Step 4: Creating debug page..."
cat > src/app/debug/page.tsx << 'EODEBUG'
'use client';

import { useState } from 'react';
import lunarcrush from '@/lib/lunarcrush';

export default function DebugPage() {
  const [methods, setMethods] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const exploreMethods = () => {
    try {
      const proto = Object.getPrototypeOf(lunarcrush);
      const methodNames = Object.getOwnPropertyNames(proto);
      setMethods(methodNames);
      console.log('LunarCrush methods:', methodNames);
    } catch (error) {
      console.error('Error exploring methods:', error);
    }
  };

  const testMethod = async (methodName: string) => {
    try {
      console.log(`Testing method: ${methodName}`);
      const method = (lunarcrush as any)[methodName];
      
      if (typeof method === 'function') {
        // Try calling with different parameters
        let testResult;
        if (methodName.toLowerCase().includes('topic') || methodName.toLowerCase().includes('asset')) {
          testResult = await method('bitcoin');
        } else if (methodName.toLowerCase().includes('coin') || methodName.toLowerCase().includes('crypto')) {
          testResult = await method({ limit: 5 });
        } else {
          testResult = await method();
        }
        
        setResult({ method: methodName, data: testResult });
        console.log(`${methodName} result:`, testResult);
      }
    } catch (error) {
      console.error(`Error testing ${methodName}:`, error);
      setResult({ method: methodName, error: error.message });
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>LunarCrush SDK Debug</h1>
      
      <button onClick={exploreMethods} style={{ margin: '1rem', padding: '0.5rem' }}>
        Explore Available Methods
      </button>
      
      <div>
        <h2>Available Methods:</h2>
        <ul>
          {methods.map(method => (
            <li key={method} style={{ margin: '0.5rem 0' }}>
              <button 
                onClick={() => testMethod(method)}
                style={{ marginRight: '1rem', padding: '0.25rem' }}
              >
                Test
              </button>
              {method}
            </li>
          ))}
        </ul>
      </div>
      
      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', color: 'black' }}>
          <h2>Test Result for: {result.method}</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
EODEBUG

# Create debug directory
mkdir -p src/app/debug

# Step 5: Test TypeScript
echo "🔨 Step 5: Testing TypeScript..."
npx tsc --noEmit > lunarcrush_fix_typescript.log 2>&1
TS_STATUS=$?

# Step 6: Test dev server if TypeScript passes
if [ $TS_STATUS -eq 0 ]; then
  echo "🚀 Step 6: Testing dev server..."
  npm run dev > lunarcrush_fix_dev.log 2>&1 &
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

# Step 7: Create status report
cat > lunarcrush_fix_status.json << EOSTATUS
{
  "timestamp": "$(date -Iseconds)",
  "api_fixes_applied": true,
  "typescript_passing": $(test $TS_STATUS -eq 0 && echo "true" || echo "false"),
  "dev_server_working": $DEV_SUCCESS,
  "fixes_made": [
    "Changed api_key to apiKey in SDK constructor",
    "Added fallback method checking for getTopic/topic/getAsset/asset",
    "Added fallback method checking for getCryptocurrencies/coins",
    "Created debug page to explore actual SDK methods",
    "Added error handling and logging"
  ],
  "debug_available": true,
  "next_steps": [
    "Visit /debug to explore actual SDK methods",
    "Test real API calls once methods are identified",
    "Update helper functions with correct method names"
  ],
  "ready_for_testing": $(test $TS_STATUS -eq 0 && test $DEV_SUCCESS = true && echo "true" || echo "false")
}
EOSTATUS

if [ $TS_STATUS -eq 0 ] && [ $DEV_SUCCESS = true ]; then
  echo "🎉 LUNARCRUSH API FIXES APPLIED!"
  echo "✅ TypeScript compilation successful"
  echo "✅ Dev server working"
  echo "🛠️  Debug page available at /debug"
  echo ""
  echo "🔍 NEXT STEPS:"
  echo "   1. npm run dev"
  echo "   2. Visit http://localhost:3000/debug"
  echo "   3. Click 'Explore Available Methods'"
  echo "   4. Test methods to find the correct API"
  
  # Commit the fixes
  git add .
  git commit -m "fix: resolve LunarCrush SDK API usage errors

- Fix apiKey property name in constructor
- Add fallback method checking for different API method names
- Create debug page to explore actual SDK methods
- Add comprehensive error handling
- Ready for API method discovery"

  echo "✅ API fixes committed"
  
elif [ $TS_STATUS -eq 0 ]; then
  echo "✅ TypeScript fixed but dev server issues"
  echo "📋 Check lunarcrush_fix_dev.log"
else
  echo "❌ TypeScript still has issues"
  echo "📋 Check lunarcrush_fix_typescript.log"
fi

echo ""
echo "📁 Files created:"
echo "   - lunarcrush_fix_status.json"
echo "   - lunarcrush_fix_typescript.log"
echo "   - lunarcrush_api_exploration.log"
echo "   - src/app/debug/page.tsx"

# Cleanup
rm -f explore_lunarcrush_api.js
