import dotenv from 'dotenv';
import { setupBot, shutdown } from './nexus-bot-modern';

// NEXUS: Modern ES6+ Bot Startup
// Pure functional approach with modern syntax

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validation using modern syntax
const validateEnvironment = () => {
  const requiredEnvs = [
    'TELEGRAM_BOT_TOKEN',
    'LUNARCRUSH_API_KEY',
    'GOOGLE_GEMINI_API_KEY'
  ];

  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

  if (missingEnvs.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingEnvs.join(', ')}`);
    process.exit(1);
  }

  return true;
};

// Main startup function
const startBot = async () => {
  try {
    validateEnvironment();

    console.log('🦉 NEXUS Modern Quantum Owl starting...');
    console.log('⚡ Using modern ES6+ functional syntax...');

    const botInstance = await setupBot(process.env.TELEGRAM_BOT_TOKEN);

    // Graceful shutdown handlers using modern syntax
    const shutdownHandlers = ['SIGINT', 'SIGTERM'];

    shutdownHandlers.forEach(signal => {
      process.on(signal, async () => {
        console.log(`\n🌙 Received ${signal} - Shutting down Modern Quantum Owl...`);
        await shutdown(botInstance);
        process.exit(0);
      });
    });

    console.log('🚀 NEXUS Modern Quantum Owl is now watching the crypto realm...');
    console.log('⚡ Unlimited mode with modern ES6+ syntax active!');
    console.log('🔮 Ready to deliver maximum intelligence!');

  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

// Start the bot
startBot();
