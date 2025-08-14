import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// NEXUS: Telegram Webhook Handler
// Production-ready webhook for Telegram bot

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    message: any;
    data: string;
  };
}

// Verify webhook authenticity
function verifyTelegramWebhook(body: string, signature: string): boolean {
  const secret = crypto.createHash('sha256')
    .update(process.env.TELEGRAM_BOT_TOKEN!)
    .digest();

  const hash = crypto.createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return hash === signature;
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-telegram-bot-api-secret-token');

    // Verify webhook in production
    if (process.env.NODE_ENV === 'production' && signature) {
      if (!verifyTelegramWebhook(body, signature)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update: TelegramUpdate = JSON.parse(body);

    // Process the update
    await processUpdate(update);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Process incoming updates
async function processUpdate(update: TelegramUpdate) {
  // Handle messages
  if (update.message) {
    await handleMessage(update.message);
  }

  // Handle callback queries (inline buttons)
  if (update.callback_query) {
    await handleCallbackQuery(update.callback_query);
  }
}

// Handle incoming messages
async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;

  console.log(`📨 Message from ${message.from.first_name}: ${text}`);

  // Route commands
  if (text?.startsWith('/start')) {
    await sendTelegramMessage(chatId, '🦉 NEXUS Quantum Owl awakens via webhook!');
  } else if (text?.startsWith('/analyze')) {
    const symbol = text.split(' ')[1];
    if (symbol) {
      await handleAnalyzeCommand(chatId, symbol);
    } else {
      await sendTelegramMessage(chatId, '🦉 Please provide a symbol: /analyze btc');
    }
  }
  // Add more command handlers...
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  console.log(`🖱️ Callback from ${callbackQuery.from.first_name}: ${data}`);

  // Handle different callback actions
  switch (data) {
    case 'quick_analyze':
      await sendTelegramMessage(chatId, '🔮 Send me a crypto symbol to analyze!');
      break;
    case 'upgrade':
      await sendTelegramMessage(chatId, '🦉 Upgrade options coming soon!');
      break;
    // Add more callback handlers...
  }

  // Answer callback query
  await answerCallbackQuery(callbackQuery.id);
}

// Analyze command handler
async function handleAnalyzeCommand(chatId: number, symbol: string) {
  try {
    // Use the same analysis logic from your existing API
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol: symbol.toLowerCase() })
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    const analysis = await response.json();

    // Format for Telegram
    const message = `🦉 **QUANTUM ANALYSIS: ${symbol.toUpperCase()}**

💰 **Price:** $${analysis.current_price?.toLocaleString() || 'N/A'}
📊 **Recommendation:** ${analysis.recommendation}
🎯 **Confidence:** ${analysis.confidence}%

🧠 **The Owl's Wisdom:**
${analysis.reasoning}

Galaxy Score: ${analysis.key_metrics?.galaxy_score || 'N/A'}
Social Sentiment: ${analysis.key_metrics?.sentiment || 'N/A'}%`;

    await sendTelegramMessage(chatId, message);

  } catch (error) {
    await sendTelegramMessage(chatId, '❌ Analysis failed. The quantum void resists...');
  }
}

// Send message to Telegram
async function sendTelegramMessage(chatId: number, text: string, options?: any) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...options
    })
  });
}

// Answer callback query
async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackQueryId,
      text
    })
  });
}
