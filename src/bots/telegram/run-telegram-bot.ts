// Environment already loaded by start.ts
import NexusTelegramBot from './telegram-bot';

(async () => {
  try {
    console.log('🦉 NEXUS Telegram Bot starting...');

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
    }

    const bot = new NexusTelegramBot(botToken);

    // Get bot info and set commands
    const botInfo = await bot.getBotInfo();
    await bot.setBotCommands();

    console.log('✅ NEXUS Quantum Owl is now online in Telegram!');
    console.log(`🤖 Bot username: @${botInfo.username}`);
    console.log('🎯 Ready to receive /owl_* commands');
    console.log('');
    console.log('Available commands:');
    console.log('  /owl_analyze [symbol] - Mystical crypto analysis');
    console.log('  /owl_trending - Top trending cryptos');
    console.log('  /owl_alerts - Manage price alerts');
    console.log('  /owl_status - Account status');
    console.log('  /owl_help - Command help');
    console.log('  /start - Welcome message');
    console.log('');
    console.log('🔮 The Quantum Owl awakens on Telegram! Press Ctrl+C to stop.');

  } catch (error) {
    console.error('❌ Failed to start NEXUS Telegram bot:', error);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('1. Check your .env.local file has TELEGRAM_BOT_TOKEN');
    console.error('2. Verify the bot token is valid');
    console.error('3. Make sure the bot is created via @BotFather');
    process.exit(1);
  }
})();
