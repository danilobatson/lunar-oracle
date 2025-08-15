// NEXUS: Shared Command Handlers - Updated for underscore format
import { CommandContext, CommandResponse, OwlAnalyzeParams, OwlTrendingParams, OwlAlertsParams } from './types';

const API_BASE_URL =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:3001'
		: 'http://localhost:3001';

// /owl_analyze - Rich analysis (same handler, updated examples)
export async function handleOwlAnalyze(params: OwlAnalyzeParams): Promise<CommandResponse> {
  try {
    const { symbol, context } = params;

    console.log(`🔍 ${context.platform}: Analyzing ${symbol} for user ${context.userId}`);

    const requestData = {
      symbol: symbol.toLowerCase(),
      platform: context.platform,
      tier: 'sovereign' || context.tier
    };

    console.log(`📤 API Request:`, JSON.stringify(requestData, null, 2));

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

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API failed (${response.status}): ${errorText.substring(0, 200)}`);
    }

    const responseText = await response.text();

    if (responseText.trim().startsWith('<') || responseText.includes('inv_blank')) {
      throw new Error(`API returned HTML instead of JSON`);
    }

    const owlData = JSON.parse(responseText);

    if (!owlData.delivery_chunks?.[context.platform]) {
      throw new Error(`API response missing delivery_chunks.${context.platform}`);
    }

    const chunks = owlData.delivery_chunks[context.platform];

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

// Other handlers remain the same, just updated help text
export async function handleOwlTrending(params: OwlTrendingParams): Promise<CommandResponse> {
  const { context } = params;

  console.log(`🔍 ${context.platform}: Getting REAL trending data for user ${context.userId}`);

  const comingSoonMessage = `🦉 **NEXUS TRENDING CRYPTOS**\n\n🚧 **Coming Soon!** This will show:\n\n• Real-time social momentum leaders\n• Viral narrative catalysts\n• Institutional accumulation signals\n• Meme coin explosion alerts\n\n💡 For now, try \`/owl_analyze BTC\` for detailed analysis\n\n⚡ *Building the trend detection engine...*`;

  return {
    success: true,
    message: '🦉 Trending system in development',
    chunks: [comingSoonMessage],
  };
}

export async function handleOwlAlerts(params: OwlAlertsParams): Promise<CommandResponse> {
  const { context } = params;

  console.log(`🔍 ${context.platform}: Managing alerts for user ${context.userId}`);

  const alertMessage = `🦉 **NEXUS ALERT SYSTEM**\n\n🚧 **Setting Up Premium Alerts...**\n\n🔔 **Coming Features:**\n• Price target alerts ($BTC hits $130K)\n• Social momentum spikes\n• Whale movement notifications\n• Viral trend early warnings\n\n💡 **Usage Preview:**\n\`/owl_alerts add BTC 130000\` - Alert when BTC hits $130K\n\`/owl_alerts remove BTC\` - Stop monitoring\n\`/owl_alerts list\` - Show your alerts\n\n🎫 **Tier Requirements:**\n• Free: 1 alert\n• Owl ($29/mo): 10 alerts\n• Quantum ($97/mo): Unlimited alerts\n\n⚡ *Database integration coming soon...*`;

  return {
    success: true,
    message: '🦉 Alert system in development',
    chunks: [alertMessage],
  };
}

export async function handleOwlStatus(context: CommandContext): Promise<CommandResponse> {
  console.log(`🔍 ${context.platform}: Getting status for user ${context.userId}`);

  const devMode = process.env.NODE_ENV === 'development';

  const statusMessage = `🦉 **NEXUS ACCOUNT STATUS**\n\n👤 **User ID**: ${context.userId}\n🎫 **Current Tier**: ${devMode ? 'SOVEREIGN (Dev Mode)' : context.tier.toUpperCase()}\n⚡ **Commands Today**: ${devMode ? 'Unlimited' : '8/10'}\n🔮 **Platform**: ${context.platform.toUpperCase()}\n\n${devMode ?
    '🛠️ **DEVELOPMENT MODE**\nFull access to all features for testing' :
    '💎 **UPGRADE BENEFITS**\n• Owl ($29/mo) - Unlimited analysis\n• Quantum ($97/mo) - Multi-asset + alerts\n• Oracle ($297/mo) - Portfolio integration'
  }\n\n📊 **Your Usage:**\n• Analysis requests: ${devMode ? 'Unlimited' : '8 today'}\n• Alert slots: ${devMode ? 'Unlimited' : '0/1'}\n• API access: ${devMode ? 'Full' : 'Limited'}\n\n⚡ *The Owl sees your potential...*`;

  return {
    success: true,
    message: '🦉 Account status retrieved',
    chunks: [statusMessage],
  };
}

// Updated help with underscore commands
export async function handleOwlHelp(context: CommandContext): Promise<CommandResponse> {
  console.log(`🔍 ${context.platform}: Showing help for user ${context.userId}`);

  const helpMessage = `🦉 **NEXUS QUANTUM OWL COMMANDS**\n\nYour mystical crypto oracle that democratizes $78K AIXBT intelligence for everyone!\n\n📈 **ANALYSIS COMMANDS**\n\`/owl_analyze [symbol]\` - Get rich mystical crypto analysis\n\`/owl_trending\` - See top trending cryptos (coming soon)\n\n🔔 **ALERT COMMANDS**\n\`/owl_alerts [add/remove/list] [symbol]\` - Manage alerts (coming soon)\n\`/owl_status\` - Check account & subscription status\n\`/owl_help\` - Show this help menu\n\n💡 **EXAMPLES**\n\`/owl_analyze BTC\` - Full Bitcoin prophecy\n\`/owl_analyze ETH\` - Ethereum mystical analysis\n\`/owl_analyze SOL\` - Solana quantum insights\n\n🎯 **WHY NEXUS BEATS AIXBT**\n• 📊 **Multi-platform data** vs Twitter-only\n• 🔮 **Predictive analysis** vs reactive sentiment\n• 💰 **$29/month** vs $78,000 entry barrier\n• ⚡ **Instant access** vs exclusive Discord\n\n🦉 *The Owl sees 24-48 hours ahead of market movements*\n\n📈 **Ready to dominate crypto? Start with /owl_analyze!**`;

  return {
    success: true,
    message: '🦉 Command help delivered',
    chunks: [helpMessage],
  };
}
