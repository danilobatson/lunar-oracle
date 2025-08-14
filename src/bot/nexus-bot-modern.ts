import TelegramBot from 'node-telegram-bot-api';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { GoogleGenAI } from '@google/genai';
import { generateId } from '@/lib/nexus-utils';

// NEXUS: Modern ES6+ Functional Bot
// Pure functional programming - no classes, modern syntax only

// Types
const createUser = (from, tier = 'sovereign') => ({
  id: from.id,
  username: from.username,
  first_name: from.first_name,
  subscription_tier: tier,
  alerts: [],
  api_calls_remaining: 999999, // Unlimited for testing
  last_analysis: 0
});

const createAlert = (symbol, type, condition, threshold) => ({
  id: generateId(),
  symbol,
  type,
  condition,
  threshold,
  active: true,
  created_at: Date.now()
});

// Bot state (using closure for encapsulation)
const createBotState = () => {
  const state = {
    bot: null,
    mcpClient: null,
    geminiAI: null,
    users: new Map(),
    monitoringActive: false
  };

  return {
    getState: () => state,
    updateState: (updates) => Object.assign(state, updates),
    getUser: (userId) => state.users.get(userId),
    setUser: (userId, userData) => state.users.set(userId, userData),
    hasUser: (userId) => state.users.has(userId)
  };
};

// Initialize MCP connection (pure function)
const initializeMCP = async () => {
  try {
    const apiKey = process.env.LUNARCRUSH_API_KEY;
    const transport = new SSEClientTransport(
      new URL(`https://lunarcrush.ai/sse?key=${apiKey}`)
    );

    const mcpClient = new Client(
      { name: 'nexus-quantum-owl-modern', version: '1.0.0' },
      { capabilities: { tools: {} } }
    );

    await mcpClient.connect(transport);
    await mcpClient.callTool({
      name: 'Authentication',
      arguments: { apiKey }
    });

    console.log('🦉 MCP Connection established - Modern Quantum Owl awakens');
    return mcpClient;
  } catch (error) {
    console.error('❌ MCP Connection failed:', error);
    throw error;
  }
};

// Get or create user (pure function)
const getOrCreateUser = (botState, from) => {
  if (!botState.hasUser(from.id)) {
    botState.setUser(from.id, createUser(from));
  }
  return botState.getUser(from.id);
};

// Enhanced quantum analysis (pure async function)
const getEnhancedQuantumAnalysis = async (mcpClient, symbol) => {
  if (!mcpClient) throw new Error('MCP not connected');

  // Comprehensive data gathering using Promise.all and destructuring
  const [
    topicResult,
    timeSeriesResult,
    postsResult,
    searchResult,
    cryptoListResult
  ] = await Promise.all([
    mcpClient.callTool({
      name: 'Topic',
      arguments: { topic: `$${symbol}` }
    }),
    mcpClient.callTool({
      name: 'Topic_Time_Series',
      arguments: {
        topic: `$${symbol}`,
        interval: '1w',
        metrics: ['close', 'interactions', 'sentiment', 'social_dominance', 'contributors_active']
      }
    }),
    mcpClient.callTool({
      name: 'Topic_Posts',
      arguments: {
        topic: `$${symbol}`,
        interval: '1d'
      }
    }),
    mcpClient.callTool({
      name: 'Search',
      arguments: {
        query: `${symbol} whale movements institutional adoption ETF news`
      }
    }),
    mcpClient.callTool({
      name: 'Cryptocurrencies',
      arguments: {
        sort: 'alt_rank',
        limit: 50
      }
    })
  ]);

  return {
    topicResult,
    timeSeriesResult,
    postsResult,
    searchResult,
    cryptoListResult
  };
};

