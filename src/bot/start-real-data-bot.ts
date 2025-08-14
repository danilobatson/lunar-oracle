import dotenv from 'dotenv';
import { setupBot, shutdown } from './nexus-bot-real-data';

// NEXUS: 100% Real Data Bot Startup
// NO MOCK DATA - ALL MCP CALLS

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

    console.log('🔥 NEXUS Real Data Quantum Owl starting...');
    console.log('📊 100% Real MCP Data Mode...');
    console.log('🚫 NO MOCK DATA - ALL LIVE API CALLS');

    const botInstance = await setupBot(process.env.TELEGRAM_BOT_TOKEN);

    const shutdownHandlers = ['SIGINT', 'SIGTERM'];

    shutdownHandlers.forEach(signal => {
      process.on(signal, async () => {
        console.log(`\n🌙 Received ${signal} - Shutting down...`);
        await shutdown(botInstance);
        process.exit(0);
      });
    });

    console.log('✅ NEXUS Real Data Quantum Owl is ready!');
    console.log('🔥 Every command makes real MCP API calls!');
    console.log('🎯 Zero placeholders - only truth!');

  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();
