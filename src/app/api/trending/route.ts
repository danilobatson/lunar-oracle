import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export async function POST(request: NextRequest) {
  let client = null;
  try {
    const { limit = 10, platform = 'telegram', tier = 'free' } = await request.json();

    // REAL MCP connection for trending data
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    const transport = new SSEClientTransport(
      new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
    );
    client = new Client(
      { name: 'nexus-trending-owl', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    await client.connect(transport);

    await client.callTool({
      name: 'Authentication',
      arguments: { apiKey: apiKey },
    });

    console.log(`🔥 Getting top ${limit} trending cryptos...`);

    // Get trending cryptocurrencies using MCP
    const cryptoListResult = await client.callTool({
      name: 'Cryptocurrencies',
      arguments: {
        sort: 'interactions',
        limit: limit,
      },
    });

    console.log('✅ Got trending crypto data from MCP');
    console.log('🔍 MCP Response structure:', typeof cryptoListResult);
    console.log('🔍 MCP Response keys:', Object.keys(cryptoListResult || {}));
    console.log('🔍 Raw MCP Response:', JSON.stringify(cryptoListResult, null, 2).substring(0, 1000));

    // Handle different possible response structures
    let cryptos = [];

    if (cryptoListResult && typeof cryptoListResult === 'object') {
      // Try different possible data locations
      if (Array.isArray(cryptoListResult.data)) {
        cryptos = cryptoListResult.data;
      } else if (Array.isArray(cryptoListResult.result)) {
        cryptos = cryptoListResult.result;
      } else if (Array.isArray(cryptoListResult.content)) {
        cryptos = cryptoListResult.content;
      } else if (Array.isArray(cryptoListResult.cryptocurrencies)) {
        cryptos = cryptoListResult.cryptocurrencies;
      } else if (Array.isArray(cryptoListResult)) {
        cryptos = cryptoListResult;
      } else {
        console.log('❌ Could not find crypto array in MCP response');
        console.log('📄 Full response structure:');
        console.log(JSON.stringify(cryptoListResult, null, 2));

        // Return the response as-is for debugging
        return NextResponse.json({
          error: 'Unable to parse MCP response',
          debug_info: {
            response_type: typeof cryptoListResult,
            response_keys: Object.keys(cryptoListResult || {}),
            raw_response: cryptoListResult,
          },
          trending_cryptos: [],
          trending_message: '🚨 MCP data parsing failed - check debug_info'
        });
      }
    }

    console.log(`📊 Found ${cryptos.length} cryptos in MCP response`);

    if (cryptos.length === 0) {
      return NextResponse.json({
        error: 'MCP returned empty crypto list',
        debug_info: {
          mcp_response: cryptoListResult,
          response_type: typeof cryptoListResult,
          response_keys: Object.keys(cryptoListResult || {}),
        },
        trending_cryptos: [],
        trending_message: '🚨 No trending cryptos found in MCP response'
      });
    }

    // Format trending data for platform with real data
    let trendingMessage = `🦉 **NEXUS REAL-TIME TRENDING CRYPTOS**\n\n🔥 Top ${Math.min(limit, cryptos.length)} quantum signals detected:\n\n`;

    cryptos.slice(0, limit).forEach((crypto, index) => {
      console.log(`🔍 Processing crypto ${index + 1}:`, JSON.stringify(crypto, null, 2).substring(0, 200));

      // Handle different possible field names
      const symbol = crypto.symbol || crypto.s || crypto.name || crypto.ticker || 'UNKNOWN';
      const name = crypto.name || crypto.n || crypto.full_name || symbol;
      const galaxyScore = crypto.galaxy_score || crypto.gs || crypto.score || 'N/A';
      const sentiment = crypto.sentiment || crypto.sentiment_score || 'N/A';
      const price = crypto.close || crypto.price || crypto.current_price || crypto.last_price || 'N/A';
      const rank = crypto.alt_rank || crypto.rank || crypto.market_cap_rank || (index + 1);
      const marketCap = crypto.market_cap || crypto.mc || 'N/A';
      const volume = crypto.volume_24h || crypto.volume || crypto.vol_24h || 'N/A';

      trendingMessage += `${index + 1}. **${symbol.toUpperCase()}** (${name})\n`;
      trendingMessage += `   🌟 Galaxy Score: ${galaxyScore}\n`;
      trendingMessage += `   😊 Sentiment: ${sentiment}${typeof sentiment === 'number' ? '%' : ''}\n`;
      trendingMessage += `   💰 Price: $${typeof price === 'number' ? price.toLocaleString() : price}\n`;
      trendingMessage += `   🏆 Rank: #${rank}\n`;
      if (marketCap !== 'N/A') {
        trendingMessage += `   📊 Market Cap: $${typeof marketCap === 'number' ? marketCap.toLocaleString() : marketCap}\n`;
      }
      trendingMessage += '\n';
    });

    trendingMessage += `⚡ *Live from LunarCrush multi-platform intelligence*\n\n💡 Use \`/owl-analyze [symbol]\` for detailed mystical prophecy`;

    const response = {
      trending_cryptos: cryptos,
      trending_message: trendingMessage,
      metadata: {
        source: 'lunarcrush_mcp',
        limit: limit,
        sort: 'galaxy_score',
        platform: platform,
        timestamp: new Date().toISOString(),
        cryptos_found: cryptos.length,
        mcp_response_type: typeof cryptoListResult,
        mcp_response_keys: Object.keys(cryptoListResult || {}),
      }
    };

    console.log(`✅ Returning ${cryptos.length} trending cryptos`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Trending API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        type: 'trending_error',
        debug_info: {
          error_details: error instanceof Error ? error.stack : String(error),
          timestamp: new Date().toISOString(),
        }
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
