import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

export async function POST(request: NextRequest) {
  let client = null;
  try {
    const { limit = 10, platform = 'slack', tier = 'free' } = await request.json();

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
        sort: 'galaxy_score', // Use LunarCrush's exclusive metric
        limit: limit,
      },
    });

    console.log('✅ Got trending crypto data from MCP');

    // Format trending data for platform
    const cryptos = cryptoListResult.data || [];

    let trendingMessage = `🔥 **Top ${limit} Quantum Signals Detected:**\n\n`;

    cryptos.slice(0, limit).forEach((crypto, index) => {
      const symbol = crypto.symbol || crypto.s || 'UNKNOWN';
      const name = crypto.name || crypto.n || symbol;
      const galaxyScore = crypto.galaxy_score || crypto.gs || 'N/A';
      const sentiment = crypto.sentiment || 'N/A';
      const price = crypto.close || crypto.price || 'N/A';

      trendingMessage += `${index + 1}. **${symbol}** (${name})\n`;
      trendingMessage += `   🌟 Galaxy Score: ${galaxyScore}\n`;
      trendingMessage += `   😊 Sentiment: ${sentiment}%\n`;
      trendingMessage += `   💰 Price: $${price}\n\n`;
    });

    trendingMessage += `⚡ *Updated live from LunarCrush multi-platform intelligence*`;

    const response = {
      trending_cryptos: cryptos,
      trending_message: trendingMessage,
      metadata: {
        source: 'lunarcrush_mcp',
        limit: limit,
        sort: 'galaxy_score',
        platform: platform,
        timestamp: new Date().toISOString(),
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Trending API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        type: 'trending_error',
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