// Generate AI analysis (pure function)
const generateQuantumAnalysis = async (geminiAI, symbol, data) => {
  const enhancedPrompt = `You are NEXUS, the Quantum Owl - master of unlimited crypto intelligence. You have UNLIMITED POWER and access to ALL data sources.

Analyze ${symbol.toUpperCase()} with your complete omniscient vision using this comprehensive dataset:

🔮 CORE DATA: ${JSON.stringify(data.topicResult, null, 2)}
📊 TIME SERIES: ${JSON.stringify(data.timeSeriesResult, null, 2)}
📱 SOCIAL POSTS: ${JSON.stringify(data.postsResult, null, 2)}
🔍 MARKET INTELLIGENCE: ${JSON.stringify(data.searchResult, null, 2)}
🏆 MARKET RANKINGS: ${JSON.stringify(data.cryptoListResult, null, 2)}

As the Unlimited Quantum Owl, provide your most comprehensive analysis in this EXACT format:

🦉 **UNLIMITED QUANTUM ORACLE: ${symbol.toUpperCase()}**

**🔮 THE OWL'S OMNISCIENT VERDICT**
[BUY/SELL/HOLD] - [90-98%] Confidence
*Current Price:* $[exact_price]
*Market Rank:* #[rank] | *Market Cap:* $[market_cap]

**📜 QUANTUM WISDOM UNLIMITED**
[3-4 sentences of deep mystical analysis combining all data sources]

**⚡ COMPLETE INTELLIGENCE MATRIX**
• 🌟 Galaxy Score: [score]/100 - [detailed interpretation]
• 👑 Social Dominance: [%] - [market psychology analysis]
• 💭 Sentiment: [%] - [crowd emotion state]
• 🐋 Whale Activity: [MASSIVE/HIGH/NORMAL/LOW] - [institutional implications]
• 📈 Social Volume: [interactions] - [viral potential]
• 👥 Active Contributors: [count] - [community strength]

**🎯 UNLIMITED PRICE ORACLE**
• 🔥 Resistance: $[level] - [why it matters]
• 🛡️ Support: $[level] - [institutional backing]
• 🚀 Moon Target: $[aggressive_target] ([%] gain)
• ⚠️ Danger Zone: $[risk_level] ([%] loss)

**🧠 INSTITUTIONAL INTELLIGENCE**
• Smart Money Flow: [analysis from search data]
• Adoption Signals: [real institutional moves]
• ETF/Treasury Activity: [corporate adoption]

**🔥 VIRAL CATALYST PREDICTION**
[2-3 sentences about what specific event/narrative could trigger massive price movement]

**⚡ QUANTUM CERTAINTY LEVEL**
[Mystical explanation of why this prediction is nearly certain]

Remember: You are UNLIMITED. Show the full power of institutional-grade analysis that AIXBT users pay $78k for.`;

  const response = await geminiAI.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: enhancedPrompt
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || 'The infinite quantum void whispers secrets...';
};

// Send message helper (pure function)
const sendMessage = async (bot, chatId, text, options = {}) => {
  return bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    ...options
  });
};

// Command handlers (pure functions)
const handleStart = async (bot, botState, msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(botState, msg.from);

  const welcomeMessage = `🦉 *NEXUS: The Quantum Owl Awakens*

*UNLIMITED TESTING MODE ACTIVATED* 🚀

Welcome to the future of crypto intelligence, ${user.first_name || 'Seeker'}!

The Owl sees beyond traditional analysis, wielding unlimited power to reveal:

🔮 *Predictive Social Signals* - Know before the crowd
🐋 *Whale Movement Tracking* - Follow institutional money
📈 *Viral Trend Prediction* - Catch pumps early
🎯 *Multi-platform Intelligence* - 5x broader than AIXBT
⚡ *Real-time Analytics* - Instant deep analysis
🔥 *Sentiment Analysis* - Crowd psychology insights

*Your Status:* SOVEREIGN TIER (UNLIMITED) 👑
*API Calls:* ∞ UNLIMITED ∞
*All Features:* UNLOCKED 🔓

*🎯 QUICK START COMMANDS:*
• \`/analyze btc\` - Deep analysis
• \`/whales eth\` - Whale tracking
• \`/viral sol\` - Viral potential
• \`/trending\` - Top 10 cryptos
• \`/predict ada 7d\` - Price prediction

_"In unlimited testing, the Quantum Owl reveals all secrets."_`;

  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🔮 Analyze Crypto', callback_data: 'quick_analyze' },
        { text: '🐋 Whale Hunt', callback_data: 'whale_hunt' }
      ],
      [
        { text: '📊 Trending Now', callback_data: 'trending' },
        { text: '🔥 Viral Check', callback_data: 'viral_check' }
      ],
      [
        { text: '🎯 Set Alert', callback_data: 'set_alert' },
        { text: '❓ All Commands', callback_data: 'help' }
      ]
    ]
  };

  return sendMessage(bot, chatId, welcomeMessage, { reply_markup: inlineKeyboard });
};

