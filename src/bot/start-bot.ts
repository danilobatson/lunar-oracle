import dotenv from 'dotenv';
import { setupBot, shutdown } from './nexus-bot';

// NEXUS: Fixed Bot Startup
// With Telegram message length handling

dotenv.config({ path: '.env.local' });

const validateEnvironment = () => {
  const requiredEnvs = [
    'TELEGRAM_BOT_TOKEN',
    'LUNARCRUSH_API_KEY',
    'GOOGLE_GEMINI_API_KEY'
  ];

  const missingEnvs = requiredEnvs.filter(env => !process.env[env]);

  if (missingEnvs.length > 0) {
    console.error(`❌ Missing environment variables: ${missingEnvs.join(', ')}`);
    process.exit(1);
  }

  return true;
};

const startBot = async () => {
  try {
    validateEnvironment();

    console.log('🦉 NEXUS Fixed Quantum Owl starting...');
    console.log('📱 Message length limits handled...');

    const botInstance = await setupBot(process.env.TELEGRAM_BOT_TOKEN);

    const shutdownHandlers = ['SIGINT', 'SIGTERM'];

    shutdownHandlers.forEach(signal => {
      process.on(signal, async () => {
        console.log(`\n🌙 Received ${signal} - Shutting down...`);
        await shutdown(botInstance);
        process.exit(0);
      });
    });

    console.log('✅ NEXUS Fixed Quantum Owl is ready!');
    console.log('📱 Smart message chunking active!');
    console.log('🔮 Optimized for Telegram limits!');

  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
