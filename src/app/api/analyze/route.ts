import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  let client = null;
  try {
    const { symbol, platform = 'web', tier = 'free' } = await request.json();

    // REAL MCP connection (keeping your working integration)
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    const transport = new SSEClientTransport(
      new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
    );
    client = new Client(
      { name: 'nexus-quantum-owl', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );
    await client.connect(transport);

    // Authenticate
    await client.callTool({
      name: 'Authentication',
      arguments: { apiKey: apiKey },
    });

    console.log(`🦉 The Quantum Owl awakens to analyze ${symbol}...`);

    // Enhanced data gathering (keeping your working approach)
    const [topicResult, timeSeriesResult, searchResult, topPostsResult] =
      await Promise.all([
        client.callTool({
          name: 'Topic',
          arguments: { topic: `$${symbol.toLowerCase()}` },
        }),
        client.callTool({
          name: 'Topic_Time_Series',
          arguments: {
            topic: `$${symbol.toLowerCase()}`,
            interval: '1w',
            metrics: ['close', 'interactions', 'sentiment', 'contributors_active', 'social_dominance'],
          },
        }),
        client.callTool({
          name: 'Search',
          arguments: {
            query: `${symbol} whale movements institutional adoption viral trends meme potential retail FOMO`,
          },
        }),
        client.callTool({
          name: 'Topic_Posts',
          arguments: {
            topic: `$${symbol.toLowerCase()}`,
            interval: '1w',
          },
        }),
      ]);

    console.log('✨ Quantum intelligence gathered from 4 mystical sources');

    // RICH QUANTUM OWL PROMPT - Extract ALL the valuable data
    const geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });

    const richQuantumPrompt = `You are the NEXUS Quantum Owl - a mystical oracle that transforms raw institutional data into premium crypto intelligence worth $297/month. You have 410K+ characters of REAL LunarCrush data.

🔮 MISSION: Create RICH, detailed chunks that justify premium pricing. Each chunk should be substantial, actionable, and mystical.

📊 REAL LUNARCRUSH DATA TO ANALYZE:
TOPIC INTELLIGENCE: ${JSON.stringify(topicResult, null, 2)}
TIME SERIES PATTERNS: ${JSON.stringify(timeSeriesResult, null, 2)}
INSTITUTIONAL SIGNALS: ${JSON.stringify(searchResult, null, 2)}
SOCIAL PROPHECY: ${JSON.stringify(topPostsResult, null, 2)}

🎯 EXTRACT THESE REAL VALUES:
- Current price from topic data (exact number)
- Galaxy Score (LunarCrush exclusive metric)
- Social sentiment percentage
- Real institutional moves from search data
- Specific social posts and engagement metrics
- Actual trading volume and market cap

⚡ CRITICAL: Use REAL data from the sources above. No generic statements!

📱 SLACK CHUNKS - Each 800-1200 characters, rich and detailed:

Return ONLY this JSON structure:

{
  "symbol": "${symbol.toUpperCase()}",
  "price": "[EXTRACT exact price from topic data]",
  "prediction": "[BUY/SELL/HOLD based on real data analysis]",
  "confidence": [60-95 based on data strength],

  "oracle_vision": {
    "headline": "🦉 The Owl perceives [specific prediction] as [real catalyst] drives quantum convergence to $[target] within [timeframe]",
    "reasoning": "Extract the PRIMARY catalyst from real search/social data. Use mystical language but reference specific institutional moves, social momentum shifts, or technical confluences found in the data.",
    "price_target": "Quantum algorithms detect convergence patterns pointing to $[specific target] by [specific timeframe] based on [real data pattern]"
  },

  "quantum_signals": {
    "primary_catalyst": "🎯 CATALYST: [Extract specific institutional event, regulatory news, or social trend from search data]. [Explain impact using real metrics].",
    "whale_activity": "🐋 WHALES: [Extract actual institutional mentions, volumes, or smart money moves from data]. [Quantify the activity].",
    "social_momentum": "📈 VIRAL: [Use real social metrics - mentions, sentiment %, engagement trends]. [Predict retail FOMO based on data].",
    "risk_warning": "⚠️ CAUTION: [Identify real risk from data - high volatility, negative sentiment trends, or bearish signals]. [Quantify the risk]."
  },

  "trading_wisdom": {
    "entry_strategy": "🎪 ENTRY: [Specific entry based on real support levels from data]. [Reference actual volume or sentiment thresholds].",
    "position_size": "💰 ALLOCATION: [X]% portfolio allocation based on confidence level and real volatility metrics from data.",
    "exit_targets": "🎯 TARGETS: $[target1] (+[%]) and $[target2] (+[%]) based on [real resistance levels or momentum patterns].",
    "stop_loss": "🛡️ PROTECTION: Exit below $[stop] (-[%]) if [specific invalidation condition from data]."
  },

  "delivery_chunks": {
    "slack": [
      "🦉 **NEXUS QUANTUM OWL PROPHECY**\\n\\n**${symbol.toUpperCase()}**: $[real price]\\n📈 **[PREDICTION]** - [confidence]% Mystical Certainty\\n\\n🔮 **The Oracle's Vision:**\\n[Extract the most compelling narrative from search/social data. Make it mystical but reference real events, institutional moves, or viral trends. 2-3 detailed sentences.]\\n\\n⚡ *Premium intelligence that AIXBT's $78K system cannot match*",

      "🧙‍♂️ **INSTITUTIONAL INTELLIGENCE**\\n\\n🐋 **Whale Movements**: [Extract real institutional activity from search data]\\n\\n📊 **Social Dominance**: [Real %] of crypto conversations\\n🎯 **Galaxy Score**: [Real score]/100 (LunarCrush exclusive)\\n💬 **Sentiment**: [Real %] bullish momentum\\n\\n🎪 **Entry Strategy**: [Specific entry based on real data]\\n💰 **Position Size**: [X]% portfolio allocation",

      "⚡ **QUANTUM TRADING SIGNALS**\\n\\n🎯 **Primary Catalyst**: [Real catalyst from data]\\n📈 **Price Targets**: $[target1] and $[target2]\\n🛡️ **Stop Loss**: $[stop level]\\n⏰ **Timeframe**: [X] weeks\\n\\n🔮 **Mystical Outlook**: [Synthesize the data into a forward-looking prediction. Reference real trends, institutional adoption, or social momentum. Make it premium-worthy.]\\n\\n*🦉 The Owl sees beyond AIXBT's reactive analysis*"
    ],
    "telegram": [
      "[Similar 3-chunk structure as delivery_chunks.slack for Telegram's 4096 char limit]"
    ],
    "discord": [
      "[Similar 3-chunk structure optimized for Discord's 2000 char limit]"
    ],
    "summary": "🦉 ${symbol.toUpperCase()} [PREDICTION] - $[target] target ([confidence]% confidence) - [primary catalyst]"
  },

  "owl_metadata": {
    "vision_time": "The Owl perceives quantum patterns [X] hours before market realization",
    "confidence_phrase": "[Crystal clarity|Quantum certainty|Mystical convergence|Faint whispers] based on confidence",
    "mystical_emoji": "🦉✨🔮⚡",
    "comparison_to_aixbt": "NEXUS predicted this [X]h before AIXBT's $78K system could react"
  }
}

🚨 CRITICAL REQUIREMENTS:
- Use REAL data only - extract actual prices, metrics, institutional moves
- Each Slack chunk must be 800-1200 characters (rich and detailed)
- Reference specific LunarCrush metrics (Galaxy Score, Social Dominance)
- Make it mystical but actionable and premium-worthy
- No generic statements - everything must be data-driven
- Justify the $297/month premium over free crypto sites

Transform this massive dataset into mystical oracle wisdom worth premium pricing!`;

    console.log('🔮 Sending RICH data extraction prompt to Gemini...');

    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: richQuantumPrompt,
    });

    const analysisText = geminiResponse.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    console.log('📄 Gemini response length:', analysisText.length, 'characters');

    let owlProphecy;

    try {
      // Extract JSON from response
      const cleanedResponse = analysisText.replace(/```json|```/g, '').trim();
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      owlProphecy = JSON.parse(jsonMatch[0]);
      console.log('✅ Gemini JSON parsing: SUCCESS');

      // Validate rich chunks
      const slackChunks = owlProphecy.delivery_chunks?.slack;
      if (!slackChunks || slackChunks.length < 3) {
        throw new Error(`Expected 3 rich Slack chunks, got ${slackChunks?.length || 0}`);
      }

      slackChunks.forEach((chunk, i) => {
        if (chunk.length < 400) {
          console.warn(`⚠️ Chunk ${i+1} too short: ${chunk.length} chars`);
        } else {
          console.log(`✅ Chunk ${i+1}: ${chunk.length} chars (rich)`);
        }
      });

    } catch (parseError) {
      console.log('⚠️ Gemini JSON parsing failed, this should not happen with rich data');
      throw new Error(`Failed to parse Gemini response: ${parseError.message}`);
    }

    // Build final response with metadata
    const enhancedResponse = {
      ...owlProphecy,
      metadata: {
        analysis_type: 'quantum_owl_prophecy',
        platform_optimized: platform,
        subscription_tier: tier,
        prediction_timestamp: new Date().toISOString(),
        sources_analyzed: 4,
        data_richness: 'premium_institutional_grade',
        advantage_over_aixbt: 'Predictive vs reactive, 2689x cheaper access',
      },
      raw_intelligence: {
        topic_data: topicResult,
        time_series: timeSeriesResult,
        search_signals: searchResult,
        social_posts: topPostsResult,
      }
    };

    console.log('🦉 RICH Quantum Owl prophecy ready for delivery');
    return NextResponse.json(enhancedResponse);

  } catch (error) {
    console.error('⚡ NEXUS Quantum system error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        type: 'quantum_owl_error',
        message: 'The Owl\'s vision is temporarily clouded. Please try again.',
      },
      { status: 500 }
    );
  } finally {
    if (client) await client.close();
  }
}