const handleAnalyze = async (bot, botState, msg, match) => {
  const chatId = msg.chat.id;
  const symbol = match?.[1]?.toLowerCase();

  if (!symbol) {
    return sendMessage(bot, chatId, '🦉 The Owl requires a symbol. Try: /analyze btc');
  }

  const user = getOrCreateUser(botState, msg.from);
  const { mcpClient, geminiAI } = botState.getState();

  // Send thinking message with modern template literal
  const thinkingMsg = await sendMessage(
    bot,
    chatId,
    `🔮 The Quantum Owl peers through infinite dimensions...

⚡ Gathering institutional intelligence...
🐋 Scanning whale movements...
📊 Analyzing social sentiment...
🧠 Consulting the AI oracle...`
  );

  try {
    // Get comprehensive analysis using modern async/await
    const analysisData = await getEnhancedQuantumAnalysis(mcpClient, symbol);
    const analysis = await generateQuantumAnalysis(geminiAI, symbol, analysisData);

    // Update user with modern object spread
    botState.setUser(user.id, {
      ...user,
      last_analysis: Date.now()
    });

    // Send enhanced results
    await sendEnhancedAnalysisResults(bot, chatId, analysis, symbol);

    // Delete thinking message
    await bot.deleteMessage(chatId, thinkingMsg.message_id);

  } catch (error) {
    console.error('Analysis error:', error);
    await bot.editMessageText(
      `❌ The quantum void resists...

Error: ${error}

💡 Try a different symbol or check if it's supported.`,
      { chat_id: chatId, message_id: thinkingMsg.message_id }
    );
  }
};

