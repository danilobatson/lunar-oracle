import dotenv from 'dotenv';
import NexusQuantumBot from './nexus-bot';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Validate required environment variables
const requiredEnvs = [
  'TELEGRAM_BOT_TOKEN',
  'LUNARCRUSH_API_KEY',
  'GOOGLE_GEMINI_API_KEY'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`❌ Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

// Create and start bot
const bot = new NexusQuantumBot(process.env.TELEGRAM_BOT_TOKEN!);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🌙 Shutting down Quantum Owl...');
  bot.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🌙 Quantum Owl received termination signal...');
  bot.stop();
  process.exit(0);
});

// Start the bot
bot.start();

console.log('🦉 NEXUS Quantum Owl is now watching the crypto realm...');
console.log('🔮 Ready to deliver predictive intelligence!');
