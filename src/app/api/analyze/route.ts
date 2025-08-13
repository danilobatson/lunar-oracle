import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
	let client = null;
	try {
		const { symbol } = await request.json();

		// REAL MCP connection
		const apiKey = process.env.LUNARCRUSH_API_KEY;
		const transport = new SSEClientTransport(
			new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
		);
		client = new Client(
			{ name: 'test', version: '1.0.0' },
			{ capabilities: { tools: {} } }
		);
		await client.connect(transport);

		// Authenticate once
		await client.callTool({
			name: 'Authentication',
			arguments: { apiKey: apiKey },
		});

		// Batch multiple tool calls with Promise.all
		console.log(`🚀 Batching 3 tool calls for ${symbol}...`);

		const [topicResult, timeSeriesResult, searchResult] = await Promise.all([
			client.callTool({
				name: 'Topic',
				arguments: { topic: `$${symbol.toLowerCase()}` },
			}),
			client.callTool({
				name: 'Topic_Time_Series',
				arguments: {
					topic: `$${symbol.toLowerCase()}`,
					interval: '1w',
					metrics: ['close', 'interactions', 'sentiment'],
				},
			}),
			client.callTool({
				name: 'Search',
				arguments: {
					query: `${symbol} social sentiment technical analysis price prediction institutional flow`,
				},
			}),
		]);

		console.log('✅ All 3 tool calls completed');

		// PREMIUM ANALYSIS PROMPT - Worth $50-100/month
		const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
		const ai = new GoogleGenAI({ apiKey: geminiApiKey });

		const premiumAnalysisPrompt = `You are a premium cryptocurrency analyst providing $497/month professional analysis.

Analyze ${symbol.toUpperCase()} data and provide actionable insights:

TOPIC DATA: ${JSON.stringify(topicResult, null, 2)}
TIME SERIES DATA: ${JSON.stringify(timeSeriesResult, null, 2)}
SEARCH DATA: ${JSON.stringify(searchResult, null, 2)}

Return valid JSON in this EXACT format:

{
  "symbol": "${symbol.toUpperCase()}",
  "current_price": "extract real price from data",
  "recommendation": "BUY|SELL|HOLD",
  "confidence": 85,
  "reasoning": "Brief analysis based on data",

  "key_metrics": {
    "price": "extract real price",
    "galaxy_score": "extract galaxy score",
    "alt_rank": "extract alt rank",
    "social_dominance": "extract social dominance %",
    "sentiment": "extract sentiment %",
    "volume_24h": "extract volume",
    "market_cap": "extract market cap"
  },

  "institutional_intelligence": {
    "whale_moves": "Extract major institutional purchases/sales from news - look for company names, ETF flows, sovereign funds",
    "corporate_news": "Extract corporate adoption, treasury moves, institutional announcements from news data",
    "smart_money": "Identify institutional signals from high-follower creators and news mentions",
    "etf_activity": "Extract any ETF launch/inflow data from news"
  },

  "viral_intelligence": {
    "trending_story": "Main narrative driving conversations from top engagement posts",
    "influencer_mood": "Sentiment from creators with >100K followers",
    "meme_factor": "HIGH|MEDIUM|LOW viral potential based on engagement",
    "community_energy": "EUPHORIC|BULLISH|NEUTRAL|BEARISH based on sentiment"
  },

  "trading_signals": {
    "entry_zone": "$X,XXX - $X,XXX",
    "stop_loss": "$X,XXX",
    "target_1": "$X,XXX",
    "target_2": "$X,XXX",
    "position_size": "X% of portfolio",
    "timeframe": "X days/weeks"
  },

  "ai_summary": {
    "bulls": ["Key bullish factor 1", "Key bullish factor 2"],
    "bears": ["Key risk 1", "Key risk 2"],
    "catalyst": "Main price driver identified",
    "outlook": "Short summary of price direction"
  }
}

CRITICAL RULES:
- Return ONLY valid JSON - no extra text
- Extract REAL data from the provided MCP results
- Focus on institutional_intelligence and viral_intelligence for premium value
- Keep response under 2000 characters to avoid truncation
- Use actual numbers from the data, not placeholders
`;

		const geminiResponse = await ai.models.generateContent({
			model: 'gemini-2.0-flash-lite',
			contents: premiumAnalysisPrompt,
		});

		const analysisText =
			geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
		console.log('🤖 Raw response length:', analysisText.length);

		try {
			// Extract JSON from response
			const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No JSON found in Gemini response');
			}

			let jsonText = jsonMatch[0];

			// Fix common JSON issues
			if (!jsonText.endsWith('}')) {
				const openBraces = (jsonText.match(/\{/g) || []).length;
				const closeBraces = (jsonText.match(/\}/g) || []).length;
				const missingBraces = openBraces - closeBraces;
				for (let i = 0; i < missingBraces; i++) {
					jsonText += '}';
				}
			}

			// Remove trailing commas
			jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');

			const analysis = JSON.parse(jsonText);

			return NextResponse.json({
				data: analysis,
				success: true,
				raw_data: {
					topic: topicResult,
					time_series: timeSeriesResult,
					search: searchResult,
				},
			});
		} catch (error) {
			console.error('❌ JSON parsing failed:', error.message);
			console.error('❌ Problematic JSON:', analysisText.substring(0, 1000));

			// Throw the error to be handled by main try-catch
			throw new Error(`Gemini response parsing failed: ${error.message}`);
		}
	} catch (error) {
		console.error('Premium analysis error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	} finally {
		if (client) await client.close();
	}
}