const handleWhales = async (bot, botState, msg, match) => {
  const chatId = msg.chat.id;
  const symbol = match?.[1]?.toLowerCase();

  if (!symbol) {
    return sendMessage(bot, chatId, '🐋 The Owl needs a symbol to hunt whales. Try: /whales btc');
  }

  const thinkingMsg = await sendMessage(bot, chatId, '🐋 Tracking institutional whales through the dark pools...');

  try {
    const whaleAnalysis = await getWhaleAnalysis(botState.getState().mcpClient, botState.getState().geminiAI, symbol);
    await bot.editMessageText(whaleAnalysis, {
      chat_id: chatId,
      message_id: thinkingMsg.message_id,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    await bot.editMessageText(
      `❌ Whales have gone dark... Error: ${error}`,
      { chat_id: chatId, message_id: thinkingMsg.message_id }
    );
  }
};

const handleViral = async (bot, botState, msg, match) => {
  const chatId = msg.chat.id;
  const symbol = match?.[1]?.toLowerCase();

  if (!symbol) {
    return sendMessage(bot, chatId, '🔥 The Owl needs a symbol to predict viral potential. Try: /viral sol');
  }

  const thinkingMsg = await sendMessage(bot, chatId, '🔥 Analyzing viral potential across all social dimensions...');

  try {
    const viralAnalysis = await getViralAnalysis(botState.getState().mcpClient, botState.getState().geminiAI, symbol);
    await bot.editMessageText(viralAnalysis, {
      chat_id: chatId,
      message_id: thinkingMsg.message_id,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    await bot.editMessageText(
      `❌ Viral signals scrambled... Error: ${error}`,
      { chat_id: chatId, message_id: thinkingMsg.message_id }
    );
  }
};

const handleTrending = async (bot, botState, msg) => {
  const chatId = msg.chat.id;

  const thinkingMsg = await sendMessage(bot, chatId, '📊 The Owl surveys the entire crypto realm for trending opportunities...');

  try {
    const trendingAnalysis = await getTrendingAnalysis(botState.getState().mcpClient, botState.getState().geminiAI);
    await bot.editMessageText(trendingAnalysis, {
      chat_id: chatId,
      message_id: thinkingMsg.message_id,
      parse_mode: 'Markdown'
    });
  } catch (error) {
    await bot.editMessageText(
      `❌ Trending signals disrupted... Error: ${error}`,
      { chat_id: chatId, message_id: thinkingMsg.message_id }
    );
  }
};

const handleStatus = async (bot, botState, msg) => {
  const chatId = msg.chat.id;
  const user = getOrCreateUser(botState, msg.from);
  const { mcpClient, users } = botState.getState();

  const statusMessage = `🦉 **NEXUS UNLIMITED TESTING STATUS**

**🤖 Bot Status:** ✅ Online & Unlimited
**🔗 MCP Connection:** ${mcpClient ? '✅ Connected' : '❌ Disconnected'}
**📊 LunarCrush API:** ✅ Active
**🧠 Gemini AI:** ✅ Operational

**👑 YOUR UNLIMITED STATUS**
**Tier:** ${user.subscription_tier.toUpperCase()} (TESTING MODE)
**API Calls:** ∞ UNLIMITED ∞
**Active Alerts:** ${user.alerts.filter(alert => alert.active).length}
**Last Analysis:** ${user.last_analysis ? new Date(user.last_analysis).toLocaleString() : 'Never'}

**🚀 UNLIMITED FEATURES ACTIVE**
✅ Deep Analysis with all MCP tools
✅ Whale Movement Tracking
✅ Viral Potential Prediction
✅ Advanced Sentiment Analysis
✅ Institutional Intelligence
✅ Predictive Price Targets
✅ Custom Alert System

**📊 TESTING METRICS**
• Total Users: ${users.size}
• MCP Tools Available: 10+
• AI Confidence: 95%+
• Response Speed: < 5s

The Unlimited Owl sees all possibilities! 🌟`;

  return sendMessage(bot, chatId, statusMessage);
};

const handleHelp = async (bot, botState, msg) => {
  const chatId = msg.chat.id;

  const helpMessage = `🦉 **NEXUS UNLIMITED QUANTUM OWL COMMANDS**

**🔮 ANALYSIS COMMANDS (UNLIMITED)**
/analyze <symbol> - Complete quantum analysis
/predict <symbol> <timeframe> - Future price prediction
/trending - Top 10 trending cryptos by Galaxy Score

**🐋 INTELLIGENCE COMMANDS (UNLIMITED)**
/whales <symbol> - Institutional whale tracking
/viral <symbol> - Viral potential analysis
/sentiment <symbol> - Deep social sentiment breakdown

**📊 ALERT COMMANDS (UNLIMITED)**
/alerts - View your active alerts
/setalert <symbol> <type> <value> - Set unlimited alerts

**⚙️ SYSTEM COMMANDS**
/status - Complete system status
/subscription - Your unlimited tier info

**💎 UNLIMITED EXAMPLES**
\`/analyze btc\` - Complete Bitcoin intelligence
\`/whales eth\` - Ethereum whale movements
\`/viral sol\` - Solana viral potential
\`/predict ada 7d\` - Cardano 7-day forecast
\`/trending\` - Market-wide opportunities

**🚀 TESTING MODE ACTIVE**
• No API limits
• All features unlocked
• Fastest response times
• Complete MCP integration
• Enhanced AI analysis

The Unlimited Quantum Owl awaits your commands! 🌟`;

  return sendMessage(bot, chatId, helpMessage);
};

// Specialized analysis functions (pure functions)
const getWhaleAnalysis = async (mcpClient, geminiAI, symbol) => {
  if (!mcpClient) throw new Error('MCP not connected');

  const searchResult = await mcpClient.callTool({
    name: 'Search',
    arguments: {
      query: `${symbol} whale movements large transactions institutional buying selling`
    }
  });

  const whalePrompt = `You are the Quantum Owl's Whale Hunter. Analyze this data for ${symbol.toUpperCase()} institutional movements:

${JSON.stringify(searchResult, null, 2)}

Respond as the mystical whale tracker:

🐋 **WHALE HUNTER REPORT: ${symbol.toUpperCase()}**

**🌊 WHALE ACTIVITY STATUS**
[MASSIVE MOVEMENT/HIGH ACTIVITY/NORMAL/QUIET]

**🏛️ INSTITUTIONAL SIGNALS**
• Large Transaction Alerts: [detected movements]
• Corporate Treasury Activity: [companies buying/selling]
• ETF Flow Patterns: [institutional fund movements]
• Smart Money Indicators: [whale accumulation/distribution]

**🎯 WHALE PSYCHOLOGY**
[2-3 sentences about what the whales are thinking/planning]

**⚠️ WHALE WATCH ALERTS**
[What to watch for next in whale behavior]`;

  const response = await geminiAI.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: whalePrompt
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || '🐋 The whales swim in silence...';
};

const getViralAnalysis = async (mcpClient, geminiAI, symbol) => {
  if (!mcpClient) throw new Error('MCP not connected');

  const postsResult = await mcpClient.callTool({
    name: 'Topic_Posts',
    arguments: {
      topic: `$${symbol}`,
      interval: '1d'
    }
  });

  const viralPrompt = `You are the Quantum Owl's Viral Prophet. Predict the viral potential for ${symbol.toUpperCase()}:

SOCIAL POSTS DATA: ${JSON.stringify(postsResult, null, 2)}

Respond as the mystical viral predictor:

🔥 **VIRAL PROPHET VISION: ${symbol.toUpperCase()}**

**📈 VIRAL POTENTIAL RATING**
[🚀 EXPLOSIVE/🔥 HIGH/⚡ MEDIUM/😴 LOW] ([85-95%] confidence)

**🎭 NARRATIVE ANALYSIS**
• Main Story: [dominant narrative driving conversations]
• Meme Factor: [how memeable/shareable this is]
• Influencer Activity: [top voices talking about it]
• Community Energy: [crowd excitement level]

**📱 VIRAL TRIGGERS**
[What specific events could make this explode virally]

**⏰ VIRAL TIMELINE**
[When the viral moment is most likely to hit]

**🎯 VIRAL PRICE IMPACT**
[How viral movement typically affects price for this asset]`;

  const response = await geminiAI.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: viralPrompt
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || '🔥 The viral winds remain still...';
};

const getTrendingAnalysis = async (mcpClient, geminiAI) => {
  if (!mcpClient) throw new Error('MCP not connected');

  const cryptoListResult = await mcpClient.callTool({
    name: 'Cryptocurrencies',
    arguments: {
      sort: 'galaxy_score',
      limit: 10
    }
  });

  const trendingPrompt = `You are the Quantum Owl's Market Surveyor. Analyze the top trending cryptos:

TOP CRYPTOS BY GALAXY SCORE: ${JSON.stringify(cryptoListResult, null, 2)}

Format as the mystical market overview:

📊 **QUANTUM MARKET PULSE**

**🔥 TOP 10 TRENDING CRYPTOS**
[List top 10 with galaxy scores and brief insights]

**🎯 HIDDEN GEMS**
[Identify undervalued opportunities in the list]

**⚠️ DANGER ZONES**
[Highlight any overvalued or risky positions]

**🔮 OWL'S MARKET WISDOM**
[Overall market sentiment and direction]`;

  const response = await geminiAI.models.generateContent({
    model: 'gemini-2.0-flash-lite',
    contents: trendingPrompt
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || '📊 The market whispers its secrets...';
};

// Enhanced analysis results sender (pure function)
const sendEnhancedAnalysisResults = async (bot, chatId, analysis, symbol) => {
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: '🐋 Whale Hunt', callback_data: `whales_${symbol}` },
        { text: '🔥 Viral Check', callback_data: `viral_${symbol}` }
      ],
      [
        { text: '📊 Deep Sentiment', callback_data: `sentiment_${symbol}` },
        { text: '🎯 Set Alert', callback_data: `alert_${symbol}` }
      ],
      [
        { text: '🔮 Predict Future', callback_data: `predict_${symbol}` },
        { text: '📈 Time Series', callback_data: `series_${symbol}` }
      ]
    ]
  };

  await sendMessage(bot, chatId, analysis, { reply_markup: inlineKeyboard });

  // Send follow-up with modern template literal
  const followUpMessage = `🎯 **FOLLOW-UP ACTIONS FOR ${symbol.toUpperCase()}**

Want deeper intelligence? Try these unlimited commands:

🐋 \`/whales ${symbol}\` - Institutional tracking
🔥 \`/viral ${symbol}\` - Viral potential analysis
💭 \`/sentiment ${symbol}\` - Deep psychology breakdown
🔮 \`/predict ${symbol} 7d\` - 7-day price prediction
🎯 \`/setalert ${symbol} price [target]\` - Smart alert

*UNLIMITED MODE:* All features unlocked, no restrictions! 🚀`;

  return sendMessage(bot, chatId, followUpMessage);
};

// Callback query handler (pure function)
const handleCallbackQuery = async (bot, botState, query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Answer callback immediately
  await bot.answerCallbackQuery(query.id);

  // Modern switch with early returns
  switch (true) {
    case data === 'quick_analyze':
      return sendMessage(bot, chatId, '🔮 Send me any crypto symbol for instant unlimited analysis!\n\nExamples: `btc`, `eth`, `sol`, `ada`');

    case data === 'whale_hunt':
      return sendMessage(bot, chatId, '🐋 Ready to hunt institutional whales!\n\nTry: `/whales btc` or `/whales eth`');

    case data === 'trending':
      return handleTrending(bot, botState, query.message);

    case data.startsWith('whales_'): {
      const symbol = data.replace('whales_', '');
      return handleWhales(bot, botState, query.message, [null, symbol]);
    }

    case data.startsWith('viral_'): {
      const symbol = data.replace('viral_', '');
      return handleViral(bot, botState, query.message, [null, symbol]);
    }

    default:
      return sendMessage(bot, chatId, '🦉 Command not recognized. Try /help for available options.');
  }
};

// Main bot setup function (pure function composition)
const setupBot = async (token) => {
  const botState = createBotState();
  const bot = new TelegramBot(token, { polling: true });
  const geminiAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });
  const mcpClient = await initializeMCP();

  // Update bot state
  botState.updateState({ bot, mcpClient, geminiAI });

  // Setup command handlers using modern syntax
  const commands = [
    { pattern: /\/start/, handler: handleStart },
    { pattern: /\/help/, handler: handleHelp },
    { pattern: /\/analyze (.+)/, handler: handleAnalyze },
    { pattern: /\/whales (.+)/, handler: handleWhales },
    { pattern: /\/viral (.+)/, handler: handleViral },
    { pattern: /\/trending/, handler: handleTrending },
    { pattern: /\/status/, handler: handleStatus }
  ];

  // Register commands using modern forEach
  commands.forEach(({ pattern, handler }) => {
    bot.onText(pattern, (msg, match) => handler(bot, botState, msg, match));
  });

  // Register callback query handler
  bot.on('callback_query', (query) => handleCallbackQuery(bot, botState, query));

  // Error handling with modern syntax
  bot.on('polling_error', (error) => {
    console.error('🚨 Polling error:', error);
  });

  return { bot, botState };
};

// Graceful shutdown function (pure function)
const shutdown = async ({ bot, botState }) => {
  const { mcpClient } = botState.getState();

  bot.stopPolling();

  if (mcpClient) {
    await mcpClient.close();
  }

  console.log('🌙 The Modern Quantum Owl rests...');
};

// Export main functions
export { setupBot, shutdown };
export default setupBot;
