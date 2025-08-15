import TelegramBot from 'node-telegram-bot-api';
import { handleOwlAnalyze, handleOwlTrending, handleOwlAlerts, handleOwlStatus, handleOwlHelp } from '../../shared/commands/handlers';
import { CommandContext } from '../../shared/commands/types';

// NEXUS Telegram Bot - SAME commands as Slack (underscores)!
class NexusTelegramBot {
  private bot: TelegramBot;

  constructor(token: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.setupCommands();
    this.setupMessageHandlers();
  }

  // Helper: Create command context from Telegram message
  private createContext(msg: TelegramBot.Message): CommandContext {
    return {
      platform: 'telegram',
      userId: msg.from?.id.toString() || 'unknown',
      channelId: msg.chat.id.toString(),
      teamId: undefined,
      tier: 'free', // TODO: Look up actual subscription tier
    };
  }

  // Helper: Send chunked response to Telegram (4096 char limit)
  private async sendChunkedResponse(chatId: number, chunks: string[]) {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Add chunk indicator if multiple chunks
      const chunkText = chunks.length > 1
        ? `${chunk}\n\n_Part ${i + 1} of ${chunks.length}_`
        : chunk;

      try {
        await this.bot.sendMessage(chatId, chunkText, {
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        });

        // Small delay between chunks to avoid rate limits
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Failed to send chunk ${i + 1}:`, error);
        // Try without markdown if it fails
        await this.bot.sendMessage(chatId, chunkText);
      }
    }
  }

  // Setup all bot commands - SAME AS SLACK!
  private setupCommands() {
    console.log('🔧 Setting up Telegram commands (matching Slack format with underscores)...');

    // Command: /owl_analyze [symbol] - SAME AS SLACK ✅
    this.bot.onText(/\/owl_analyze(?:\s+(\w+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const symbol = match?.[1]?.toUpperCase();

      if (!symbol) {
        await this.bot.sendMessage(chatId, '🦉 Please provide a crypto symbol: `/owl_analyze BTC`', {
          parse_mode: 'Markdown'
        });
        return;
      }

      // Show thinking message
      await this.bot.sendMessage(chatId, `🦉 The Quantum Owl awakens to analyze ${symbol}... ✨`);

      const context = this.createContext(msg);
      const result = await handleOwlAnalyze({ symbol, context });

      if (result.success && result.chunks) {
        await this.sendChunkedResponse(chatId, result.chunks);
      } else {
        await this.bot.sendMessage(chatId, `🚨 ${result.error || 'The Owl\'s vision is clouded. Please try again.'}`);
      }
    });

    // Command: /owl_trending - SAME AS SLACK ✅
    this.bot.onText(/\/owl_trending/, async (msg) => {
      const chatId = msg.chat.id;

      await this.bot.sendMessage(chatId, '🦉 Scanning quantum trending patterns across all platforms... ✨');

      const context = this.createContext(msg);
      const result = await handleOwlTrending({ context });

      if (result.success && result.chunks) {
        await this.sendChunkedResponse(chatId, result.chunks);
      } else {
        await this.bot.sendMessage(chatId, '🦉 Unable to scan trending patterns. Please try again.');
      }
    });

    // Command: /owl_alerts [action] [symbol] - SAME AS SLACK ✅
    this.bot.onText(/\/owl_alerts(?:\s+(\w+))?(?:\s+(\w+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const action = match?.[1]?.toLowerCase() || 'list';
      const symbol = match?.[2]?.toUpperCase();

      const context = this.createContext(msg);
      const result = await handleOwlAlerts({ context, action, symbol });

      if (result.success && result.chunks) {
        await this.sendChunkedResponse(chatId, result.chunks);
      } else {
        await this.bot.sendMessage(chatId, '🦉 Alert system temporarily unavailable.');
      }
    });

    // Command: /owl_status - SAME AS SLACK ✅
    this.bot.onText(/\/owl_status/, async (msg) => {
      const chatId = msg.chat.id;

      const context = this.createContext(msg);
      const result = await handleOwlStatus(context);

      if (result.success && result.chunks) {
        await this.sendChunkedResponse(chatId, result.chunks);
      } else {
        await this.bot.sendMessage(chatId, '🦉 Unable to retrieve account status.');
      }
    });

    // Command: /owl_help - SAME AS SLACK ✅
    this.bot.onText(/\/owl_help/, async (msg) => {
      const chatId = msg.chat.id;

      const context = this.createContext(msg);
      const result = await handleOwlHelp(context);

      if (result.success && result.chunks) {
        await this.sendChunkedResponse(chatId, result.chunks);
      } else {
        await this.bot.sendMessage(chatId, '🦉 Help system temporarily unavailable.');
      }
    });

    // Command: /start - Welcome message (Telegram-specific)
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstName = msg.from?.first_name || 'Crypto Seeker';

      const welcomeMessage = `🦉 *Welcome to NEXUS Quantum Owl, ${firstName}!*

Your mystical crypto oracle providing institutional-grade intelligence that AIXBT charges $78K for!

✨ *Available Commands (SAME as Slack):*
• \`/owl_analyze BTC\` - Rich crypto analysis
• \`/owl_trending\` - Top trending cryptos
• \`/owl_alerts\` - Manage price alerts
• \`/owl_status\` - Account status
• \`/owl_help\` - Full command guide

🔮 *The Owl sees 24-48 hours ahead of market movements*

📈 Ready to dominate crypto? Start with \`/owl_analyze BTC\`!

⚡ *Same commands work on Slack and Telegram - true cross-platform experience!*`;

      await this.bot.sendMessage(chatId, welcomeMessage, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      });
    });
  }

  // Setup message handlers for non-command messages
  private setupMessageHandlers() {
    // Handle non-command messages
    this.bot.on('message', async (msg) => {
      // Skip if it's a command
      if (msg.text?.startsWith('/')) return;

      const chatId = msg.chat.id;

      // Simple help for regular messages
      if (msg.text) {
        await this.bot.sendMessage(chatId,
          '🦉 I understand mystical crypto commands! Try:\n\n' +
          '• `/owl_analyze BTC` - Analyze Bitcoin\n' +
          '• `/owl_help` - See all commands\n\n' +
          '✨ Same commands as Slack - true cross-platform experience!'
        );
      }
    });

    // Handle bot errors
    this.bot.on('error', (error) => {
      console.error('❌ Telegram bot error:', error);
    });

    // Handle polling errors
    this.bot.on('polling_error', (error) => {
      console.error('❌ Telegram polling error:', error);
    });
  }

  // Set bot commands menu (shows in Telegram UI) - UNDERSCORE FORMAT
  async setBotCommands() {
    try {
      await this.bot.setMyCommands([
        { command: 'start', description: 'Welcome message and setup' },
        { command: 'owl_analyze', description: 'Get mystical crypto analysis' },
        { command: 'owl_trending', description: 'See top trending cryptos' },
        { command: 'owl_alerts', description: 'Manage price alerts' },
        { command: 'owl_status', description: 'Check account status' },
        { command: 'owl_help', description: 'Show all commands' },
      ]);
      console.log('✅ Telegram bot commands menu set (underscore format)');
    } catch (error) {
      console.error('❌ Failed to set bot commands:', error);
    }
  }

  // Get bot info
  async getBotInfo() {
    try {
      const me = await this.bot.getMe();
      console.log(`🤖 Bot connected: @${me.username} (${me.first_name})`);
      return me;
    } catch (error) {
      console.error('❌ Failed to get bot info:', error);
      throw error;
    }
  }
}

export default NexusTelegramBot;
