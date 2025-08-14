# 🤖 NEXUS Telegram Bot Setup

## Quick Start

### 1. Create Telegram Bot
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Choose a name: `NEXUS Quantum Owl`
4. Choose a username: `nexus_quantum_owl_bot`
5. Copy the bot token

### 2. Update Environment Variables
Add to your `.env.local`:
```bash
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_WEBHOOK_URL=https://your-domain.com/api/telegram
```

### 3. Development Mode (Polling)
```bash
# Install additional dependencies if needed
yarn add tsx

# Start the bot in development mode
yarn bot:dev
```

### 4. Production Mode (Webhook)
```bash
# Deploy your Next.js app with webhook endpoint
# Then set webhook URL in Telegram:
curl -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/telegram"}'
```

## Bot Commands

- `/start` - Welcome message and quick actions
- `/analyze <symbol>` - Deep crypto analysis
- `/predict <symbol> <timeframe>` - Price prediction
- `/alerts` - View active alerts
- `/setalert <symbol> <type> <value>` - Create alert
- `/status` - Bot and user status
- `/help` - Full command list

## Testing

1. Visit `/bot` page in your web app
2. Use webhook testing interface
3. Check bot logs for debugging

## Architecture

- **Development**: Polling mode with `node-telegram-bot-api`
- **Production**: Webhook mode with Next.js API routes
- **MCP Integration**: Direct connection to LunarCrush
- **AI**: Gemini 2.0 Flash for mystical responses
- **State**: Zustand store for user management
