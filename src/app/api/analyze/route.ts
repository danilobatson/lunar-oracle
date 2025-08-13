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
			{ name: 'lunarcrush-premium-intelligence', version: '2.0.0' },
			{ capabilities: { tools: {} } }
		);
		await client.connect(transport);

		// Authenticate once
		await client.callTool({
			name: 'Authentication',
			arguments: { apiKey: apiKey },
		});

		// ENHANCED: Batch 5 comprehensive tool calls for institutional-grade analysis
		console.log(`🏛️ Executing institutional-grade analysis for ${symbol}...`);

		const [
			topicResult,
			timeSeriesResult,
			searchResult,
			// cryptoListResult,
			topPostsResult,
		] = await Promise.all([
			client.callTool({
				name: 'Topic',
				arguments: { topic: `$${symbol.toLowerCase()}` },
			}),
			client.callTool({
				name: 'Topic_Time_Series',
				arguments: {
					topic: `$${symbol.toLowerCase()}`,
					interval: '1w',
					metrics: [
						'close',
						'interactions',
						'sentiment',
						'contributors_active',
						'social_dominance',
					],
				},
			}),
			client.callTool({
				name: 'Search',
				arguments: {
					query: `${symbol} institutional adoption whale movements ETF treasury corporate smart money flow`,
				},
			}),
			// client.callTool({
			// 	name: 'Cryptocurrencies',
			// 	arguments: {
			// 		sort: 'alt_rank',
			// 		limit: 20,
			// 	},
			// }),
			client.callTool({
				name: 'Topic_Posts',
				arguments: {
					topic: `$${symbol.toLowerCase()}`,
					interval: '1w',
				},
			}),
		]);

		console.log(
			'✅ Institutional intelligence gathered from 5 premium data sources'
		);

		// PREMIUM INSTITUTIONAL ANALYSIS PROMPT - Professional Grade
		const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
		const ai = new GoogleGenAI({ apiKey: geminiApiKey });

		const institutionalPrompt = `You are LunarOracle's Senior Institutional Analyst providing premium, luxury professional cryptocurrency intelligence that institutional investors pay Bloomberg Terminal prices for.

MISSION: Transform raw social data into institutional-grade actionable intelligence that beats traditional financial analysis that people pay thousands for. $500+ a month.

=== PREMIUM DATA SOURCES ===
TOPIC INTELLIGENCE: ${JSON.stringify(topicResult, null, 2)}
MARKET DYNAMICS: ${JSON.stringify(timeSeriesResult, null, 2)}
INSTITUTIONAL SIGNALS: ${JSON.stringify(searchResult, null, 2)}
SOCIAL INTELLIGENCE: ${JSON.stringify(topPostsResult, null, 2)}

=== INSTITUTIONAL ANALYSIS FRAMEWORK ===

Your analysis must demonstrate why this costs $500+/month vs free crypto data and competitors:

1. **INSTITUTIONAL INTELLIGENCE**: Extract real institutional movements, corporate adoption signals, ETF activity, treasury purchases from the data
2. **VIRAL PREDICTION ENGINE**: Identify narrative catalysts, meme potential, retail FOMO triggers before they explode
3. **SMART MONEY TRACKING**: Detect high-conviction signals from whale movements and institutional sentiment shifts
4. **SOCIAL SENTIMENT ARBITRAGE**: Find disconnects between social momentum and price action for alpha generation

=== RESPONSE FORMAT ===
Return ONLY valid JSON in this exact structure:

{
  "symbol": "${symbol.toUpperCase()}",
  "current_price": [extract real price from topic data],
  "recommendation": "BUY|SELL|HOLD",
  "confidence": [80-95 for institutional signals, 60-75 for mixed signals],
  "reasoning": "Professional two paragraph analysis focusing on institutional catalysts and social arbitrage opportunities",

  "key_metrics": {
    "price": "[real price with formatting]",
    "galaxy_score": "[extract galaxy score - our competitive moat]",
    "alt_rank": "[extract ranking - relative market position]",
    "social_dominance": "[extract % - attention monopolization]",
    "sentiment": "[extract % - crowd psychology]",
    "volume_24h": "[extract trading volume]",
    "market_cap": "[extract market cap]"
  },

  "institutional_intelligence": {
    "whale_moves": "SPECIFIC institutional activity: MicroStrategy buys, Tesla holdings, sovereign wealth funds, family offices. Extract REAL institutional names and amounts from search data. Max of four sentences.",
    "corporate_news": "ACTIONABLE corporate adoption: Company treasury allocations, payment integrations, partnership announcements. Find REAL corporate moves from the data.Max of four sentences.",
    "smart_money": "HIGH-CONVICTION signals: Analyze creator influence levels, institutional mention patterns, smart money accumulation signals from social intelligence. Max of four sentences.",
    "etf_activity": "ETF ALPHA: New launches, inflow/outflow patterns, institutional ETF adoption, regulatory developments affecting institutional access. Max of four sentences."
  },

  "viral_intelligence": {
    "trending_story": "NARRATIVE CATALYST driving conversations - extract the dominant storyline from top posts that could trigger retail FOMO. Max of four sentences.",
    "influencer_mood": "SENTIMENT ANALYSIS from high-follower creators and institutional voices - bullish/bearish consensus among smart money. Max of four sentences.",
    "meme_factor": "VIRAL POTENTIAL: HIGH|MEDIUM|LOW based on engagement velocity, narrative simplicity, and retail accessibility. Max of four sentences.",
    "community_energy": "CROWD PSYCHOLOGY: EUPHORIC|BULLISH|NEUTRAL|BEARISH based on sentiment trends and social momentum. Max of four sentences."
  },

  "trading_signals": {
    "entry_zone": "$[price - 3%] - $[price + 2%] based on institutional support levels",
    "stop_loss": "$[price - 8%] below institutional accumulation zone",
    "target_1": "$[price + 15%] institutional momentum target",
    "target_2": "$[price + 35%] viral narrative completion target",
    "position_size": "[2-5%] of portfolio based on confidence level",
    "timeframe": "[2-8] weeks for institutional catalyst completion"
  },

  "ai_summary": {
    "bulls": [
      "Institutional catalyst: [specific institutional development]",
      "Social arbitrage: [social momentum vs price disconnect]",
      "Technical confluence: [technical + social alignment]"
    ],
    "bears": [
      "Institutional risk: [regulatory, adoption, or sentiment risk]",
      "Social fatigue: [narrative exhaustion or sentiment reversal risk]"
    ],
    "catalyst": "One paragraph summary of the primary institutional or viral catalyst most likely to drive the next major price movement.",
    "outlook": "One paragraph professional outlook balancing institutional adoption timeline with social sentiment cycles."
  }
}

=== CRITICAL REQUIREMENTS ===
- Extract REAL data from provided sources - no generic statements
- Focus on INSTITUTIONAL differentiation - why this analysis beats free crypto sites and competitors
- Identify SOCIAL ARBITRAGE opportunities - sentiment/price disconnects
- Demonstrate PREMIUM VALUE - actionable alpha generation insights
- Keep total response under 3500 characters to prevent truncation
- Return ONLY the JSON object - no additional text

Transform this raw data into institutional-grade intelligence that justifies premium pricing through actionable alpha generation.`;

		const geminiResponse = await ai.models.generateContent({
			model: 'gemini-2.0-flash-lite',
			contents: institutionalPrompt,
		});

		const analysisText =
			geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
		console.log(
			'🏛️ Premium institutional analysis generated:',
			analysisText.length,
			'characters'
		);

		try {
			// Extract JSON from response
			const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error('No JSON found in institutional analysis');
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

			// Remove trailing commas and fix common issues
			jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');

			const analysis = JSON.parse(jsonText);

			// ENHANCED: Add premium metadata to show institutional-grade processing
			return NextResponse.json({
				...analysis,
				metadata: {
					analysis_type: 'institutional_grade',
					data_sources: 5,
					processing_time: Date.now(),
					premium_features: [
						'institutional_whale_tracking',
						'viral_narrative_prediction',
						'social_sentiment_arbitrage',
						'smart_money_signals',
					],
				},
				raw_intelligence: {
					topic_data: topicResult,
					market_dynamics: timeSeriesResult,
					institutional_signals: searchResult,
					social_posts: topPostsResult,
				},
			});
		} catch (error) {
			const errMsg = error instanceof Error ? error.message : String(error);
			console.error('❌ Premium analysis parsing failed:', errMsg);
			console.error('❌ Response sample:', analysisText.substring(0, 500));

			throw new Error(
				`Premium institutional analysis failed: ${errMsg}`
			);
		}
	} catch (error) {
		console.error('🚨 Institutional intelligence system error:', error);
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : String(error),
				type: 'institutional_analysis_error',
			},
			{ status: 500 }
		);
	} finally {
		if (client) await client.close();
	}
}
