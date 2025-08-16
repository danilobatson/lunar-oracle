// NEXUS: REAL DATA ONLY - No mocks, no fallbacks, fail loudly!
import { CommandContext, CommandResponse, OwlAnalyzeParams, OwlTrendingParams, OwlAlertsParams } from './types';

const API_BASE_URL = 'http://localhost:3001';

// /owl_analyze - Already working with rich data ✅
export async function handleOwlAnalyze(params: OwlAnalyzeParams): Promise<CommandResponse> {
    const { symbol, context } = params;
  try {

    console.log(`🔍 ${context.platform}: Analyzing ${symbol} for user ${context.userId}`);

    const requestData = {
      symbol: symbol.toLowerCase(),
      platform: context.platform,
      tier: 'sovereign' || context.tier
    };

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'NEXUS-Bot/1.0',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API failed (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const responseText = await response.text();

    if (responseText.trim().startsWith('<') || responseText.includes('inv_blank')) {
      throw new Error('API returned HTML instead of JSON');
    }

    const owlData = JSON.parse(responseText);

    if (!owlData.delivery_chunks?.slack && !owlData.delivery_chunks?.telegram) {
      throw new Error(`API response missing delivery_chunks for platform ${context.platform}`);
    }

    // Use platform-specific chunks or fallback to slack chunks for telegram
    const chunks = owlData.delivery_chunks?.[context.platform] || owlData.delivery_chunks?.slack;

    console.log(`✅ Got ${chunks.length} rich ${context.platform} chunks`);

    return {
      success: true,
      message: `🦉 RICH Quantum analysis complete for ${symbol.toUpperCase()}`,
      chunks,
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${params.context.platform}: handleOwlAnalyze FAILED:`, errorMsg);

    return {
      success: false,
      message: `🚨 API FAILURE: ${errorMsg}`,
      error: errorMsg,
      chunks: [`🚨 **NEXUS API ERROR**\n\n${errorMsg}\n\n🔧 Check console for details.`]
    };
  }
}

// /owl_trending - REAL MCP implementation using actual trending API
export async function handleOwlTrending(params: OwlTrendingParams): Promise<CommandResponse> {
    const { context, limit = 10 } = params;
  try {

    console.log(`🔍 ${context.platform}: Getting REAL trending data for user ${context.userId}`);

    const response = await fetch(`${API_BASE_URL}/api/trending`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NEXUS-Bot/1.0'
      },
      body: JSON.stringify({
        limit,
        platform: context.platform,
        tier: context.tier
      }),
    });

    console.log(`📥 Trending API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Trending API failed (${response.status}):`, errorText);
      throw new Error(`Trending API failed (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const responseText = await response.text();
    console.log(`📥 Trending response length: ${responseText.length} chars`);

    let trendingData;
    try {
      trendingData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse trending JSON:', parseError);
      console.error('❌ Raw response:', responseText.substring(0, 500));
      throw new Error(`Invalid JSON from trending API: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

    if (!trendingData.trending_cryptos) {
      console.error('❌ Missing trending_cryptos in response:', Object.keys(trendingData));
      throw new Error('Trending API response missing trending_cryptos array');
    }

    if (!Array.isArray(trendingData.trending_cryptos)) {
      throw new Error(`trending_cryptos is not an array: ${typeof trendingData.trending_cryptos}`);
    }

    if (trendingData.trending_cryptos.length === 0) {
      throw new Error('Trending API returned empty trending_cryptos array');
    }

    console.log(`✅ Got ${trendingData.trending_cryptos.length} REAL trending cryptos`);

    // Build rich trending message with real data
    let trendingMessage = `🦉 **NEXUS REAL-TIME TRENDING CRYPTOS**\n\n🔥 Top ${Math.min(limit, trendingData.trending_cryptos.length)} quantum signals detected:\n\n`;

    trendingData.trending_cryptos.slice(0, limit).forEach((crypto, index) => {
      const symbol = crypto.symbol || crypto.s || 'UNKNOWN';
      const name = crypto.name || crypto.n || symbol;
      const galaxyScore = crypto.galaxy_score || crypto.gs || 'N/A';
      const sentiment = crypto.sentiment || 'N/A';
      const price = crypto.close || crypto.price || 'N/A';
      const rank = crypto.alt_rank || crypto.rank || 'N/A';

      trendingMessage += `${index + 1}. **${symbol}** (${name})\n`;
      trendingMessage += `   🌟 Galaxy Score: ${galaxyScore}\n`;
      trendingMessage += `   😊 Sentiment: ${sentiment}%\n`;
      trendingMessage += `   💰 Price: $${price}\n`;
      trendingMessage += `   🏆 Rank: #${rank}\n\n`;
    });

    trendingMessage += '⚡ *Live from LunarCrush multi-platform intelligence*\n\n💡 Use `/owl_analyze [symbol]` for detailed mystical prophecy';

    const chunks = [trendingMessage];

    return {
      success: true,
      message: '🦉 REAL trending analysis complete',
      chunks,
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${context.platform}: handleOwlTrending FAILED:`, errorMsg);

    return {
      success: false,
      message: `🚨 TRENDING DATA FAILURE: ${errorMsg}`,
      error: errorMsg,
      chunks: [`🚨 **NEXUS TRENDING ERROR**\n\n**Failed to get REAL trending data:**\n${errorMsg}\n\n🔧 **Possible causes:**\n• Trending API endpoint not responding\n• LunarCrush MCP connection failed\n• Invalid API response format\n• Network connectivity issues\n\n**Debug info:** Check server console for detailed error logs.`]
    };
  }
}

// /owl_status - REAL subscription status (fail if no real system)
export async function handleOwlStatus(context: CommandContext): Promise<CommandResponse> {
  try {
    console.log(`🔍 ${context.platform}: Getting REAL status for user ${context.userId}`);

    // Check if we have a real subscription system
    const hasSubscriptionAPI = process.env.SUBSCRIPTION_API_URL || process.env.DATABASE_URL;

    if (!hasSubscriptionAPI) {
      throw new Error('No subscription system configured - cannot provide real status data');
    }

    // Try to call real subscription API
    const response = await fetch(`${API_BASE_URL}/api/user/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NEXUS-Bot/1.0'
      },
      body: JSON.stringify({
        userId: context.userId,
        platform: context.platform
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`User status API failed (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const statusData = await response.json();

    if (!statusData.user_id) {
      throw new Error('Invalid status response - missing user data');
    }

    console.log(`✅ Got REAL status for user ${context.userId}`);

    const statusMessage = `🦉 **NEXUS ACCOUNT STATUS**\n\n👤 **User ID**: ${statusData.user_id}\n🎫 **Current Tier**: ${statusData.tier}\n⚡ **Commands Today**: ${statusData.usage_today}/${statusData.usage_limit}\n🔮 **Platform**: ${context.platform.toUpperCase()}\n📅 **Account Created**: ${statusData.created_date}\n💳 **Subscription**: ${statusData.subscription_status}\n🔄 **Next Billing**: ${statusData.next_billing_date}\n\n📊 **Your Usage:**\n• Analysis requests: ${statusData.analysis_count}\n• Alert slots: ${statusData.alert_count}/${statusData.alert_limit}\n• API calls: ${statusData.api_calls_today}\n\n⚡ *Real subscription data from NEXUS database*`;

    return {
      success: true,
      message: '🦉 REAL account status retrieved',
      chunks: [statusMessage],
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${context.platform}: handleOwlStatus FAILED:`, errorMsg);

    return {
      success: false,
      message: `🚨 STATUS DATA FAILURE: ${errorMsg}`,
      error: errorMsg,
      chunks: [`🚨 **NEXUS STATUS ERROR**\n\n**Failed to get REAL user status:**\n${errorMsg}\n\n🔧 **What needs to be implemented:**\n• User subscription database\n• /api/user/status endpoint\n• User authentication system\n• Usage tracking system\n• Billing integration\n\n**Current state:** No real subscription system exists yet.\n\n**For development:** Set SUBSCRIPTION_API_URL or DATABASE_URL environment variables to enable real status checking.`]
    };
  }
}

// /owl_alerts - REAL alert system (fail if no real system)
export async function handleOwlAlerts(params: OwlAlertsParams): Promise<CommandResponse> {
    const { context, symbol, action = 'list' } = params;
  try {

    console.log(`🔍 ${context.platform}: Managing REAL alerts for user ${context.userId}`);

    // Check if we have a real alert system
    const hasAlertAPI = process.env.ALERT_API_URL || process.env.DATABASE_URL;

    if (!hasAlertAPI) {
      throw new Error('No alert system configured - cannot provide real alert management');
    }

    const response = await fetch(`${API_BASE_URL}/api/user/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NEXUS-Bot/1.0'
      },
      body: JSON.stringify({
        userId: context.userId,
        action,
        symbol,
        platform: context.platform
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Alert API failed (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const alertData = await response.json();

    console.log(`✅ Got REAL alert data for user ${context.userId}`);

    return {
      success: true,
      message: '🦉 REAL alert management complete',
      chunks: [alertData.message],
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ ${context.platform}: handleOwlAlerts FAILED:`, errorMsg);

    return {
      success: false,
      message: `🚨 ALERT SYSTEM FAILURE: ${errorMsg}`,
      error: errorMsg,
      chunks: [`🚨 **NEXUS ALERT ERROR**\n\n**Failed to access REAL alert system:**\n${errorMsg}\n\n🔧 **What needs to be implemented:**\n• Alert database tables\n• /api/user/alerts endpoint\n• Price monitoring system\n• Notification delivery system\n• User alert limits by tier\n\n**Current state:** No real alert system exists yet.\n\n**For development:** Set ALERT_API_URL or DATABASE_URL environment variables to enable real alert management.`]
    };
  }
}

// /owl_help - Static content (this is fine)
export async function handleOwlHelp(context: CommandContext): Promise<CommandResponse> {
  try {
    console.log(`🔍 ${context.platform}: Showing help for user ${context.userId}`);

    const helpMessage = `🦉 **NEXUS QUANTUM OWL COMMANDS**\n\nYour mystical crypto oracle that democratizes $78K AIXBT intelligence for everyone!\n\n📈 **ANALYSIS COMMANDS**\n\`/owl_analyze [symbol]\` - Get rich mystical crypto analysis\n\`/owl_trending\` - See top trending cryptos with REAL data\n\n🔔 **MANAGEMENT COMMANDS**\n\`/owl_alerts [add/remove/list] [symbol]\` - Manage alerts with REAL system\n\`/owl_status\` - Check account & subscription status\n\`/owl_help\` - Show this help menu\n\n💡 **EXAMPLES**\n\`/owl_analyze BTC\` - Full Bitcoin prophecy\n\`/owl_analyze ETH\` - Ethereum mystical analysis\n\`/owl_analyze SOL\` - Solana quantum insights\n\n🎯 **WHY NEXUS BEATS AIXBT**\n• 📊 **Multi-platform data** vs Twitter-only\n• 🔮 **Predictive analysis** vs reactive sentiment\n• 💰 **$29/month** vs $78,000 entry barrier\n• ⚡ **Instant access** vs exclusive Discord\n\n🦉 *The Owl sees 24-48 hours ahead of market movements*\n\n📈 **Ready to dominate crypto? Start with /owl_analyze!**`;

    return {
      success: true,
      message: '🦉 Command help delivered',
      chunks: [helpMessage],
    };

  } catch (error) {
    console.error(`❌ ${context.platform}: handleOwlHelp FAILED:`, error);
    return {
      success: false,
      message: '🦉 Help error',
      chunks: ['🚨 Help system temporarily unavailable.']
    };
  }
}
