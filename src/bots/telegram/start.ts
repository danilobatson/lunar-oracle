// Load environment variables FIRST
import * as dotenv from 'dotenv';
import { join } from 'path';

console.log('🔑 Loading environment variables...');
dotenv.config({ path: join(process.cwd(), '.env.local') });

// Verify Telegram environment variables
const requiredEnvVars = [
  'TELEGRAM_BOT_TOKEN',
  'LUNARCRUSH_API_KEY',
  'GOOGLE_GEMINI_API_KEY'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\n💡 Add these to your .env.local file');
  process.exit(1);
}

console.log('✅ All required environment variables loaded');
console.log(`🔑 Telegram Token: ${process.env.TELEGRAM_BOT_TOKEN?.substring(0, 15)}...`);

// Import and start the bot runner
import('./run-telegram-bot');
